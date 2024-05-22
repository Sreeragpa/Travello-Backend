export default interface IUser {
    id: string
    username: string;
    email: string;
    hostedTrips?: string[]; 
    posts?: string[]; 
    chats?: string[];
    // followers?: string[]; 
    // following?: string[]; 
    notifications?: string[]; 
    password?: string;
  }
