
import { FastifyReply, FastifyRequest } from 'fastify';
import { Ec2RequestDto } from '../dto/ec2.dto';
import { Ec2Mapper } from '../mappers/ec2.mapper';
import { ModelGenerator } from '../generators/ModelGenerator';

export const generateEc2 = async (request: FastifyRequest<{ Body: Ec2RequestDto }>, reply: FastifyReply) => {
  const models = Ec2Mapper.toModels(request.body);
  
  const hclParts = models.map(model => {
    const generator = new ModelGenerator(model);
    return generator.generate();
  });

  const hclCallback = hclParts.join('\n\n');

  reply
    .status(201)
    .header('Content-Description', 'File Transfer')
    .header('Content-Type', 'application/octet-stream')
    .header('Content-Disposition', 'attachment; filename="ec2.tf"')
    .send(hclCallback);
};
