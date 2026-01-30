
import { BaseGenerator } from '../../BaseGenerator';

export interface S3BucketInput {
  resourceName: string;
  bucket: string;
  force_destroy?: boolean;
  tags?: Record<string, unknown>;
  acl?: string; // Note: ACL resource is preferred over inline, but keeping input structure flexible
}

export class S3BucketGenerator extends BaseGenerator<S3BucketInput> {
  protected resourceType = 'aws_s3_bucket';

  generate(): string {
    const props: string[] = [];
    props.push(this.formatProperty('bucket', this.input.bucket));
    
    if (this.input.force_destroy !== undefined) {
      props.push(this.formatProperty('force_destroy', this.input.force_destroy));
    }

    if (this.input.tags) {
      props.push(this.formatProperty('tags', this.input.tags));
    }

    const content = props.filter(p => p !== '').join('\n');
    return this.generateResourceBlock(this.input.resourceName, content);
  }
}

export interface S3BucketAclInput {
  resourceName: string;
  bucket_id: string; // Reference to the bucket, e.g., aws_s3_bucket.example.id
  acl: 'private' | 'public-read' | 'public-read-write' | 'authenticated-read';
}

export class S3BucketAclGenerator extends BaseGenerator<S3BucketAclInput> {
  protected resourceType = 'aws_s3_bucket_acl';

  generate(): string {
    const props: string[] = [];
    // If it looks like a variable/reference (no quotes needed), we might need special handling
    // For now, assume reference string is passed in as is effectively. 
    // BUT HCL references shouldn't be quoted. 
    // This is a limitation of our simple formatProperty.
    // Solution: We'll simple inject it raw for now or improve BaseGenerator later.
    // Let's implement a manual override for this specific prop to avoid quoting.
    
    props.push(`  bucket = ${this.input.bucket_id}`); 
    props.push(this.formatProperty('acl', this.input.acl));

    const content = props.join('\n');
    return this.generateResourceBlock(this.input.resourceName, content);
  }
}
