import { IsString, MinLength, IsEmail } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';

export class LoginDto {
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
  @MinLength(8, {
    message: i18nValidationMessage<I18nTranslations>('validation.MIN'),
  })
  password: string;
}
