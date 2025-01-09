import { ArrayNotEmpty, IsArray, IsIn } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

import { IsSchedule } from '../decorators/is-schedule';
import { validWorkdays, Workdays } from '../types/workdays';
import { I18nTranslations } from 'src/generated/i18n.generated';

export class CreateScheduleDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsSchedule({
    message: i18nValidationMessage<I18nTranslations>('validation.IS_SCHEDULE'),
  })
  schedulesHours: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsIn(validWorkdays, {
    each: true,
    message: i18nValidationMessage<I18nTranslations>('validation.IS_IN'),
  })
  workdays: Workdays[];
}
