
import { apiGet, apiPost, apiPut, apiDelete } from './api';
import Tag from '../types/Model/Tag';
import type { ITagApiResponse as TagApiResponse} from '../types/ITagApiResponse';

export function tagFromApi(data: any): Tag {
  return new Tag(data.name ?? data._name, data.id ?? data._id);
}
export function tagsFromApi(data :any[]) :Tag[]{
  let tagCollection :Tag[] = [];
  if (data && Array.isArray(data)) {
    data.forEach(tag => tagCollection.push(tagFromApi(tag)) );
  }
  return tagCollection;
}

export async function getTag(id: number): Promise<Tag> {
  const data = await apiGet<TagApiResponse>(`/tags/${id}`);
  return tagFromApi(data);
}

export async function listTags(): Promise<Tag[]> {
  const data = await apiGet<TagApiResponse[]>(`/tags`);
  return data.map(tagFromApi);
}

export async function createTag<T extends object>(data: T): Promise<Tag> {
  const res = await apiPost<TagApiResponse>(`/tags`, data);
  return tagFromApi(res);
}

export async function updateTag<T extends object>(id: number, data: T): Promise<Tag> {
  const res = await apiPut<TagApiResponse>(`/tags/${id}`, data);
  return tagFromApi(res);
}

export async function deleteTag(id: number): Promise<{ message: string }> {
  return apiDelete<{ message: string }>(`/tags/${id}`);
}