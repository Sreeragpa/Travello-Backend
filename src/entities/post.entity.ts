export default interface IPost{
    id?: string,
    creator_id: string,
    trip_id?: string,
    caption: string,
    images: string[],
    location: {
        type: 'Point';
        coordinates: [number, number]; // [longitude, latitude]
      },
    place: string

}

