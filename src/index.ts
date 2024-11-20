import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastify from 'fastify';

import { authRoutes } from './routes/authRoutes';
import { userRoutes } from './routes/userRoutes';
import config from './utils/config';
import logConfig from './utils/logConfig';
const server = fastify({
  logger: logConfig,
  ajv: {
    customOptions: {
      allErrors: true,
      keywords: [
        {
          keyword: 'exclusiveRange',
          type: 'number',
        },
        {
          keyword: 'range',
          type: 'number',
          compile([min, max], parentSchema) {
            return parentSchema.exclusiveRange === true
              ? (data) => data > min && data < max
              : (data) => data >= min && data <= max;
          },
          errors: false,
          metaSchema: {
            // schema to validate keyword value
            type: 'array',
            items: [{ type: 'number' }, { type: 'number' }],
            minItems: 2,
            additionalItems: false,
          },
        },
      ],
      formats: {
        phoneNumber: {
          type: 'string',
          validate: (value) => {
            const phoneRegex = /^[0-9]{10,15}$/;
            return phoneRegex.test(value); // Validasi: hanya angka 10-15 digit
          },
        },
      },
    },
  },
});
const swaggerOptions = {
  swagger: {
    info: {
      title: 'My Title', // Judul dokumentasi API
      description: 'My Description.', // Deskripsi dokumentasi API
      version: '1.0.0', // Versi API
    },
    host: 'localhost', // Host API (misalnya localhost atau domain)
    schemes: ['http', 'https'], // Protokol yang didukung API (http dan https)
    consumes: ['application/json'], // Format data yang diterima oleh API (JSON)
    produces: ['application/json'], // Format data yang dihasilkan oleh API (JSON)
    tags: [{ name: 'Default', description: 'Default' }], // Kategori/tags API
  },
};
const swaggerUiOptions = {
  routePrefix: '/docs', // Endpoint di mana Swagger UI bisa diakses
  exposeRoute: true, // Mengaktifkan route Swagger UI
};
server.setErrorHandler(function (error, request, reply) {
  if (error.validation) {
    return reply.status(400).send({
      path: request.url,
      status: error.statusCode,
      timestamp: Date.now(),
      message: error.message,
      errors: error.validation.map((err) => ({
        key:
          err.params?.missingProperty ||
          err.instancePath.replace(new RegExp('/', 'g'), ''),
        value: err.message,
      })),
    });
  }
  reply.status(500).send(error);
});
server.register(fastifySwagger, swaggerOptions);
server.register(fastifySwaggerUi, swaggerUiOptions);
server.register(userRoutes, { prefix: '/users' });
server.register(authRoutes, { prefix: '/auth' });

server.get('/ping', async (request) => {
  request.log.info('Ada request baru nih!');
  return 'pong\n';
});

// server.listen({ port: 8000 }, (err, address) => {
server.listen({ port: parseInt(config.PORT) }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
