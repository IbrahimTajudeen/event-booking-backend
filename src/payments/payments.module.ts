/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config'; 
import { Payment } from './entities/payment.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([Payment]),
      PassportModule,
      JwtModule.registerAsync({
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          secret: configService.get<string>('JWT_SECRET') || 'eventbookingsecret',
          signOptions: { expiresIn: configService.get<string>('JWT_EXPIRATION') || '1h' },
        }),
        inject: [ConfigService],
      })],
  controllers: [PaymentsController],
  providers: [PaymentsService, JwtStrategy],
  exports: [PaymentsService],
})
export class PaymentsModule {}
