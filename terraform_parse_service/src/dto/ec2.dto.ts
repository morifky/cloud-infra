
import { z } from 'zod';
import { ProviderConfigSchema } from './common.dto';

export const Ec2PayloadSchema = z.object({
  region: z.string(),
  instance_name: z.string(),
  ami: z.string(),
  instance_type: z.string(),
  vpc_id: z.string(),
  subnet_id: z.string(),
  security_group_id: z.string().optional(), 
  // vpc_cidr is NOT required anymore, using data source
  provider_config: ProviderConfigSchema.optional(),
});

export const Ec2RequestDtoSchema = z.object({
  payload: Ec2PayloadSchema,
});

export type Ec2RequestDto = z.infer<typeof Ec2RequestDtoSchema>;
