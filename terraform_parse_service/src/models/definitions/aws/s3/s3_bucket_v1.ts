
import { TerraformModel } from '../../../terraform.model';

export const S3BucketModelV1: TerraformModel = {
  version: '1.0.0',
  provider: 'aws',
  provider_version: '>= 6.0',
  resource: 'aws_s3_bucket',
  _logicalName: '', 
  attributes: {
    bucket: '', // To be overridden
  } 
};
