/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { User } from 'src/common/entities/user.entity';
  
@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);
  constructor(@InjectRepository(Booking) private readonly bookingsRepository: Repository<Booking>) {}

  async create(createBookingDto: CreateBookingDto) {
    this.logger.log('Creating a new booking');
    
    const booking = this.bookingsRepository.create({
      tickets: createBookingDto.tickets,
      status: 'pending',
      user: createBookingDto.user,
      event: createBookingDto.event
    })
    return await this.bookingsRepository.save(booking);
  }

  findAll() : Promise<Booking[]> {
    return this.bookingsRepository.find();
  }

  userBookingList(user: User): Promise<Booking[]> {
    return this.bookingsRepository.find({ where: { user: { id: user.id } } });
  }


  findOne(id: number) : Promise<Booking | null> {
    return this.bookingsRepository.findOne({ where: { id } });
  }

  userBookings(bookingId: number, user: User): Promise<Booking | null> {
    return this.bookingsRepository.findOne({ where: { id: bookingId, user: { id: user.id, role: user.role } } });
  }

  async update(id: number, updateBookingDto: UpdateBookingDto): Promise<Booking | null> {
    await this.bookingsRepository.update({ id: id }, {
      status: updateBookingDto.status
    });
    return await this.findOne(id);
  }

  async remove(id: number) {
    await this.bookingsRepository.delete({ id: id });
    return `Booking with the id: #${id} has been deleted successfully`;
  }
}
