import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserDocument } from '../../../../apps/auth/src/users/models/users.schema';

function getCurrentUserByContext(context: ExecutionContext): UserDocument {
  // after verifyUser, valid user will be set to request.user
  const request = context.switchToHttp().getRequest();
  return request.user;
}

export const CurrentUser = createParamDecorator(
  (_data, context: ExecutionContext) => {
    return getCurrentUserByContext(context);
  },
);
