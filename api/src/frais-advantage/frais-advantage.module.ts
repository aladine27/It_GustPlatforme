import { Module } from '@nestjs/common';
import { FraisAdvantageService } from './frais-advantage.service';
import { FraisAdvantageController } from './frais-advantage.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FraisAdvantageSchema } from './entities/frais-advantage.entity';
import { FraiTypeSchema } from 'src/frai-type/entities/frai-type.entity';
import { userSchema } from 'src/users/entities/user.entity';

@Module({
   imports: [MongooseModule.forFeature([{ name: 'fraisAdvantages', schema: FraisAdvantageSchema }]),
            MongooseModule.forFeature([{ name: 'fraiTypes', schema: FraiTypeSchema }]),
            MongooseModule.forFeature([{ name: 'users', schema: userSchema }])],
  controllers: [FraisAdvantageController],
  providers: [FraisAdvantageService],
})
export class FraisAdvantageModule {}
