import User from "./User";

export default class Reservation {
  
  constructor(
    public id: number,
    public reservationTime: Date,
    public personsQuantity: number,
    public user: User,
  ) {}
}