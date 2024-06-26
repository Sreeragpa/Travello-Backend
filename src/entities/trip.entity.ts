export interface ITrip {
    _id?: string;
    creator_id: string;
    title: string;
    startingPoint: {
      name: string;
      coordinates: {
        latitude: number;
        longitude: number;
      };
    };
    destination: {
      name: string;
      coordinates: {
        latitude: number;
        longitude: number;
      };
    };
    startDate: Date;
    endDate: Date;
    members: string[];
    memberlimit: number     
    description: string;
    imageUrl?: string;
    issameuser?: boolean;
    isuserjoined?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    istripfull?: boolean
    conversation_id?: string
  }
  

  export interface IEditTrip{
    title?: string;
    imageUrl?: string;
    memberlimit?: number;
    description?: string;
  }