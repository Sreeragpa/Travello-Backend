import { INotification } from "../../entities/notification.entity";

export interface INotificationUsecase{
    createNotification(data: INotification): Promise<INotification>
    getNotificationforUser(userid: string): Promise<INotification[]>
}