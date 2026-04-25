
import { apiGet, apiPost, apiPut, apiDelete } from './api';
import User from '../types/Model/User';
import type { IUserApiResponse as UserApiResponse } from '../types/UserApiResponse';


export function userFromApi(data: any): User {
  return new User(
    data._id ?? data.id,
    data._name ?? data.name,
    data._email ?? data.email,
    data._senha ?? data.senha ?? '',
    data._userImagePath ?? data.userImagePath,
    data._phone ?? data.phone ?? '',
    data._role ?? data.role ?? 'user'
  );
}

export async function getUser(id: number): Promise<User> {
  const data = await apiGet<UserApiResponse>(`/users/${id}`);
  return userFromApi(data);
}

export async function listUsers(): Promise<User[]> {
  const data = await apiGet<UserApiResponse[]>(`/users`);
  return data.map(userFromApi);
}

export async function createUser<T extends object | FormData>(data: T): Promise<User> {
  const res = await apiPost<any>(`/users`, data);
  const userData = res.user ? res.user : res;
  return userFromApi(userData);
}

export async function updateUser<T extends object | FormData>(id: number, data: T): Promise<User> {
  const res = await apiPut<any>(`/users/${id}`, data);
  const userData = res.user ? res.user : res;
  return userFromApi(userData);
}

export async function deleteUser(id: number): Promise<{ message: string }> {
  return apiDelete<{ message: string }>(`/users/${id}`);
}
