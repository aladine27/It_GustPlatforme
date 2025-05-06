import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   const config = new DocumentBuilder()
    .setTitle('Pfe project')
    .setDescription('Pfe project API description')
    .setVersion('1.0')
    .addBearerAuth({
      description: `Please enter token in following format: Bearer <JWT>`,
      name: 'Authorization',
      bearerFormat: 'Bearer',
      scheme: 'Bearer',
      type: 'http',
      in: 'header',
     },'access-token')
   
   
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
    // Enregistre RolesGuard pour toutes les routes
  app.useGlobalGuards(app.get(Reflector), new RolesGuard(app.get(Reflector)));

  await app.listen(process.env.PORT ?? 3000);
  
}
bootstrap();
