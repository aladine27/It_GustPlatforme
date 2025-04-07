import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { documentSchema } from './entities/document.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'documents', schema: documentSchema }])],
  controllers: [DocumentController],
  providers: [DocumentService],
})
export class DocumentModule {}
