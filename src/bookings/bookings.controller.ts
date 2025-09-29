import { Controller, Get, Post, Body, Patch, Put, Param, Delete, UseGuards, UnauthorizedException } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { RolesGuard } from 'src/common/guards/role.guard';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { UserRole } from 'src/common/types/user.type';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Booking')
@ApiBearerAuth('access-token')
@Controller('booking')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @ApiOperation({
    summary: 'Book an event (User Only)',
    description: 'Allows users to book an event.',
  })
  @ApiResponse({
    status: 200,
    description: 'Event successfully booked',
    type: CreateBookingDto,
  })
  @ApiResponse({
    status: 401,
    description: 'User Unauthorized',
    type: UnauthorizedException,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Post('book-event')
  create(@Body() createBookingDto: CreateBookingDto) {
    console.log(createBookingDto)
    return this.bookingsService.create(createBookingDto);
  }


  @ApiOperation({
    summary: 'Returns all booking (Admin Only)',
    description: 'Allows admin fetch all bookings in the system.',
  })
  @ApiResponse({
    status: 200,
    description: 'Bookings successfully retrived',
  })
  @ApiResponse({
    status: 401,
    description: 'User Unauthorized',
    type: UnauthorizedException,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @Get('get-bookings')
  getBooking() {
    return this.bookingsService.findAll();
  }

  @ApiOperation({
    summary: 'Returns all booking (User Only)',
    description: 'Allows users fetch all the bookings they have made in the system.',
  })
  @ApiResponse({
    status: 200,
    description: 'Bookings successfully retrived',
  })
  @ApiResponse({
    status: 401,
    description: 'User Unauthorized',
    type: UnauthorizedException,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Get('my-bookings')
  myBookingsList(@CurrentUser() user: any) {
    return this.bookingsService.userBookingList(user);
  }

  @ApiOperation({
    summary: 'Returns a single booking (Admin Only)',
    description: 'Allows admin to view a booking detail in the system using it\'s  Id.',
  })
  @ApiResponse({
    status: 200,
    description: 'Booking successfully retrived',
  })
  @ApiResponse({
    status: 401,
    description: 'User Unauthorized',
    type: UnauthorizedException,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('booking-detail/:bookingId')
  bookingDetail(@Param('bookingId') bookingId: number) {
    return this.bookingsService.findOne(bookingId);
  }

  @ApiOperation({
    summary: 'Returns a single booking (User Only)',
    description: 'Allows user to view a booking detail in the system using it\'s  Id.',
  })
  @ApiResponse({
    status: 200,
    description: 'Booking successfully retrived',
  })
  @ApiResponse({
    status: 401,
    description: 'User Unauthorized',
    type: UnauthorizedException,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Get('my-bookings/:bookingId')
  myBookingDetail(@Param('bookingId') bookingId: number, @CurrentUser() user) {
    return this.bookingsService.userBookings(bookingId, user);
  }

  @ApiOperation({
    summary: 'Updates a single booking (Admin Only)',
    description: 'Allows admin to partially update a booking in the system using it\'s  Id.',
  })
  @ApiResponse({
    status: 200,
    description: 'Booking successfully updated',
  })
  @ApiResponse({
    status: 401,
    description: 'User Unauthorized',
    type: UnauthorizedException,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    type: UnauthorizedException,
  })
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(UserRole.ADMIN)
  @Patch('update-booking-status/:id')
  update(@Param('id') id: number, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingsService.update(id, updateBookingDto);
  }

  @ApiOperation({
    summary: 'Deletes a booking (Admin Only)',
    description: 'Allows admin to detele a booking in the system using it\'s  Id.',
  })
  @ApiResponse({
    status: 200,
    description: 'Booking successfully deleted',
  })
  @ApiResponse({
    status: 401,
    description: 'User Unauthorized',
    type: UnauthorizedException,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    type: UnauthorizedException,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('delete-booking/:bookingId')
  remove(@Param('bookingId') bookingId: number) {
    return this.bookingsService.remove(bookingId);
  }
}
