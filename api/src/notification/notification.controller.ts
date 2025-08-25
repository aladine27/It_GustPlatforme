import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorators';

@Controller('notification')
@ApiBearerAuth("access-token")
@UseGuards(AccessTokenGuard) 
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}
    @Post('send')
    @UseGuards( RolesGuard)
    @Roles('Admin','Rh','Employe','Manager')
    async sendNotifToUsers(@Body() body: { userIds: string[],title:string, message: string }) {
        return this.notificationService.sendNotifToUsers(body.userIds,body.title, body.message);
    }
    @Get('getUserNotifByUserId/:userId')
    @UseGuards( RolesGuard)
    @Roles('Admin','Rh','Employe','Manager')
    async getUserNotifByUserId(@Param('userId')  userId: string ) {
        return this.notificationService.getUserNotif(userId);
    }
    @Patch('marqueAsRead/:userId')
    @UseGuards( RolesGuard)
     @Roles('Admin','Rh','Employe','Manager')
    async marqueAsRead(@Param('userId')  userId: string ) {
        return this.notificationService.marqueAsRead(userId);
    }
    

}
