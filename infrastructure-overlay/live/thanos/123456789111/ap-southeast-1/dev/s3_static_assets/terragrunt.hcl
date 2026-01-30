include "root" {
  path = find_in_parent_folders("root.hcl")
  expose = true
}

terraform {
  source = "${get_path_to_repo_root()}//infrastructure-overlay/modules/s3-bucket/v1.0.0"
}

inputs = {
  bucket_name = "${include.root.locals.project_name}-${include.root.locals.environment}-static-assets"

  # ACL Configuration
  acl                      = "public-read"
  control_object_ownership = true
  object_ownership         = "BucketOwnerPreferred"

  # Public Access Block Configuration
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false

  force_destroy = true

  server_side_encryption_configuration = {
    rule = {
      apply_server_side_encryption_by_default = {
        sse_algorithm = "AES256"
      }
    }
  }
}
