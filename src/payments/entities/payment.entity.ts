/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';
import { User } from 'src/common/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: { id: 1 } })
  @ManyToOne(() => Booking, (booking) => booking.id, { onDelete: 'CASCADE' })
  booking: Booking;

  @ApiProperty({ example: { id: 1 } })
  @ManyToOne(() => User, (user) => user.id, { onDelete: 'SET NULL' })
  user: User;

  @ApiProperty({ example: 100.00 })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({ example: 'pending' })
  @Column({ default: 'pending' }) // pending | completed | failed
  status: string;

  @ApiProperty({ example: Date.now() })
  @CreateDateColumn()
  paidAt: Date;
}
