import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { getUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { GetAppointmentsDto } from './dto/get-appointments.dto';

@Auth()
@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @getUser() user: User,
  ) {
    return this.appointmentService.create(createAppointmentDto, user);
  }

  @Get()
  findAll(@Query() getAppointments: GetAppointmentsDto, @getUser() user: User) {
    return this.appointmentService.findAll(getAppointments, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @getUser() user: User) {
    return this.appointmentService.findOne(+id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @getUser() user: User
  ) {
    return this.appointmentService.update(+id, updateAppointmentDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @getUser() user: User) {
    return this.appointmentService.remove(+id, user);
  }
}
