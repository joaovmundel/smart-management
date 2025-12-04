import { User } from '../models/user.model';

export const mockedUsers: User[] = [
  {
    id: '1',
    name: 'User One',
    email: 'user1@example.com',
    phone: '123456789',
    role: 'USER',
    createdAt: '2023-01-01T10:00:00Z',
    password: 'password1',
    confirmPassword: 'password1',
    registerToken: 'token1',
  },

  {
    id: '2',
    name: 'User Two',
    email: 'user2@example.com',
    phone: '987654321',
    role: 'ADMIN',
    createdAt: '2023-01-01T10:00:00Z',
    password: 'password2',
    confirmPassword: 'password2',
    registerToken: 'token2',
  },
];
