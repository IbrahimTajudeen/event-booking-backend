/* eslint-disable prettier/prettier */
import {
    Entity, Column, PrimaryGeneratedColumn,
    CreateDateColumn, UpdateDateColumn,
    OneToMany
} from 'typeorm';
import { Event } from '../../events/entities/event.entity';
import { Booking } from '../../bookings/entities/booking.entity';
import { UserRole } from 'src/common/types/user.type';
import { Status } from 'src/common/types/status.type';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER, // roles: user | admin
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE,
  })
  status: Status;

  // A user can create many events (if admin)
  @OneToMany(() => Event, (event) => event.organizer)
  events: Event[];

  // A user can book many events
  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
