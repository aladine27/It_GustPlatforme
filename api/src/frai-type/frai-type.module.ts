import { Module } from '@nestjs/common';
import { FraiTypeService } from './frai-type.service';
import { FraiTypeController } from './frai-type.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FraiTypeSchema } from './entities/frai-type.entity';

@Module({
   imports: [MongooseModule.forFeature([{ name: 'fraiTypes', schema: FraiTypeSchema }])],
  controllers: [FraiTypeController],
  providers: [FraiTypeService],
})
export class FraiTypeModule {}
