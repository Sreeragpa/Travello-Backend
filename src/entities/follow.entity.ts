export default interface IFollow{
    follower_id: string;
    following_id: string;
}

export interface IFollowingSearch{
    follower_id: string;
    searchKeyword?: string | null
}