/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto'; 
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { Status } from 'src/common/types/status.type';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);
  constructor(@InjectRepository(Event) private readonly eventsRepository: Repository<Event>) {}

  async create(createEventDto: CreateEventDto) : Promise<Event> {
    this.logger.log('Creating a new event');  
    const event = this.eventsRepository.create({
        title: createEventDto.title,
        description: createEventDto.description,
        date: createEventDto.date,
        location: createEventDto.location,
        price: createEventDto.price,
        capacity: createEventDto.capacity,
        createdBy: createEventDto.createdBy,
        organizer: createEventDto.organizer,
        status: createEventDto.status
      });
    return await this.eventsRepository.save(event);
  }

  async findAll(): Promise<Event[]> {
    return await this.eventsRepository.find();
  }

  async findOne(id: number) : Promise<Event | null> {
    return await this.eventsRepository.findOneBy({ id: id });
  }

  async update(id: number, updateEventDto: UpdateEventDto) : Promise<Event | null> {
    await this.eventsRepository.update({ id: id }, {
      title: updateEventDto.title,
      description: updateEventDto.description,
      date: updateEventDto.date,
      location: updateEventDto.location,
      price: updateEventDto.price,
      capacity: updateEventDto.capacity,
      organizer: updateEventDto.organizer,
      status: updateEventDto.status
    });
    return await this.findOne(id);
  }

  async updateStatus(id: number, status: Status) : Promise<Event | null> {
    await this.eventsRepository.update({ id: id }, { status: status });
    return await this.findOne(id);
  }

  async remove(id: number): Promise<string> {
    await this.eventsRepository.delete({ id: id });
    return `Event with the id: #${id} has been deleted successfully`;
  }
}
