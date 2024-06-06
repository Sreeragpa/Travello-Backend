import { Document } from "mongoose";

export default interface IComment {
    _id: string
    post_id: string,
    content: string,
    author_id: string,
    createdAt: Date,
    updatedAt: Date,
}

