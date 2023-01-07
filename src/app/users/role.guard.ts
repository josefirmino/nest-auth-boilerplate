import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Type,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from './entities/role.enum';
import { RequestWithUser } from './interfaces/requestWithUser.interface';

export const RoleGuard = (role: Role): Type<CanActivate> => {
  class RoleGuardMixin extends AuthGuard('jwt') {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const user = request.user;

      if (!user?.roles?.includes(role)) {
        throw new ForbiddenException({
          statusCode: 403,
          message: 'Only administrators can access this route',
          error: 'Forbidden',
        });
      }

      return true;
    }
  }

  return RoleGuardMixin;
};
