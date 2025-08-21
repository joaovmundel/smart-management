export interface IMessageResponse {
  message: string;
}

export interface IErrorResponse {
  status: number;
  title: string;
  detail: string;
  timestamp: string;
  path: string;
}
