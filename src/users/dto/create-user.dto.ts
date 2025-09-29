/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'user@mail.com' })
    email: string;
    
    @ApiProperty({ example: '1234' })
    password: string;

    @ApiProperty({ example: 'Nexo Code' })
    name: string;
}
