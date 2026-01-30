
import { TerraformModel } from '../../../terraform.model';

export const Ec2InstanceModelV1: TerraformModel = {
  version: '1.0.0',
  provider: 'aws',
  provider_version: '>= 6.0',
  resource: 'aws_instance',
  _logicalName: '',
  attributes: {
    ami: '',
    instance_type: '',
    subnet_id: '',
    vpc_security_group_ids: [],
    tags: {},
  }
};
