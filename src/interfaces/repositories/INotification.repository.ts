import { INotification } from "../../entities/notification.entity";

export interface INotificationRepository{
    create(data: INotification): Promise<INotification>
    findByUserid(userid: string): Promise<INotification[]>
    markasRead(notificationid: string): Promise<INotification | null>
    countByUserid(userid: string): Promise<number>

}