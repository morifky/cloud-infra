
import { TerraformModel } from '../../../terraform.model';

export const SecurityGroupModelV1: TerraformModel = {
  version: '1.0.0',
  provider: 'aws',
  provider_version: '>= 6.0',
  resource: 'aws_security_group',
  _logicalName: '',
  attributes: {
    name: '',
    vpc_id: '',
    ingress: [],
    egress: [],
    tags: {},
  }
};
