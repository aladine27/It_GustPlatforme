import { Module } from '@nestjs/common';
import { FraisAdvantageService } from './frais-advantage.service';
import { FraisAdvantageController } from './frais-advantage.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FraisAdvantageSchema } from './entities/frais-advantage.entity';

@Module({
   imports: [MongooseModule.forFeature([{ name: 'fraisAdvantages', schema: FraisAdvantageSchema }])],
  controllers: [FraisAdvantageController],
  providers: [FraisAdvantageService],
})
export class FraisAdvantageModule {}
