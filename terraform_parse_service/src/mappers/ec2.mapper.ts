
import { Ec2RequestDto } from '../dto/ec2.dto';
import { TerraformModel } from '../models/terraform.model';
import { AwsProviderModelV1 } from '../models/definitions/aws/provider/v1';
import { Ec2InstanceModelV1 } from '../models/definitions/aws/ec2/instance_v1';
import { SecurityGroupModelV1 } from '../models/definitions/aws/ec2/security_group_v1';
import { DataAwsVpcModelV1 } from '../models/definitions/aws/ec2/data_vpc_v1';

export class Ec2Mapper {
  static toModels(dto: Ec2RequestDto): TerraformModel[] {
    const { region, instance_name, ami, instance_type, vpc_id, subnet_id, security_group_id, provider_config } = dto.payload;
    const models: TerraformModel[] = [];

    // 1. AWS Provider
    models.push({
      ...AwsProviderModelV1,
      attributes: {
        ...AwsProviderModelV1.attributes,
        region: region,
        profile: provider_config?.profile,
        assume_role: provider_config?.assume_role,
        default_tags: provider_config?.default_tags,
      },
    });

    let targetSgId = security_group_id;

    // 2. Security Group (Conditional)
    if (!targetSgId) {
      // 2a. Data Source for VPC CIDR
      const vpcDataModel = {
        ...DataAwsVpcModelV1,
        attributes: {
            id: vpc_id
        }
      };
      models.push(vpcDataModel);

      // 2b. Create New Security Group
      const sgName = `${instance_name}-sg`;
      const sgModel: TerraformModel = {
        ...SecurityGroupModelV1,
        _logicalName: sgName, // Unique resource name
        attributes: {
          name: sgName,
          vpc_id: vpc_id,
          ingress: [
            {
              from_port: 0,
              to_port: 0,
              protocol: '-1',
              cidr_blocks: [`\${data.aws_vpc.${vpcDataModel._logicalName}.cidr_block}`],
              description: 'Allow all from VPC CIDR',
              ipv6_cidr_blocks: [],
              prefix_list_ids: [],
              security_groups: [],
              self: false
            }
          ],
          egress: [
            {
              from_port: 0, 
              to_port: 0, 
              protocol: '-1', 
              cidr_blocks: ['0.0.0.0/0'],
              description: 'Allow all outbound',
              ipv6_cidr_blocks: [],
              prefix_list_ids: [],
              security_groups: [],
              self: false
            }
          ]
        }
      };
      models.push(sgModel);
      
      // key reference: aws_security_group.p-sg.id
      targetSgId = `\${aws_security_group.${sgName}.id}`;
    }

    // 3. EC2 Instance
    models.push({
      ...Ec2InstanceModelV1,
      _logicalName: instance_name,
      attributes: {
        ami: ami,
        instance_type: instance_type,
        subnet_id: subnet_id,
        vpc_security_group_ids: [targetSgId],
        tags: {
            Name: instance_name
        }
      }
    });

    return models;
  }
}
