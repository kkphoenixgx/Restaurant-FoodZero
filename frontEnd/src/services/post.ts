
import { apiGet, apiPost, apiPut, apiDelete } from './api';
import Post from '../types/Model/Post';
import type { IPostApiResponse as PostApiResponse } from '../types/IPostApiResponse';

import { userFromApi } from "./user"
import { comentariesFromApi } from './comentaries';
import { tagsFromApi } from './tags';

export function postFromApi(data: any): Post {
  return new Post(
    data._id ?? data.id,
    new Date(data._date ?? data.date ?? data.created_at),
    data._description ?? data.description,
    userFromApi(data._user ?? data.user ?? {}),
    tagsFromApi(data._tags ?? data.tags ?? []),
    comentariesFromApi(data._comentaries ?? data.comentaries ?? [])
  );
}

export async function getPost(id: number): Promise<Post> {
  const data = await apiGet<PostApiResponse>(`/posts/${id}`);
  return postFromApi(data);
}

export async function listPosts(page?: number, limit?: number): Promise<Post[]> {
  let url = `/posts`;
  if (page !== undefined && limit !== undefined) {
    url += `?page=${page}&limit=${limit}`;
  }
  const data = await apiGet<PostApiResponse[]>(url);
  return data.map(postFromApi);
}

export async function createPost<T extends object>(data: T): Promise<Post | any> {
  const res = await apiPost<any>(`/posts`, data);
  if (res.postId || res.message) return res; // Impede o crash caso o backend não devolva o Post inteiro
  return postFromApi(res);
}

export async function updatePost<T extends object>(id: number, data: T): Promise<Post | any> {
  const res = await apiPut<any>(`/posts/${id}`, data);
  if (res.message) return res; // Impede o crash no update
  return postFromApi(res);
}

export async function deletePost(id: number): Promise<{ message: string }> {
  return apiDelete<{ message: string }>(`/posts/${id}`);
}