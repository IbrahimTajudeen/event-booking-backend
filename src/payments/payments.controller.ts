import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { RolesGuard } from 'src/common/guards/role.guard';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { UserRole } from 'src/common/types/user.type';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { User } from 'src/common/entities/user.entity';
import { Status } from 'src/common/types/status.type';

@ApiTags('Payments')
@ApiBearerAuth('access-token')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

@ApiOperation({
    summary: 'Pay for a booked event (User Only)',
    description: 'Allows users to pay for a booked event.',
  })
  @ApiResponse({
    status: 200,
    description: 'Event successfully paid for',
    type: CreatePaymentDto,
  })
  @ApiResponse({
    status: 401,
    description: 'User Unauthorized',
    type: UnauthorizedException,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Post('pay-booked-event')
  create(@Body() createPaymentDto: CreatePaymentDto, @CurrentUser() user: User) {
    createPaymentDto.user = user;
    return this.paymentsService.create(createPaymentDto);
  }

  @ApiOperation({
    summary: 'Retrives user payments (User Only)',
    description: 'Allows users to retrieve their payments.',
  })
  @ApiResponse({
    status: 200,
    description: 'User payments retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'User Unauthorized',
    type: UnauthorizedException,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Get('my-payments')
  myPayments(@CurrentUser() user: User) {
    return this.paymentsService.userPayments(user);
  }

  @ApiOperation({
    summary: 'Retrives all payments (Admin Only)',
    description: 'Allows administrator to retrieve all payments made by users.',
  })
  @ApiResponse({
    status: 200,
    description: 'Payments retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'User Unauthorized',
    type: UnauthorizedException,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('all-payments')
  allPayments() {
    return this.paymentsService.allPayments();
  }

  @ApiOperation({
    summary: 'Views user payment detail (User Only)',
    description: 'Allows users to view thier payment detail.',
  })
  @ApiResponse({
    status: 200,
    description: 'Payments retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'User Unauthorized',
    type: UnauthorizedException,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Get('my-payment-detail/:id')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(+id);
  }

  @ApiOperation({
    summary: 'Views user payment detail (User Only)',
    description: 'Allows users to view thier payment detail.',
  })
  @ApiResponse({
    status: 200,
    description: 'Payments retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'User Unauthorized',
    type: UnauthorizedException,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch('update-payment/:id')
  update(@Param('id') id: number, @Body() updatePaymentDto: UpdatePaymentDto, @CurrentUser() user: User) {
    if(user.role != UserRole.ADMIN)
      throw new ForbiddenException('User forbid to access resources')

    updatePaymentDto.user = user;
    return this.paymentsService.update(id, updatePaymentDto);
  }

  @ApiOperation({
    summary: 'Delete Payments(User Only)',
    description: 'Allows admin to delete payment.',
  })
  @ApiResponse({
    status: 200,
    description: 'Payments deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'User Unauthorized',
    type: UnauthorizedException,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('delete-payment/:id')
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(+id);
  }
}
