
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBookingDto{
    @ApiProperty({ example: 'pending' })
      status: string; // pending | confirmed | cancelled
}