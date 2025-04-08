import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { documentSchema } from './entities/document.entity';
import { userSchema } from 'src/users/entities/user.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'documents', schema: documentSchema }])
,MongooseModule.forFeature([{ name: 'users', schema: userSchema }])],
  controllers: [DocumentController],
  providers: [DocumentService],
})
export class DocumentModule {}
