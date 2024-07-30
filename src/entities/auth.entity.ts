interface IAuth {
    _id: string
    username: string;
    email: string;
    password: string;
    token?: string[];
    verified: boolean;
    userid: string;
    isGoogleAuth: boolean
}
  
  export default IAuth;