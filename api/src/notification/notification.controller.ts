import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}
    @Post('send')
    async sendNotifToUsers(@Body() body: { userIds: string[],title:string, message: string }) {
        return this.notificationService.sendNotifToUsers(body.userIds,body.title, body.message);
    }
    @Get('getUserNotifByUserId/:userId')
    async getUserNotifByUserId(@Param('userId')  userId: string ) {
        return this.notificationService.getUserNotif(userId);
    }
    @Patch('marqueAsRead/:userId')
    async marqueAsRead(@Param('notificationId')  notificationId: string,@Param('userId')  userId: string ) {
        return this.notificationService.marqueAsRead(notificationId,userId);
    }
    

}
