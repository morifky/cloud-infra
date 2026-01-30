
import { BaseGenerator } from '../BaseGenerator';

export interface AwsProviderInput {
  region: string;
  version?: string;
  access_key?: string;
  secret_key?: string;
}

export class AwsProviderGenerator extends BaseGenerator<AwsProviderInput> {
  protected resourceType = 'aws'; // Not used in provider block, but satisfies abstract

  generate(): string {
    const props: string[] = [];
    props.push(this.formatProperty('region', this.input.region));
    
    // Credentials usually via Env vars, but supporting explicit if needed (careful with secrets)
    if (this.input.access_key) props.push(this.formatProperty('access_key', this.input.access_key));
    if (this.input.secret_key) props.push(this.formatProperty('secret_key', this.input.secret_key));

    const content = props.filter(p => p !== '').join('\n');
    return `provider "aws" {\n${content}\n}`;
  }
}
