import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Mongoose } from 'mongoose';
import { userInfo } from 'os';
import { userSchema } from './entities/user.entity';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { Admin, AdminSchema } from 'src/admin/entities/admin.entity';
import { Employe, EmployeSchema } from 'src/employe/entities/employe.entity';
import { Manager, ManagerSchema } from 'src/manager/entities/manager.entity';
import { Rh, RhSchema } from 'src/rh/entities/rh.entity';

@Module({
 imports: [
  MongooseModule.forFeature([
    {
      name: 'users',
      schema: userSchema,
      discriminators: [
        { name: Admin.name, schema: AdminSchema },
        { name: Employe.name, schema: EmployeSchema },
        { name: Manager.name, schema: ManagerSchema },
        { name: Rh.name, schema: RhSchema },
      ],
    },
  ]),
],

      
   
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
