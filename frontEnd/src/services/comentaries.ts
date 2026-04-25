
import { apiGet, apiPost, apiPut, apiDelete } from './api';
import Comentary from '../types/Model/Comentary';

import type { IComentaryApiResponse as ComentaryApiResponse } from '../types/IComentaryApiResponse';

export function comentaryFromApi (data: any): Comentary {
  return new Comentary(
    data._id ?? data.id,
    new Date(data._date ?? data.date),
    data._description ?? data.description,
    data._post_id ?? data.post_id ?? data.postId,
    data._user_id ?? data.user_id ?? data.userId
  );
}
export function comentariesFromApi(comentaries : any[]) :Comentary[] {
  let comentariesResponseCollection :Comentary[] = [];
  
  comentaries.forEach(coment => 
    comentariesResponseCollection.push(comentaryFromApi(coment))
  )

  return comentariesResponseCollection;
}

export async function getOne(id: number): Promise<Comentary> {
  const data = await apiGet<ComentaryApiResponse>(`/comentaries/${id}`);
  return comentaryFromApi(data);
}

export async function getAll(): Promise<Comentary[]> {
  const data = await apiGet<ComentaryApiResponse[]>(`/comentaries`);
  return data.map(comentaryFromApi);
}

export async function getComentariesFromAPost(postId: number): Promise<Comentary[]> {
  const data = await apiGet<ComentaryApiResponse[]>(`/comentaries/post/${postId}`);
  return data.map(comentaryFromApi);
}

export async function getComentariesFromUser(userId: number): Promise<Comentary[]> {
  const data = await apiGet<ComentaryApiResponse[]>(`/comentaries/user/${userId}`);
  return data.map(comentaryFromApi);
}

export async function postComentary<T extends object>(data: T): Promise<Comentary> {
  const res = await apiPost<ComentaryApiResponse>(`/comentaries`, data);
  return comentaryFromApi(res);
}

export async function updateComentary<T extends object>(id: number, data: T): Promise<Comentary> {
  const res = await apiPut<ComentaryApiResponse>(`/comentaries/${id}`, data);
  return comentaryFromApi(res);
}

export async function deleteComentary(id: number): Promise<{ message: string }> {
  return apiDelete<{ message: string }>(`/comentaries/${id}`);
}
