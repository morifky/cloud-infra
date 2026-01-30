
export interface TerraformModel {
  version: string;
  provider: string;
  provider_version: string;
  resource: string;
  attributes: Record<string, any>;
  _logicalName: string;
}
