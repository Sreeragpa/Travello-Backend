interface IAuth {
    _id: string
    username: string;
    email: string;
    password: string;
    token?: string[];
    verified: boolean;
}
  
  export default IAuth;