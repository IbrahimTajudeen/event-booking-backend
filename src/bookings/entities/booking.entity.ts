/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { User } from 'src/common/entities/user.entity';
import { Event } from 'src/events/entities/event.entity';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 1 })
  tickets: number;

  @Column({ default: 'pending' }) // pending | confirmed | cancelled
  status: string;

  @ManyToOne(() => User, (user) => user.bookings, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Event, (event) => event.bookings, { onDelete: 'CASCADE' })
  event: Event;

  @CreateDateColumn()
  bookedAt: Date;
}
