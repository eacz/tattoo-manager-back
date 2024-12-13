import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { I18nTranslations } from 'src/generated/i18n.generated';

export class GetAppointmentsDto extends PaginationDto {
  @IsDate({
    message: i18nValidationMessage<I18nTranslations>('validation.IS_DATE'),
  })
  @Type(() => Date)
  startDate: Date 

  @IsDate({
    message: i18nValidationMessage<I18nTranslations>('validation.IS_DATE'),
  })
  @Type(() => Date)
  endDate: Date
}
