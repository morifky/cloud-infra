
export interface TerraformResource {
  toHcl(): string;
}

export abstract class BaseGenerator<TInput> {
  protected abstract resourceType: string;

  constructor(protected readonly input: TInput) {}

  abstract generate(): string;

  protected formatProperty(key: string, value: any, indentLevel = 1): string {
    const indent = '  '.repeat(indentLevel);
    
    if (value === undefined || value === null) {
      return '';
    }

    if (Array.isArray(value)) {
      const items = value.map(v => this.formatPropertyVal(v, indentLevel + 1)).join(',\n');
      return `${indent}${key} = [\n${items}\n${indent}]`;
    }

    if (typeof value === 'object') {
        const props = Object.entries(value)
            .map(([k, v]) => this.formatProperty(k, v, indentLevel + 1))
            .filter(s => s.trim() !== '')
            .join('\n');
        return `${indent}${key} = {\n${props}\n${indent}}`;
    }

    return `${indent}${key} = ${this.formatPropertyVal(value, indentLevel)}`;
  }

  private formatPropertyVal(value: any, indentLevel: number): string {
      if (typeof value === 'string') {
          return `"${value}"`;
      }
      if (typeof value === 'boolean') {
          return value.toString();
      }
      if (typeof value === 'number') {
          return value.toString();
      }
      // Simple object handling inside array/value context if needed, 
      // though typically HCL uses blocks or maps.
      // For now, assume simple primitives for values or strict HCL structure mapping.
      return JSON.stringify(value);
  }
  
  protected generateResourceBlock(resourceName: string, properties: string): string {
    return `resource "${this.resourceType}" "${resourceName}" {\n${properties}\n}`;
  }
}
