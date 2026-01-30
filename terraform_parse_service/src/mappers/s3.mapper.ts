
import { S3RequestDto } from '../dto/s3.dto';
import { TerraformModel } from '../models/terraform.model';
import { AwsProviderModelV1 } from '../models/definitions/aws/provider/v1';
import { S3BucketModelV1 } from '../models/definitions/aws/s3/s3_bucket_v1';
import { S3BucketAclModelV1 } from '../models/definitions/aws/s3/s3_bucket_acl_v1';

export class S3Mapper {
  static toModels(dto: S3RequestDto): TerraformModel[] {
    const { region, bucket_name, acl, provider_config } = dto.payload;
    const models: TerraformModel[] = [];

    // 1. AWS Provider Model
    models.push({
      ...AwsProviderModelV1,
      attributes: {
        ...AwsProviderModelV1.attributes, // preserve defaults if any
        region: region,
        profile: provider_config?.profile,
        assume_role: provider_config?.assume_role,
        default_tags: provider_config?.default_tags,
      },
    });

    // 2. S3 Bucket Model
    models.push({
      ...S3BucketModelV1,
      _logicalName: bucket_name,
      attributes: {
        ...S3BucketModelV1.attributes,
        bucket: bucket_name,
      },
    });

    // 3. S3 Bucket ACL Model
    models.push({
      ...S3BucketAclModelV1,
      _logicalName: `${bucket_name}_acl`,
      attributes: {
        ...S3BucketAclModelV1.attributes,
        bucket: `aws_s3_bucket.${bucket_name}.id`, // Dependency reference
        acl: acl,
      },
    });

    return models;
  }
}
