
import { apiGet, apiPost, apiPut, apiDelete } from './api';
import Reservation from '../types/Model/Reservation';

import type { IReservationApiResponse as ReservationApiResponse } from '../types/IReservationAPIResponse';
import { userFromApi } from './user';


function reservationFromApi(data: ReservationApiResponse): Reservation {
  return new Reservation(
    data._id,
    new Date(data._reservationTime),
    data._personsQuantity,
    userFromApi(data._user)
  );
}

export async function getReservation(id: number): Promise<Reservation> {
  const data = await apiGet<ReservationApiResponse>(`/reservations/${id}`);
  return reservationFromApi(data);
}

export async function listReservations(): Promise<Reservation[]> {
  const data = await apiGet<ReservationApiResponse[]>(`/reservations`);
  return data.map(reservationFromApi);
}

export async function createReservation<T extends object>(data: T): Promise<Reservation> {
  const res = await apiPost<ReservationApiResponse>(`/reservations`, data);
  return reservationFromApi(res);
}

export async function updateReservation<T extends object>(id: number, data: T): Promise<Reservation> {
  const res = await apiPut<ReservationApiResponse>(`/reservations/${id}`, data);
  return reservationFromApi(res);
}

export async function deleteReservation(id: number): Promise<{ message: string }> {
  return apiDelete<{ message: string }>(`/reservations/${id}`);
}
