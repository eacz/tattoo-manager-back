import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { generateFromEmail } from 'unique-username-generator';

import { User } from './entities/user.entity';
import { SignUpDto } from './dto/signup.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { AuthResponse } from './interfaces/auth-response.interface';
import { LoginDto } from './dto/login.dto';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  async create(signUpDto: SignUpDto): Promise<AuthResponse> {
    let { password, username } = signUpDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    if (!username) {
      username = generateFromEmail(signUpDto.email, 4);
    }

    let user = this.userRepository.create({
      ...signUpDto,
      password: hashedPassword,
      username,
    });

    try {
      user = await this.userRepository.save(user);
      delete user.password;
      const payload: JwtPayload = {
        username: user.username,
        email: user.email,
      };
      const token = this.jwtService.sign(payload, {
        expiresIn: this.configService.get('JWT_EXPIRES_IN') || 3600,
      });
      return {
        user,
        token,
      };
    } catch (error) {
      this.handleErrors(error);
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { password, email } = loginDto;
    const where = { email };
    const user = await this.userRepository.findOne({
      where: where,
      select: [
        'id',
        'username',
        'name',
        'email',
        'password',
        'active',
        'createdAt',
        'updatedAt',
      ],
    });

    if (user && bcrypt.compareSync(password, user.password)) {
      const payload: JwtPayload = {
        username: user.username,
        email: user.email,
      };

      const token = this.jwtService.sign(payload, {
        expiresIn: this.configService.get('JWT_EXPIRES_IN') || 3600,
      });
      delete user.password;

      return { token, user: { ...user } };
    } else {
      throw new UnauthorizedException(
        this.i18n.t('responses.auth.invalid-credentials'),
      );
    }
  }

  async renewToken(token: string): Promise<{ token: string; user: User }> {
    try {
      const payload: JwtPayload = await this.jwtService.verify(token);
      const user = await this.userRepository.findOne({
        where: { email: payload.email },
      });
      delete user.password;
      const newToken = this.jwtService.sign(
        { username: payload.username },
        { expiresIn: this.configService.get('JWT_EXPIRES_IN') || 3600 },
      );
      return { token: newToken, user };
    } catch (error) {
      throw new BadRequestException(
        this.i18n.t('responses.auth.invalid-token'),
      );
    }
  }

  async getUserInfo(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['active', 'email', 'name', 'createdAt', 'username'],
    });

    return user
  }

  private handleErrors(error: any) {
    if (error.code === '23505') {
      const field = error.detail.includes('username')
        ? this.i18n.t('responses.auth.username')
        : 'Email';
      const message = this.i18n.t('responses.auth.conflict-field', {
        args: { field },
      });
      throw new ConflictException(message);
    } else {
      throw error;
    }
  }
}
