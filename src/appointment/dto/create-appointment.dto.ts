import {
  IsString,
  MaxLength,
  IsOptional,
  IsNumber,
  IsEnum,
  IsDate,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { Status } from '../entities/appointment.entity';
import { Type } from 'class-transformer';

export class CreateAppointmentDto {
  @IsDate({
    message: i18nValidationMessage<I18nTranslations>('validation.IS_DATE'),
  })
  @Type(() => Date)
  dateStart: Date;

  @IsDate({
    message: i18nValidationMessage<I18nTranslations>('validation.IS_DATE'),
  })
  @Type(() => Date)
  dateEnd: Date;

  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.IS_STRING'),
  })
  @MaxLength(50, {
    message: i18nValidationMessage<I18nTranslations>('validation.MAX'),
  })
  title: string;

  @IsEnum(Status, {
    message: i18nValidationMessage<I18nTranslations>('validation.IS_ENUM'),
  })
  @IsOptional()
  status?: Status;

  @IsNumber(
    {},
    {
      message: i18nValidationMessage<I18nTranslations>('validation.IS_NUMBER'),
    },
  )
  price: number;

  @IsOptional()
  @IsNumber(
    {},
    {
      message: i18nValidationMessage<I18nTranslations>('validation.IS_NUMBER'),
    },
  )
  earnestMoney?: number;

  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.IS_STRING'),
  })
  @MaxLength(500, {
    message: i18nValidationMessage<I18nTranslations>('validation.MAX'),
  })
  @IsOptional()
  notes?: string;
}
