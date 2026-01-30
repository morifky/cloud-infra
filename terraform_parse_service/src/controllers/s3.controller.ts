
import { FastifyReply, FastifyRequest } from 'fastify';
import { S3RequestDto } from '../dto/s3.dto';
import { S3Mapper } from '../mappers/s3.mapper';
import { ModelGenerator } from '../generators/ModelGenerator';

export class S3Controller {
  static async generate(
    request: FastifyRequest<{ Body: S3RequestDto }>,
    reply: FastifyReply
  ) {
    const dto = request.body;
    
    const models = S3Mapper.toModels(dto);
    
    const hclParts: string[] = models.map(model => {
      const generator = new ModelGenerator(model);
      return generator.generate();
    });

    const finalHcl = hclParts.join('\n\n');

    reply
      .status(201)
      .header('Content-Type', 'application/octet-stream')
      .header('Content-Disposition', 'attachment; filename="s3.tf"')
      .send(finalHcl);
  }
}
