import { client } from './client';
import { ApiResponse } from '../types';

interface AuthResponse {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'CUSTOMER';
  token: string;
}

export const authApi = {
  login: (email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
    return client.post<AuthResponse>('/auth/login', { email, password });
  },

  register: (name: string, email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
    return client.post<AuthResponse>('/auth/register', { name, email, password });
  }
};