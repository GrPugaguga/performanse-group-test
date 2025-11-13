import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../users/entities/User';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User | undefined => {
    const request = ctx.switchToHttp().getRequest();
    if (request.user) {
      return request.user instanceof User
        ? request.user
        : new User(request.user);
    }
    return undefined;
  },
);
