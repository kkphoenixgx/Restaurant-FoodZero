export default class User {

  // ----------- Constructor -----------
  
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public senha: string,
    public userImagePath: string | null,
    public phone: string,
    public role: string,    
  ) { }
}