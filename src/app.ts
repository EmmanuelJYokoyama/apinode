// src/app.ts
import fastify from 'fastify';
import type { FastifyInstance, RequestGenericInterface } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app: FastifyInstance = fastify({
  logger: true // Enable logging using Pino
});

// Define a simple health check route
interface HealthCheckRequest extends RequestGenericInterface {
  Reply: {
    status: string;
    timestamp: number;
  };
}

app.get<HealthCheckRequest>('/healthcheck', async (request, reply) => {
  return {
    status: 'ok',
    timestamp: Date.now()
  };
});

const start = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    app.log.info('Database connected successfully');
    
    // Listen on port 3000 and bind to 0.0.0.0 for external access
    await app.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

start();
