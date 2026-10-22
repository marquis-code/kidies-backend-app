import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

/**
 * Must be used together with JwtGuard. Checks that the authenticated
 * user carries the admin role in the JWT payload.
 */
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      throw new UnauthorizedException('Authentication is required');
    }
    if (user.role !== 'admin') {
      throw new ForbiddenException('Administrator access required');
    }
    return true;
  }
}
