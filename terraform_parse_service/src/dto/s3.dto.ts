import { z } from 'zod';
import { ProviderConfigSchema } from './common.dto';

// S3 Payload Schema

export const S3PayloadSchema = z.object({
  region: z.string(),
  bucket_name: z.string(),
  acl: z.enum(['private', 'public-read', 'public-read-write', 'authenticated-read']),
  provider_config: ProviderConfigSchema.optional(),
});

export const S3RequestDtoSchema = z.object({
  payload: S3PayloadSchema,
});

export type S3RequestDto = z.infer<typeof S3RequestDtoSchema>;
