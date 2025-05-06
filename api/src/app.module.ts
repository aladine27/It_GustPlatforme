import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { JobOffreModule } from './job-offre/job-offre.module';
import { JobCategoryModule } from './job-category/job-category.module';
import { LeaveModule } from './leave/leave.module';
import { EventModule } from './event/event.module';
import { ApplicationModule } from './application/application.module';
import { DocumentModule } from './document/document.module';
import { FraisAdvantageModule } from './frais-advantage/frais-advantage.module';
import { LeaveTypeModule } from './leave-type/leave-type.module';
import { FraiTypeModule } from './frai-type/frai-type.module';
import { EventTypeModule } from './event-type/event-type.module';
import { AdminModule } from './admin/admin.module';
import { RhModule } from './rh/rh.module';
import { EmployeModule } from './employe/employe.module';
import { ManagerModule } from './manager/manager.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

const connection="process.env.MONGO_URI"

@Module({
  imports: [
    UsersModule, CategoriesModule, ProjectsModule, TasksModule, JobOffreModule, JobCategoryModule, LeaveModule, EventModule, ApplicationModule, DocumentModule, FraisAdvantageModule, LeaveTypeModule, FraiTypeModule, EventTypeModule, AdminModule, RhModule, EmployeModule, ManagerModule, AuthModule
  ,  ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Spécifier explicitement le fichier .env
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    
  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
