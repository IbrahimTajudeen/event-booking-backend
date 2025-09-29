/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { User } from 'src/common/entities/user.entity';
import { Booking } from '../../bookings/entities/booking.entity';
import { Status } from 'src/common/types/status.type';
import { ApiProperty } from '@nestjs/swagger';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'HackerTon Event' })
  @Column()
  title: string;

  @ApiProperty({ example: 'An event where developer meet and challenge each other with projects' })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ example: 'The date the event with be held' })
  @Column({ type: 'timestamp' })
  date: Date;

  @ApiProperty({ example: 'Address/Location of where the event will be held' })
  @Column()
  location: string;

  @ApiProperty({ example: 'Price to pay to be able to paticipate in the event' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ApiProperty({ example: 'Status of the event. Active or Inactive' })
  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE,
  })
  status: Status;

  @ApiProperty({ example: 'Amount of individuals that can be hosted at the event' })
  @Column({ default: 100 })
  capacity: number; // Max tickets

  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: 'The admin user that created the event' })
  // Created By (admin user)
  @ManyToOne(() => User, (user) => user.events, { onDelete: 'CASCADE' })
  createdBy: User

  @ApiProperty({ example: 'The admin user that will organize the event' })
  // Organizer (admin user)
  @ManyToOne(() => User, (user) => user.events, { onDelete: 'CASCADE' })
  organizer: User;

  // Event has many bookings
  @OneToMany(() => Booking, (booking) => booking.event)
  bookings: Booking[];
}
