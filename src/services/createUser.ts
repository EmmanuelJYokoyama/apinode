import { User } from '../models/User';

interface CreateUserInput {
  name?: string;
  email: string;
  password: string;
}

export async function createUser(data: CreateUserInput) {
  const existing = await User.findOne({ email: data.email }).lean();
  if (existing) {
    throw new Error('E-mail já cadastrado.');
  }

  const user = await User.create({
    name: data.name,
    email: data.email,
    password: data.password,
  });

  return user;
}
