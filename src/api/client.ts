import { ApiResponse } from '../types';

const BASE_URL = '/api/v1';

interface RequestOptions extends RequestInit {
  token?: string;
}

async function http<T>(path: string, config: RequestOptions = {}): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}${path}`;
  // In a real app, you'd get this from a more robust storage or context
  const userStr = localStorage.getItem('lumina_user');
  const token = userStr ? JSON.parse(userStr).token : null;

  const headers = new Headers({
    'Content-Type': 'application/json',
    ...config.headers,
  });

  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  try {
    const response = await fetch(url, {
      ...config,
      headers,
    });

    // Handle 401 globally if needed
    if (response.status === 401) {
      console.warn('Unauthorized access');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API Error (${path}):`, error);
    return {
      success: false,
      data: null as any,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Failed to connect to server',
      },
    };
  }
}

export const client = {
  get: <T>(path: string, config?: RequestOptions) => 
    http<T>(path, { ...config, method: 'GET' }),

  post: <T>(path: string, body: any, config?: RequestOptions) => 
    http<T>(path, { ...config, method: 'POST', body: JSON.stringify(body) }),

  put: <T>(path: string, body: any, config?: RequestOptions) => 
    http<T>(path, { ...config, method: 'PUT', body: JSON.stringify(body) }),

  patch: <T>(path: string, body: any, config?: RequestOptions) => 
    http<T>(path, { ...config, method: 'PATCH', body: JSON.stringify(body) }),

  delete: <T>(path: string, config?: RequestOptions) => 
    http<T>(path, { ...config, method: 'DELETE' }),
};