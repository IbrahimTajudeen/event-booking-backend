/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/common/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserRole } from './common/types/user.type';
import { Status } from './common/types/status.type';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const userRepo = app.get(getRepositoryToken(User))

  const exists = await userRepo.findOne({ where: { email: 'superadmin@super.com', role: UserRole.SUPERADMIN } });
  if (!exists) {
    const admin = userRepo.create({
      email: 'superadmin@super.com',
      password: await bcrypt.hash('admin123', 10),
      name: 'Super NexoCode',
      role: UserRole.SUPERADMIN,
      status: Status.ACTIVE
    });
    await userRepo.save(admin);
    console.log('✅ Admin seeded');
  }

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('Event Booking API')
    .setDescription('API documentation for the event booking app')
    .setVersion('1.0')
    .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token',) // if using JWT auth
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
