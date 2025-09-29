import { ApiProperty } from '@nestjs/swagger';
import { Booking } from 'src/bookings/entities/booking.entity';
import { User } from 'src/common/entities/user.entity';
export class CreatePaymentDto {
    @ApiProperty({ example: { id: 1 } })
    booking: Booking;

    @ApiProperty({ example: { id: 1 } })
    user: User;
    
    @ApiProperty({ example: 100.00 })
    amount: number;

    @ApiProperty({ example: 'pending' }) // pending | completed | failed
    status: string;

    @ApiProperty({ example: Date.now() })
    paidAt: Date;
}
