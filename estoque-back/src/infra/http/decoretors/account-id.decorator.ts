import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { authorizationToBaseLoginPayload } from '../utils/base64-converter';

export const AccountId = createParamDecorator((_, ctx: ExecutionContext) => {
  const { authorization } = ctx.switchToHttp().getRequest().headers;

  const loginPayload = authorizationToBaseLoginPayload(authorization);

  return loginPayload?.id;
});
