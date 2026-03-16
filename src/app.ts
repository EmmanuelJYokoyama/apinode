// src/app.ts
import 'dotenv/config';
import fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'path';
import mongoose from 'mongoose';
import { routes } from './routes';

const app = fastify({ logger: true });

const mongoURI = process.env.DATABASE_URL || 'mongodb://root:admin@localhost:27017/apinode?authSource=admin';
const port = Number(process.env.PORT || 3000);

app.register(fastifyStatic, {
  root: path.join(__dirname, '..', 'public'),
  prefix: '/',
});

app.register(routes);

const start = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB Conectado!');
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`Servidor rodando na porta ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  await mongoose.disconnect();
  process.exit(0);
});

start();

