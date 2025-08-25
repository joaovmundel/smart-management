import { User } from "../models/user.model";

export const mockedUsers: User[] = [
  {
    id: '1',
    name: 'User One',
    email: 'user1@example.com',
    phone: '123456789',
    company: null,
    createdAt: new Date(),
    password: 'password1',
    confirmPassword: 'password1',
    registerToken: 'token1'
  },

  {
    id: '2',
    name: 'User Two',
    email: 'user2@example.com',
    phone: '987654321',
    company: null,
    createdAt: new Date(),
    password: 'password2',
    confirmPassword: 'password2',
    registerToken: 'token2'
  },
];