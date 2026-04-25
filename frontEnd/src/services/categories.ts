
import { apiGet, apiPost, apiPut, apiDelete } from './api';
import Category from '../types/Model/Category';
import type { ICategoryApiResponse as CategoryApiResponse } from '../types/ICategoryApiResponse';

export function categoryFromApi(data: any): Category {
  return new Category(data._id ?? data.id, data._name ?? data.name);
}

export async function getCategory(id: number): Promise<Category> {
  const data = await apiGet<CategoryApiResponse>(`/categories/${id}`);
  return categoryFromApi(data);
}

export async function listCategories(): Promise<Category[]> {
  const data = await apiGet<CategoryApiResponse[]>(`/categories`);
  return data.map(categoryFromApi);
}

export async function createCategory<T extends object>(data: T): Promise<Category> {
  const res = await apiPost<CategoryApiResponse>(`/categories`, data);
  return categoryFromApi(res);
}

export async function updateCategory<T extends object>(id: number, data: T): Promise<Category> {
  const res = await apiPut<CategoryApiResponse>(`/categories/${id}`, data);
  return categoryFromApi(res);
}

export async function deleteCategory(id: number): Promise<{ message: string }> {
  return apiDelete<{ message: string }>(`/categories/${id}`);
}
