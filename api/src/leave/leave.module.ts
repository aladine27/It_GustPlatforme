import { Module } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { LeaveController } from './leave.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { leaveSchema } from './entities/leave.entity';
import { LeaveTypeSchema } from 'src/leave-type/entities/leave-type.entity';
import { userSchema } from 'src/users/entities/user.entity';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
   imports: [MongooseModule.forFeature([{ name: 'leaves', schema: leaveSchema }]),
   MongooseModule.forFeature([{ name: 'leaveTypes', schema: LeaveTypeSchema }]),
   MongooseModule.forFeature([{ name: 'users', schema: userSchema }]),
  NotificationModule
   
  
  
  
  
  
  ],
  controllers: [LeaveController],
  providers: [LeaveService],
})
export class LeaveModule {}
