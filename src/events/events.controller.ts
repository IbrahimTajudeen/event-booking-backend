import { Controller, Get, Post, Body, Patch, Put, Param, Delete, UseGuards, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { RolesGuard } from 'src/common/guards/role.guard';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { UserRole } from 'src/common/types/user.type';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { User } from 'src/common/entities/user.entity';
import { Status } from 'src/common/types/status.type';
import { StatusPipe } from 'src/common/pipes/status.pipe';
import { stat } from 'fs/promises';

export class StatusDto {
    @ApiProperty({ example: Status.ACTIVE })
    status: Status;
}

@ApiTags('Events')
@ApiBearerAuth('access-token')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}
 
  @ApiOperation({
    summary: 'Add Event (Admin Only)',
    description: 'Allows admins create events in the system.',
  })
  @ApiResponse({
    status: 200,
    description: 'Event successfully created',
    type: CreateEventDto,
  })
  @ApiResponse({
    status: 401,
    description: 'User Unauthorized',
    type: UnauthorizedException,
  })
  @ApiResponse({
    status: 403,
    description: 'User Forbid to access resource',
    type: ForbiddenException,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @Post('create-event')
  create(@Body() createEventDto: CreateEventDto, @CurrentUser() user: User) {
    if(user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You are not allowed to create an event');
    }
    createEventDto.createdBy = user;
    return this.eventsService.create(createEventDto);
  }

  @ApiOperation({
    summary: 'Returns all events (User, and Admin)',
    description: 'Allows users, admin fetch all events in the system.',
  })
  @ApiResponse({
    status: 200,
    description: 'Event successfully retrived',
  })
  @ApiResponse({
    status: 401,
    description: 'User Unauthorized',
    type: UnauthorizedException,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @Get('get-events')
  findAll() {
    return this.eventsService.findAll();
  }

  @ApiOperation({
    summary: 'Returns a single event (User, and Admin)',
    description: 'Allows users, admin view an event detail in the system using it\'s  Id.',
  })
  @ApiResponse({
    status: 200,
    description: 'Event successfully retrived',
  })
  @ApiResponse({
    status: 401,
    description: 'User Unauthorized',
    type: UnauthorizedException,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @Get('event-detail/:eventId')
  findOne(@Param('eventId') eventId: number) {
    return this.eventsService.findOne(eventId);
  }

  @ApiOperation({
    summary: 'Updates a single event (Admin Only)',
    description: 'Allows admin to update an event in the system using it\'s  Id.',
  })
  @ApiResponse({
    status: 200,
    description: 'Event successfully updated',
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
  @Put('update-event/:eventId')
  update(@Param('eventId') eventId: number, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(eventId, updateEventDto);
  }

  @ApiOperation({
    summary: 'Updates the event status (Admin Only)',
    description: 'Allows admin to update an event status in the system using it\'s  Id.',
  })
  @ApiResponse({
    status: 200,
    description: 'Event status successfully updated',
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
  @Patch('update-event-status/:eventId')
  updateStatus(@Param('eventId') eventId: number, @Body() status: StatusDto) {
    return this.eventsService.updateStatus(eventId, status.status);
  }

  @ApiOperation({
    summary: 'Deletes an event (Admin Only)',
    description: 'Allows admin to detele an event in the system using it\'s  Id.',
  })
  @ApiResponse({
    status: 200,
    description: 'Event successfully deleted',
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
  @Delete('delete-event/:eventId')
  remove(@Param('eventId') eventId: number) {
    return this.eventsService.remove(eventId);
  }
}
