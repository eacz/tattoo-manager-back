import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';

import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

import { Auth } from 'src/auth/decorators/auth.decorator';
import { getUser } from 'src/auth/decorators/get-user.decorator';

import { User } from 'src/auth/entities/user.entity';

import { ScheduleService } from './schedule.service';

@Auth()
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  create(@Body() createScheduleDto: CreateScheduleDto, @getUser() user: User) {
    return this.scheduleService.create(createScheduleDto, user);
  }

  @Get()
  findByUser(@getUser() user: User) {
    return this.scheduleService.findByUser(user);
  }

  @Patch()
  update(@Body() updateScheduleDto: UpdateScheduleDto, @getUser() user: User) {
    return this.scheduleService.update(updateScheduleDto, user);
  }

  @Delete()
  remove(@getUser() user: User) {
    return this.scheduleService.remove(user);
  }
}
