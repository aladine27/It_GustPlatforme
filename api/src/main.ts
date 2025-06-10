// main.ts
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { APP_GUARD } from '@nestjs/core';

import { RolesGuard } from './guards/roles.guard';
import { AccessTokenGuard } from './guards/accessToken.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //cors 
  app.enableCors({
    origin: 'http://localhost:5173', // ton app React
    credentials: true,              // utile si tu envoies des cookies ou headers auth
  });



  // Swagger…
  const config = new DocumentBuilder()
    .setTitle('Pfe project')
    .setDescription('Pfe project API description')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT',name: 'Authorization', in: 'header' }, 'access-token')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Guards globaux
  app.useGlobalGuards(
    new AccessTokenGuard(app.get(Reflector)),
    new RolesGuard(app.get(Reflector))
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
