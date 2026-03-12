// src/app.ts
import fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'path';
import mongoose from 'mongoose';
import { routes } from './routes';

const app = fastify({ logger: true });

const mongoURI = process.env.DATABASE_URL || 'mongodb://admin:senhamongo@mongodb:27017/apinode?authSource=admin';

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB Conectado!'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

app.register(fastifyStatic, {
  root: path.join(__dirname, '..', 'public'),
  prefix: '/',
});

app.register(routes);

const start = async () => {
  try {
    await app.listen({ port: 300l0, host: '0.0.0.0' });
    console.log('Servidor rodando na porta 3000');
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

