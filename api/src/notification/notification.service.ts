import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inotification } from './interfaces/notification.interface';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
    constructor(@InjectModel('notifications') private notificationModel: Model<Inotification>,
    private notificationGateway:NotificationGateway) {}
    async sendNotifToUsers(userIds: string[],title:string, message: string) {
        const notifications = userIds.map(userId => ({
          user: userId,
          message,
          title,
          status: false,
        }));

        await this.notificationModel.insertMany(notifications)
        //emettre en temp réel la notification via web Socket
        userIds.forEach(userId => {
          this.notificationGateway.handleEmitEvent(userId, message,title);
        });
    
    }
      async sendNotifToUser(userId: string,title:string, message: string) {
        
    }
}
