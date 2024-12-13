import { IsNumber, IsOptional, IsPositive, Max, Min } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';

export class PaginationDto {
  @IsOptional()
  @IsNumber(
    {},
    {
      message: i18nValidationMessage<I18nTranslations>('validation.IS_NUMBER'),
    },
  )
  @Min(0, {
    message: i18nValidationMessage<I18nTranslations>('validation.MIN'),
  })
  offset?: number;

  @IsOptional()
  @IsNumber(
    {},
    {
      message: i18nValidationMessage<I18nTranslations>('validation.IS_NUMBER'),
    },
  )
  @IsPositive({
    message: i18nValidationMessage<I18nTranslations>('validation.IS_POSITIVE'),
  })
  @Min(1, {
    message: i18nValidationMessage<I18nTranslations>('validation.MIN'),
  })
  @Max(100, {
    message: i18nValidationMessage<I18nTranslations>('validation.MAX'),
  })
  limit?: number;
}
