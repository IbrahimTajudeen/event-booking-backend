import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Booking } from './bookings/entities/booking.entity';
import { User } from './common/entities/user.entity';
import { Payment } from './payments/entities/payment.entity';
import { Event } from './events/entities/event.entity'; // Ensure Event is imported

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Event, Booking, Payment],
  migrations: ['src/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
});
export default AppDataSource;