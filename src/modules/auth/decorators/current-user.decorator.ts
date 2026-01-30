import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserResponseEntity } from '../entities/user.reponse.entity';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserResponseEntity => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = ctx.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return request.user as UserResponseEntity;
  },
);
