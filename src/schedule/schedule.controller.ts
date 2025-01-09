import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateScheduleDto: UpdateScheduleDto) {
    return this.scheduleService.update(+id, updateScheduleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduleService.remove(+id);
  }
}
