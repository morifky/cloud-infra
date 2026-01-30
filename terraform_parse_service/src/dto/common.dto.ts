
import { z } from 'zod';

// Provider Config Schema
export const ProviderConfigSchema = z.object({
  profile: z.string().optional(),
  assume_role: z.object({
    role_arn: z.string(),
    session_name: z.string().optional(),
    external_id: z.string().optional(),
  }).optional(),
  default_tags: z.object({
      tags: z.record(z.string()),
  }).optional(),
});
