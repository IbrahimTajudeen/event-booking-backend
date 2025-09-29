/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';
import { Booking } from './entities/booking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
        PassportModule,
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET') || 'eventbookingsecret',
            signOptions: { expiresIn: configService.get<string>('JWT_EXPIRATION') || '1h' },
          }),
          inject: [ConfigService],
        })
  ],
  controllers: [BookingsController],
  providers: [BookingsService, JwtStrategy],
  exports: [BookingsService],
})
export class BookingsModule {}
