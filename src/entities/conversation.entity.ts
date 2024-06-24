import IUser from "./user.entity"

export default interface IConversation{
    _id?: string,
    members?:string[],
    createdAt?: Date,
    updatedAt?: Date,
    memberDetails?: IUser,
    isGroup: boolean;
    groupName?: string;
}

export interface IMessage{
    _id?: string
    conversation_id: string,
    sender: string,
    text: string
}