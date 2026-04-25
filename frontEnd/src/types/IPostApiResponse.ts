import type { IComentaryApiResponse } from "./IComentaryApiResponse";
import type { ITagApiResponse } from "./ITagApiResponse";
import type { IUserApiResponse } from "./UserApiResponse";

export interface IPostApiResponse {
  _id: number;
  _date: string;
  _description: string;
  _user: IUserApiResponse;
  _tags: ITagApiResponse[];
  _comentaries: IComentaryApiResponse[];
}