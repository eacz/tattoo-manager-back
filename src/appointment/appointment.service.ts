import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';

import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { LessThan, MoreThan, Repository, Between } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { User } from 'src/auth/entities/user.entity';
import { GetAppointmentsDto } from './dto/get-appointments.dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto, user: User) {
    console.log(createAppointmentDto);
    console.log(user);
    if (createAppointmentDto.dateStart > createAppointmentDto.dateEnd) {
      throw new BadRequestException(
        this.i18n.t('responses.appointment.invalid-start-date'),
      );
    }

    if (
      createAppointmentDto.earnestMoney &&
      createAppointmentDto.earnestMoney > createAppointmentDto.price
    ) {
      throw new BadRequestException(
        this.i18n.t('responses.appointment.invalid-earnest-money'),
      );
    }

    const appointment = this.appointmentRepository.create({...createAppointmentDto, user});
    await this.appointmentRepository.save(appointment);

    return { ok: true, appointment };
  }

  async findAll(getAppointmentsDto: GetAppointmentsDto, user: User) {
    const { endDate, startDate, limit = 10, offset = 0 } = getAppointmentsDto;

    const appointments = await this.appointmentRepository.find({
      skip: offset,
      take: limit,
      order: { dateStart: 'ASC' },
      where: {
        dateEnd: Between(startDate, endDate),
        user: { id: user.id },
      },
    });
    return { ok: true, appointments };
  }

  findOne(id: number) {
    return `This action returns a #${id} appointment`;
  }

  update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    return `This action updates a #${id} appointment`;
  }

  remove(id: number) {
    return `This action removes a #${id} appointment`;
  }
}
