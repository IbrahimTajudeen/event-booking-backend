import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/common/entities/user.entity';

export class UpdatePaymentDto{
    @ApiProperty({ example: 'pending' }) // pending | completed | failed
    status: string;

    @ApiProperty({ example: { id: 1 } })
    user: User;
}
