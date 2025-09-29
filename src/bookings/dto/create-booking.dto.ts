import type { User } from 'src/common/entities/user.entity';
import type { Event } from 'src/events/entities/event.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  
  @ApiProperty({ example: 3 })
  tickets: number;

  @ApiProperty({ example: { id: 3 } })
  user: User;

  @ApiProperty({ example: { id: 1 } })
  event: Event;
}
