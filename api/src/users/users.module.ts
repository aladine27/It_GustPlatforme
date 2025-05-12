// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersService }    from './users.service';
import { UsersController } from './users.controller';
import { userSchema }      from './entities/user.entity';

import { Admin, AdminSchema }     from 'src/admin/entities/admin.entity';
import { Employe, EmployeSchema } from 'src/employe/entities/employe.entity';
import { Manager, ManagerSchema } from 'src/manager/entities/manager.entity';
import { Rh, RhSchema }           from 'src/rh/entities/rh.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'users',
        schema: userSchema,
        discriminators: [
          { name: Admin.name,   schema: AdminSchema   },
          { name: Employe.name, schema: EmployeSchema },
          { name: Manager.name, schema: ManagerSchema },
          { name: Rh.name,      schema: RhSchema      },
        ],
      },
    ]),
  ],
  controllers: [UsersController],
  providers:   [UsersService],
  exports:     [UsersService],
})
export class UsersModule {}
