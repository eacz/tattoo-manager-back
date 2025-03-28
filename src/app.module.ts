import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';
import {
  AcceptLanguageResolver,
  CookieResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AppointmentModule } from './appointment/appointment.module';
import RequestLogMiddleware from './common/middlewares/requestLog.middleware';
import { User } from './auth/entities/user.entity';
import { Appointment } from './appointment/entities/appointment.entity';
import { ScheduleModule } from './schedule/schedule.module';
import { Schedule } from './schedule/entities/schedule.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      typesOutputPath: path.join(__dirname, '../src/generated/i18n.generated.ts'),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new CookieResolver(),
        new HeaderResolver(['x-lang']),
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const isProduction = configService.get('STAGE') !== 'dev';
        return {
          ssl: isProduction,
          extra: {
            ssl: isProduction ? { rejectUnauthorized: false } : null,
          },
          type: 'postgres',
          host: configService.get('PGHOST'),
          username: configService.get('PGUSER'),
          password: configService.get('PGPASSWORD'),
          database: configService.get('PGDB'),
          autoLoadEntities: true,
          synchronize: true,
          entities: [User, Appointment, Schedule],
          port: configService.get('PGPORT'),
        };
      },
    }),
    AuthModule,
    AppointmentModule,
    ScheduleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLogMiddleware).forRoutes('*');
  }
}
