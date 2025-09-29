/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Payment } from 'src/payments/entities/payment.entity';
import { Booking } from 'src/bookings/entities/booking.entity';
import { User } from 'src/common/entities/user.entity';
import { Event } from 'src/events/entities/event.entity';

export const getDatabaseConfig = ( configService: ConfigService,): TypeOrmModuleOptions => ({
  type: configService.get<string>('DB_TYPE') as 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  entities: [User, Event, Booking, Payment], // Entities
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  autoLoadEntities: true,
  synchronize: true,             // Auto-create tables (use migrations in production)
  logging: true,                 // Enable query logging
});
