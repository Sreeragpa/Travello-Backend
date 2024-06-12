import { INotification } from "../entities/notification.entity";
import { INotificationRepository } from "../interfaces/repositories/INotification.repository";
import { INotificationUsecase } from "../interfaces/usecase/INotification.usecase";

export class NotificationUsecase implements INotificationUsecase{
    private notificationRepository: INotificationRepository
    constructor(notificationRepository: INotificationRepository){
        this.notificationRepository = notificationRepository
    }
    async createNotification(data: INotification): Promise<INotification> {
        try {
            const notification = await this.notificationRepository.create(data)
            return notification
        } catch (error) {
            throw error
        }

    }
    async getNotificationforUser(userid: string): Promise<INotification[]> {
        try {
            const notifications = await this.notificationRepository.findByUserid(userid);
            return notifications
        } catch (error) {
            throw error
        }
    }

}