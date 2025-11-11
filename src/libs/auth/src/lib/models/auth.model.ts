export interface RegisterData {
  name: string;
  email: string;
  password: string;
  token: string;
  companyId?: number;
}

export interface ILoginResponse {
  token: string;
  type: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RecoverPassCodeData {
  email: string;
}

export interface RecoverPasswordData {
  email: string;
  code: string;
  newPassword: string;
}
