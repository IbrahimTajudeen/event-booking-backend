/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class LoginAuthDto
{
    @ApiProperty({ example: 'admin@example.com' })
    email: string;

    @ApiProperty({ example: 'admin1234' })
    password: string;
}