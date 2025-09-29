/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from 'src/events/entities/event.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),
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
  controllers: [EventsController],
  providers: [EventsService, JwtStrategy],
  exports: [EventsService],
})
export class EventsModule {}
