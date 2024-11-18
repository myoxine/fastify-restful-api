import fastify from 'fastify';

import { authRoutes } from './routes/authRoutes';
import { userRoutes } from './routes/userRoutes';

const server = fastify();

server.register(userRoutes, { prefix: '/users' });
server.register(authRoutes, { prefix: '/auth' });

server.get('/ping', async () => {
  return 'pong\n';
});

server.listen({ port: 8000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
