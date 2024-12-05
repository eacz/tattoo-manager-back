import {
  BadRequestException,
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';
import { User } from '../entities/user.entity';

type userProps = keyof Omit<User, 'password'>;

export const getUser = createParamDecorator<userProps | Array<userProps>>(
  (data, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    const user = req.user;
    if (!user) {
      throw new BadRequestException('User not found');
    }

    let dataToReturn = user;
    if (data) {
      switch (typeof data) {
        case 'string':
          const propertyRequired = user[data];
          if (propertyRequired) {
            dataToReturn = propertyRequired;
          } else {
            throw new InternalServerErrorException(
              `Property ${data} doesn't exists on user entity`,
            );
          }
          break;
        case 'object':
          if (data instanceof Array) {
            const userProps = {};
            data.forEach((prop) => {
              if (user[prop]) {
                userProps[prop] = user[prop];
              } else {
                throw new InternalServerErrorException(
                  `Property ${prop} doesn't exists on user entity`,
                );
              }
            });
            dataToReturn = userProps;
          }
          break;
      }
    }
    return dataToReturn;
  },
);
