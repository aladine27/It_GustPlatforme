import { Module } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { LeaveController } from './leave.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { leaveSchema } from './entities/leave.entity';

@Module({
   imports: [MongooseModule.forFeature([{ name: 'leaves', schema: leaveSchema }])],
  controllers: [LeaveController],
  providers: [LeaveService],
})
export class LeaveModule {}
