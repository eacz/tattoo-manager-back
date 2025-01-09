import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { Repository } from 'typeorm';

import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

import { User } from 'src/auth/entities/user.entity';
import { Schedule } from './entities/schedule.entity';
import { I18nTranslations } from 'src/generated/i18n.generated';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  async create(createScheduleDto: CreateScheduleDto, user: User) {
    try {
      const schedule = this.scheduleRepository.create({
        ...createScheduleDto,
        user: user,
      });
      await this.scheduleRepository.save(schedule);
      return { ok: true, schedule };
    } catch (error: any) {
      if (error?.code === '23505') {
        throw new UnprocessableEntityException(
          this.i18n.t('responses.schedule.duplicated-schedule'),
        );
      }
    }
  }

  async findByUser(user: User) {
    const schedule = await this.scheduleRepository.findOne({
      where: { user: { id: user.id } },
    });
    if (!schedule) {
      throw new NotFoundException(this.i18n.t('responses.schedule.invalid-id'));
    }
    return schedule;
  }

  update(id: number, updateScheduleDto: UpdateScheduleDto) {
    return `This action updates a #${id} schedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} schedule`;
  }
}
