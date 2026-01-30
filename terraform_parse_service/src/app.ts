
import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler, ZodTypeProvider, jsonSchemaTransform } from 'fastify-type-provider-zod';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { S3RequestDtoSchema } from './dto/s3.dto';
import { S3Controller } from './controllers/s3.controller';
import { Ec2RequestDtoSchema } from './dto/ec2.dto';
import { generateEc2 } from './controllers/ec2.controller';

const app = Fastify({
  logger: true,
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

const server = app.withTypeProvider<ZodTypeProvider>();

server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Terraform Parse Service',
      description: 'API to generate Terraform HCL files',
      version: '1.0.0',
    },
    servers: [],
  },
  transform: jsonSchemaTransform,
});

server.register(fastifySwaggerUi, {
  routePrefix: '/documentation',
});

server.post('/api/v1/aws/s3', {
  schema: {
    body: S3RequestDtoSchema,
  },
}, S3Controller.generate);

server.post('/api/v1/aws/ec2', {
  schema: {
    body: Ec2RequestDtoSchema,
  },
}, generateEc2);


const start = async () => {
  try {
    await server.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
