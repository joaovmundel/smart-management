import { User } from "../models/user.model";

export const mockedUsers: User[] = [
  { id: '1', nome: 'User One', email: 'user1@example.com', telefone: '123456789', empresa: null, password: 'password1', confirmPassword: 'password1', tokenRegistro: 'token1' },
  { id: '2', nome: 'User Two', email: 'user2@example.com', telefone: '987654321', empresa: null, password: 'password2', confirmPassword: 'password2', tokenRegistro: 'token2' },
];