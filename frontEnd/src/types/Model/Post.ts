import Comentary from "./Comentary";
import Tag from "./Tag";
import User from "./User";

export default class Post {


  constructor(
    public id: number,
    public date: Date,
    public description: string,
    public user: User,
    public tags: Tag[],
    public comentaries: Comentary[] = [],
  ) {}
}