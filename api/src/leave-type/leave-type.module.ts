import { Module } from '@nestjs/common';
import { LeaveTypeService } from './leave-type.service';
import { LeaveTypeController } from './leave-type.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LeaveTypeSchema } from './entities/leave-type.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'leaveTypes', schema: LeaveTypeSchema }])],
  controllers: [LeaveTypeController],
  providers: [LeaveTypeService],
})
export class LeaveTypeModule {}
