import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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
          this.notificationGateway.handleEmitEventToUser(userId, message,title);
        });
        return {succes:true,message:"notification envoyé"}
    
    }
    async getUserNotif(userId:string){
        return this.notificationModel.find({user:userId}).sort({createdAt:-1}).exec();
    }
    async marqueAsRead(userId:string){
      return  await this.notificationModel.updateMany({user:new Types.ObjectId(userId)},
                                                      {$set:{status:true}},
                                                      {new:true}).exec();
    } 
    
    async sendNotifToUser(userId: string,title:string, message: string) {
       await this.notificationModel.create({
           user: userId,
           message,
           title,
           status: false,
        });

    this.notificationGateway.handleEmitEventToUser(userId, message, title);

    return { succes: true, message: 'notification envoyé' };
         
    }
}
