
import { TerraformModel } from '../../../terraform.model';

export const S3BucketAclModelV1: TerraformModel = {
  version: '1.0.0',
  provider: 'aws',
  provider_version: '>= 6.0',
  resource: 'aws_s3_bucket_acl',
  _logicalName: '', 
  attributes: {
    bucket: '', // Dependency reference
    acl: 'private', // Default
  } 
};
