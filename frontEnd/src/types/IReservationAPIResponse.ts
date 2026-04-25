import type { IUserApiResponse } from "./UserApiResponse";

export interface IReservationApiResponse {
  _id: number;
  _reservationTime: string;
  _personsQuantity: number;
  _user: IUserApiResponse;
}
