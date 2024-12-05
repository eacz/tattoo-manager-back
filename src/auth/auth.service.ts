import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { AuthResponse } from './interfaces/auth-response.interface';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async create(signUpDto: SignUpDto): Promise<AuthResponse> {
    console.log(signUpDto);
    const { password } = signUpDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    let user = this.userRepository.create({
      ...signUpDto,
      password: hashedPassword,
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
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async renewToken(token: string): Promise<{ token: string }> {
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
      return { token: newToken };
    } catch (error) {
      throw new BadRequestException('Invalid token');
    }
  }

  private handleErrors(error: any) {
    if (error.code === '23505') {
      let message = error.detail.includes('username') ? 'Username' : 'Email';
      message += ' already used';
      throw new ConflictException(message);
    } else {
      throw error;
    }
  }
}
