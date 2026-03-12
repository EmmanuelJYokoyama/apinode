import { FastifyInstance } from 'fastify';
import { User } from './models/User';
import { Profile } from './models/Profile';
import { Address } from './models/Address';
import { createUser } from './services/createUser';

export async function routes(app: FastifyInstance) {
  app.get('/healthcheck', async () => {
    return { status: 'ok', timestamp: Date.now() };
  });

  app.get('/users', async (req, res) => {
    try {
      const users = await User.find().lean();
      return res.send(users);
    } catch (error) {
      return res.status(500).send({ error: 'Failed to fetch users' });
    }
  });

  app.get('/users/:id', async (req, res) => {
    const { id } = req.params as { id: string };
    try {
      const user = await User.findById(id).lean();
      if (!user) return res.status(404).send({ error: 'User not found' });
      return res.send(user);
    } catch (error) {
      return res.status(500).send({ error: 'Failed to fetch user' });
    }
  });

  app.post('/users', async (req, res) => {
    const { name, email, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };
    try {
      const user = await createUser({ name, email, password });
      return res.status(201).send(user);
    } catch (error: any) {
      const status = error.message === 'E-mail já cadastrado.' ? 409 : 500;
      return res.status(status).send({ error: error.message || 'Failed to create user' });
    }
  });

  app.put('/users/:id', async (req, res) => {
    const { id } = req.params as { id: string };
    const body = req.body as {
      name?: string;
      email?: string;
      password?: string;
      role?: string;
      isActive?: boolean;
    };
    try {
      const user = await User.findByIdAndUpdate(id, body, { new: true }).lean();
      if (!user) return res.status(404).send({ error: 'User not found' });
      return res.send(user);
    } catch (error) {
      return res.status(500).send({ error: 'Failed to update user' });
    }
  });


  app.delete('/users/:id', async (req, res) => {
    const { id } = req.params as { id: string };
    try {
      const user = await User.findByIdAndDelete(id).lean();
      if (!user) return res.status(404).send({ error: 'User not found' });
      return res.send({ message: 'User deleted successfully' });
    } catch (error) {
      return res.status(500).send({ error: 'Failed to delete user' });
    }
  });

  // ── Profile ────────────────────────────────────────────────

  app.post('/createProfile', async (req, res) => {
    const { userId, phone, bio, avatarUrl, birthDate } = req.body as {
      userId: string;
      phone?: string;
      bio?: string;
      avatarUrl?: string;
      birthDate?: string;
    };
    try {
      const profile = await Profile.create({
        userId,
        phone,
        bio,
        avatarUrl,
        birthDate: birthDate ? new Date(birthDate) : undefined,
      });
      return res.status(201).send(profile);
    } catch (error) {
      return res.status(500).send({ error: 'Failed to create profile' });
    }
  });

  // ── Address ────────────────────────────────────────────────

  app.post('/address', async (req, res) => {
    const { userId, street, city, state, zipCode, country } = req.body as {
      userId: string;
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    try {
      const address = await Address.create({ userId, street, city, state, zipCode, country });
      return res.status(201).send(address);
    } catch (error) {
      return res.status(500).send({ error: 'Failed to create address' });
    }
  });
}
