
import { TerraformModel } from '../../../terraform.model';

export const AwsProviderModelV1: TerraformModel = {
  version: '1.0.0',
  provider: 'aws',
  provider_version: '>= 6.0', 
  resource: 'provider',
  _logicalName: 'aws',
  attributes: {
    region: '',
    profile: null,
    assume_role: null, // Block
    default_tags: null, // Block
  } 
};
