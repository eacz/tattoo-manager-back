import {
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  IsOptional,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';

export class SignUpDto {
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.IS_STRING'),
  })
  @MinLength(3, {
    message: i18nValidationMessage<I18nTranslations>('validation.MIN'),
  })
  @MaxLength(20, {
    message: i18nValidationMessage<I18nTranslations>('validation.MAX'),
  })
  @IsOptional()
  username?: string;

  @IsEmail(
    {},
    {
      message: i18nValidationMessage<I18nTranslations>(
        'validation.INVALID_EMAIL',
      ),
    },
  )
  email: string;

  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.IS_STRING'),
  })
  @MinLength(3, {
    message: i18nValidationMessage<I18nTranslations>('validation.MIN'),
  })
  @MaxLength(20, {
    message: i18nValidationMessage<I18nTranslations>('validation.MAX'),
  })
  name: string;

  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.IS_STRING'),
  })
  @MinLength(8, {
    message: i18nValidationMessage<I18nTranslations>('validation.MIN'),
  })
  password: string;
}
