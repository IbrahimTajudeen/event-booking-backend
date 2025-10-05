/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/common/entities/user.entity';
import { Event } from 'src/events/entities/event.entity'
import { Booking } from './bookings/entities/booking.entity';
import { Payment } from './payments/entities/payment.entity';
import * as bcrypt from 'bcrypt';
import { UserRole } from './common/types/user.type';
import { Status } from './common/types/status.type';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { title } from 'process';

dotenv.config();
const logger = new Logger('Bootstrap Entry Point');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3200', // allowing front end
    credentials: true,
  });

  const userRepo = app.get(getRepositoryToken(User))
  const eventRepo = app.get(getRepositoryToken(Event))
  const bookingRepo = app.get(getRepositoryToken(Booking))
  const paymentRepo = app.get(getRepositoryToken(Payment))


  //Adding Default Super and User to the system
  const superAdminExists = await userRepo.findOne({ where: { email: 'superadmin@super.com', role: UserRole.SUPERADMIN } });
  if (!superAdminExists) {
    const superAdmin = userRepo.create({
      email: 'superadmin@super.com',
      password: await bcrypt.hash('super123', 10),
      name: 'Super NexoCode',
      role: UserRole.SUPERADMIN,
      status: Status.ACTIVE
    });
    await userRepo.save(superAdmin);
    console.log('✅ Super Admin seeded');
  }

  //Adding Default Admin to the system
  const adminExists = await userRepo.findOne({ where: { email: 'admin@admin.com', role: UserRole.ADMIN } });
  if (!adminExists) {
    const admin = userRepo.create({
      email: 'admin@admin.com',
      password: await bcrypt.hash('admin123', 10),
      name: 'Admin NexoCode',
      role: UserRole.ADMIN,
      status: Status.ACTIVE
    });
    await userRepo.save(admin);
    console.log('✅ Admin seeded');
  }

  //Adding Default User to the system
  const userExists = await userRepo.findOne({ where: { email: 'user@user.com', role: UserRole.USER } });
  if (!userExists) {
    const user = userRepo.create({
      email: 'user@user.com',
      password: await bcrypt.hash('user123', 10),
      name: 'User NexoCode',
      role: UserRole.USER,
      status: Status.ACTIVE
    });
    await userRepo.save(user);
    console.log('✅ User seeded');
  }

  //Adding default event to the system
  const eventExist = await eventRepo.findOne({ where: { id: 1 } });
  if (!eventExist) {
    const event = eventRepo.create({
      title: 'Techtober',
      description: 'An event where developer meet and challenge each other with projects',
      date: new Date(Date.now()),
      location: 'Unguwan Sarki',
      price: 2500.00,
      capacity: 2600,
      createdBy: { id: 1 },
      organizer: { id: 2 },
      status: Status.ACTIVE
    });
    await eventRepo.save(event);
    console.log('✅ Event seeded');
  }

  //Adding default booking to the system
  const bookingExist = await bookingRepo.findOne({ where: { id: 1 } });
  if (!bookingExist) {
    const booking = bookingRepo.create({
      tickets: 15,
      user: { id: 3 },
      event: { id: 1 },
      status: Status.ACTIVE
    });
    await bookingRepo.save(booking);
    console.log('✅ Booking seeded');
  }

  //Adding default payment to the system
  const paymentExist = await paymentRepo.findOne({ where: { booking: { id: 1 }, user: { id: 1}, id: 1 } });
  if (!paymentExist) {
    const payment = paymentRepo.create({
      booking: { id: 1 },
      user: { id: 3 },
      amount: (2600 * 15),
      status: Status.ACTIVE
    });
    await paymentRepo.save(payment);
    console.log('✅ Payment seeded');
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


  await app.listen(process.env.PORT ?? 3100);
}
bootstrap();
