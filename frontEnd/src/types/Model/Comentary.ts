export default class Comentary {

  constructor(
    public id: number,
    public date: Date,
    public description: string,
    public post_id: number,
    public user_id: number
  ) {}
}