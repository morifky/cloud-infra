import { z } from 'zod';
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

const start = async () => {
  try {
    await server.register(fastifySwagger, {
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

    await server.register(fastifySwaggerUi, {
      routePrefix: '/apidocs',
    });

    server.post('/api/v1/aws/s3', {
      schema: {
        description: 'Generate Terraform S3 resource',
        tags: ['S3'],
        body: S3RequestDtoSchema,
      },
    }, S3Controller.generate);

    server.post('/api/v1/aws/ec2', {
      schema: {
        description: 'Generate Terraform EC2 resource',
        tags: ['EC2'],
        body: Ec2RequestDtoSchema,
      },
    }, generateEc2);


    await server.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
