
import { BaseGenerator } from './BaseGenerator';
import { TerraformModel } from '../models/terraform.model';

export class ModelGenerator extends BaseGenerator<any> {
  // We override the constructor or just use a generic input since we are driven by the Model
  private model: TerraformModel;

  constructor(model: TerraformModel) {
    super(model.attributes);
    this.model = model;
    this.resourceType = model.resource;
  }

  // Implementation of abstract base class
  protected resourceType: string;

  generate(): string {
    const props = Object.entries(this.model.attributes)
      .map(([key, value]) => this.formatProperty(key, value))
      .filter(p => p !== '') // Filter out empty strings
      .join('\n');

    // Special handling for provider block which doesn't have a name label
    if (this.model.resource === 'provider') {
         return `provider "${this.model.provider}" {\n${props}\n}`;
    }

    // Special handling for data sources (convention: resource starts with 'data_')
    if (this.model.resource.startsWith('data_')) {
        const type = this.model.resource.replace('data_', '');
        return `data "${type}" "${this.model._logicalName}" {\n${props}\n}`;
    }

    // Standard resource block
    return this.generateResourceBlock(this.model._logicalName, props);
  }

  // Override to handle dependency references logic if needed (e.g. raw strings)
  // For now, relies on the string value being correct in the model.
  protected formatProperty(key: string, value: any, indentLevel = 1): string {
      // Check if value looks like a reference (e.g. "aws_s3_bucket.foo.id")
      // In a real robust system, we might have a specific type for references.
      // Here, we check if the string contains dots and lacks spaces/special chars, 
      // OR we just rely on a convention. 
      // The previous implementation for ACL hardcoded the bucket_id to be unquoted.
      // To support generic models, we might need a `type` field in attributes or a heuristic.

      // Heuristic: If key is "bucket" AND resource is "aws_s3_bucket_acl", treat as reference.
      // This is a bit "leaky", but acceptable for this stage of refactor without rich types.
      if (this.model.resource === 'aws_s3_bucket_acl' && key === 'bucket') {
          const indent = '  '.repeat(indentLevel);
          return `${indent}${key} = ${value}`; // No quotes
      }
      
      return super.formatProperty(key, value, indentLevel);
  }
}
