import fastify from 'fastify';
import type { FastifyInstance, RequestGenericInterface } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app: FastifyInstance = fastify({
  logger: true // Enable logging using Pino
});

app.post('/user', async (req, res) => {
    const { name, email, password } = req.body as {
        name: string; 
        email: string; 
        password: string };
    try {        
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password,
                role: 'USER',
                isActive: true,
            },
        });
        res.status(201).send(user);
    } catch (error) {
        res.status(500).send({ error: 'Failed to create user' });
    }
});    

app.post('/address', async (req, res) => {
    const { userId, street, city, state, zipCode, country } = req.body as {
        userId: number;
        street: string; 
        city: string; 
        state: string; 
        zipCode: string; 
        country: string };
    try {        
        const address = await prisma.address.create({
            data: {
                userId,
                street,
                city,
                state,
                zipCode,
                country,
            },
        });
        res.status(201).send(address);
    } catch (error) {
        res.status(500).send({ error: 'Failed to create address' });
    }
});

app.post('/createProfile', async (req, res) => {
    const { userId, phone, bio, avatarUrl, birthDate } = req.body as {
        userId: number;
        phone?: string;
        bio?: string;
        avatarUrl?: string;
        birthDate?: string;
    };
    try {
        const profile = await prisma.profile.create({
            data: {
                userId,
                phone,
                bio,
                avatarUrl,
                birthDate: birthDate ? new Date(birthDate) : undefined,
            },
        });
        res.status(201).send(profile);
    } catch (error) {
        res.status(500).send({ error: 'Failed to create profile' });
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            include: {
                addresses: true,
                profile: true,
            },
        });
        res.send(users);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch users' });
    }
});

const start = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    app.log.info('Database connected successfully');
    
    app.listen({ port: 3000, host: '0.0.0.0' }, (err) => {
      if (err) {
        app.log.error(err);
        process.exit(1);
      }
      app.log.info('Server listening on port 3000');
    });
    } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};