const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://backendrestaurantfoodzero-production.up.railway.app/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'Erro na requisição');
  }
  return res.json();
}

export async function apiGet<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`);
  return handleResponse<T>(res);
}

export async function apiPost<T>(endpoint: string, data: unknown): Promise<T> {
  const isFormData = data instanceof FormData;
  const headers: HeadersInit = isFormData ? {} : { 'Content-Type': 'application/json' };
  const res = await fetch(`${API_BASE_URL}${endpoint}` , {
    method: 'POST',
    headers,
    body: isFormData ? data as FormData : JSON.stringify(data),
  });
  return handleResponse<T>(res);
}

export async function apiPut<T>(endpoint: string, data: unknown): Promise<T> {
  const isFormData = data instanceof FormData;
  const headers: HeadersInit = isFormData ? {} : { 'Content-Type': 'application/json' };
  const res = await fetch(`${API_BASE_URL}${endpoint}` , {
    method: 'PUT',
    headers,
    body: isFormData ? data as FormData : JSON.stringify(data),
  });
  return handleResponse<T>(res);
}

export async function apiDelete<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}` , {
    method: 'DELETE',
  });
  return handleResponse<T>(res);
}
