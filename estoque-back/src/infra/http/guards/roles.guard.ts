/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserType } from 'src/enums/user-type.enum';
import { ROLES_KEY } from '../decoretors/roles.decorator';
import { JwtService } from '@nestjs/jwt';
import { LoginPayload } from '../../dto/return-login-payload.dto';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserType[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }
    const { authorization } = context.switchToHttp().getRequest().headers;
    if (!authorization) return false;

    const loginPayload: LoginPayload | undefined = await this.jwtService
      .verifyAsync(authorization.split(' ')[1], {
        secret: process.env.JWT_SECRET,
      })
      .catch((err: any) => console.log(err));

    if (!loginPayload) {
      return false;
    }

    return requiredRoles.some(
      (role: UserType) => role === loginPayload.userType,
    );
  }
}
