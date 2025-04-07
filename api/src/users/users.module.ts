import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Mongoose } from 'mongoose';
import { userInfo } from 'os';
import { userSchema } from './entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'users', schema: userSchema }])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
