resource "aws_s3_bucket" "this" {
  bucket        = var.bucket_name
  force_destroy = var.force_destroy
  tags          = var.tags
}

resource "aws_s3_bucket_ownership_controls" "this" {
  count = var.control_object_ownership ? 1 : 0

  bucket = aws_s3_bucket.this.id

  rule {
    object_ownership = var.object_ownership
  }
}

resource "aws_s3_bucket_public_access_block" "this" {
  bucket = aws_s3_bucket.this.id

  block_public_acls       = var.block_public_acls
  block_public_policy     = var.block_public_policy
  ignore_public_acls      = var.ignore_public_acls
  restrict_public_buckets = var.restrict_public_buckets
}

resource "aws_s3_bucket_acl" "this" {
  count = var.acl != null ? 1 : 0

  depends_on = [aws_s3_bucket_ownership_controls.this]

  bucket = aws_s3_bucket.this.id
  acl    = var.acl
}

resource "aws_s3_bucket_versioning" "this" {
  count = length(keys(var.versioning)) > 0 ? 1 : 0

  bucket = aws_s3_bucket.this.id

  versioning_configuration {
    status     = try(var.versioning["status"], "Enabled")
    mfa_delete = try(var.versioning["mfa_delete"], null)
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "this" {
  count = length(keys(var.server_side_encryption_configuration)) > 0 ? 1 : 0

  bucket = aws_s3_bucket.this.id

  dynamic "rule" {
    for_each = try(flatten([var.server_side_encryption_configuration["rule"]]), [])

    content {
      bucket_key_enabled = try(rule.value.bucket_key_enabled, null)

      dynamic "apply_server_side_encryption_by_default" {
        for_each = try([rule.value.apply_server_side_encryption_by_default], [])

        content {
          sse_algorithm     = apply_server_side_encryption_by_default.value.sse_algorithm
          kms_master_key_id = try(apply_server_side_encryption_by_default.value.kms_master_key_id, null)
        }
      }
    }
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "this" {
  count = length(var.lifecycle_rule) > 0 ? 1 : 0

  bucket = aws_s3_bucket.this.id

  dynamic "rule" {
    for_each = var.lifecycle_rule

    content {
      id     = try(rule.value.id, null)
      status = try(rule.value.status, "Enabled")

      # abort_incomplete_multipart_upload
      dynamic "abort_incomplete_multipart_upload" {
        for_each = try([rule.value.abort_incomplete_multipart_upload], [])
        content {
          days_after_initiation = try(abort_incomplete_multipart_upload.value.days_after_initiation, null)
        }
      }

      # expiration
      dynamic "expiration" {
        for_each = try(flatten([rule.value.expiration]), [])
        content {
          date                         = try(expiration.value.date, null)
          days                         = try(expiration.value.days, null)
          expired_object_delete_marker = try(expiration.value.expired_object_delete_marker, null)
        }
      }

      # transition
      dynamic "transition" {
        for_each = try(flatten([rule.value.transition]), [])
        content {
          date          = try(transition.value.date, null)
          days          = try(transition.value.days, null)
          storage_class = transition.value.storage_class
        }
      }

      # noncurrent_version_expiration
      dynamic "noncurrent_version_expiration" {
        for_each = try(flatten([rule.value.noncurrent_version_expiration]), [])
        content {
          noncurrent_days           = try(noncurrent_version_expiration.value.noncurrent_days, null)
          newer_noncurrent_versions = try(noncurrent_version_expiration.value.newer_noncurrent_versions, null)
        }
      }

      # noncurrent_version_transition
      dynamic "noncurrent_version_transition" {
        for_each = try(flatten([rule.value.noncurrent_version_transition]), [])
        content {
          noncurrent_days           = try(noncurrent_version_transition.value.noncurrent_days, null)
          newer_noncurrent_versions = try(noncurrent_version_transition.value.newer_noncurrent_versions, null)
          storage_class             = noncurrent_version_transition.value.storage_class
        }
      }

      # filter
      dynamic "filter" {
        for_each = length(try(flatten([rule.value.filter]), [])) > 0 ? [rule.value.filter] : []
        content {
            prefix = try(filter.value.prefix, null)
            # Add tags/and/etc logic if needed, simplify for now or iterate
            # For simplicity in this iteration, supporting prefix in filter, or if empty (apply to whole bucket)
        }
      }
    }
  }
}
