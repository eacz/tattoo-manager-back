import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';

import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
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

    const appointment = this.appointmentRepository.create({
      ...createAppointmentDto,
      user,
    });
    await this.appointmentRepository.save(appointment);

    return { ok: true, appointment };
  }

  async findAll(getAppointmentsDto: GetAppointmentsDto, user: User) {
    const { endDate, startDate, limit = 10, offset = 0 } = getAppointmentsDto;

    const [appointments, total] = await Promise.all([
      this.appointmentRepository.find({
        skip: offset,
        take: limit,
        order: { dateStart: 'ASC' },
        where: {
          dateEnd: Between(startDate, endDate),
          user: { id: user.id },
        },
        select: ['dateStart', 'dateEnd', 'id', 'status', 'title'],
      }),
      this.appointmentRepository.count({
        where: {
          dateEnd: Between(startDate, endDate),
          user: { id: user.id },
        },
      }),
    ]);
    //TODO: fix this renaming field with a query builder
    return {
      ok: true,
      appointments: appointments.map((appointment) => ({
        end: appointment.dateEnd,
        start: appointment.dateStart,
        title: appointment.title,
        status: appointment.status,
        id: appointment.id,
      })),
      total,
    };
  }

  async findOne(id: number, user: User) {
    const appointment = await this.appointmentRepository.findOne({
      where: {
        id,
        user: { id: user.id },
      },
    });
    if (!appointment) {
      throw new NotFoundException(
        this.i18n.t('responses.appointment.invalid-id', { args: { id } }),
      );
    }
    return { ok: true, appointment };
  }

  async update(
    id: number,
    updateAppointmentDto: UpdateAppointmentDto,
    user: User,
  ) {
    const result = await this.appointmentRepository.update(
      {
        id,
        user: { id: user.id },
      },
      updateAppointmentDto,
    );

    if (result.affected === 0) {
      throw new NotFoundException(
        this.i18n.t('responses.appointment.invalid-id', { args: { id } }),
      );
    }

    return { ok: true };
  }

  async remove(id: number, user: User) {
    const result = await this.appointmentRepository.delete({
      id,
      user: { id: user.id },
    });

    if (result.affected === 0) {
      throw new NotFoundException(
        this.i18n.t('responses.appointment.invalid-id', { args: { id } }),
      );
    }

    return { ok: true };
  }
}
