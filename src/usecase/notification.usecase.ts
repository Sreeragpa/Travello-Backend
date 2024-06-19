import { INotification } from "../entities/notification.entity";
import { INotificationRepository } from "../interfaces/repositories/INotification.repository";
import { INotificationUsecase } from "../interfaces/usecase/INotification.usecase";

import { io } from "../server";
import { userSocketMap } from "../frameworks/configs/socketioHandlers";

export class NotificationUsecase implements INotificationUsecase {
  private notificationRepository: INotificationRepository;
  constructor(
    notificationRepository: INotificationRepository
  ) {
    this.notificationRepository = notificationRepository;
  }
    async getNotificationCount(userid: string): Promise<number> {
        const notificationCount = await this.notificationRepository.countByUserid(userid);
        return notificationCount
    }
  async marksAsRead(id: string): Promise<INotification | null> {
    try {
      const notification = await this.notificationRepository.markasRead(id);
      return notification;
    } catch (error) {
      throw error;
    }
  }
  async createNotification(data: INotification): Promise<INotification> {
    try {
      const notification = await this.notificationRepository.create(data);

    //   Socketio Notification to the recieved User
        const followedUserSocketId = userSocketMap[data.recipient];
      if (followedUserSocketId) {
        io.to(followedUserSocketId).emit("notification", {
          success: true,
          data: notification,
        });
      }
      

      return notification;
    } catch (error) {
      throw error;
    }
  }
  async getNotificationforUser(userid: string): Promise<INotification[]> {
    try {
      const notifications = await this.notificationRepository.findByUserid(
        userid
      );
      return notifications;
    } catch (error) {
      throw error;
    }
  }

}
