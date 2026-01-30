
import { TerraformModel } from '../../../terraform.model';

export const DataAwsVpcModelV1: TerraformModel = {
  version: '1.0.0',
  provider: 'aws',
  provider_version: '>= 6.0',
  resource: 'data_aws_vpc', // Special handling needed in generator
  _logicalName: 'selected',
  attributes: {
    id: '', 
  }
};
