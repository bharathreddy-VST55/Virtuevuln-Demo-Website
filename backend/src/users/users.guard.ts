import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UsersService } from './users.service';
import { FastifyRequest } from 'fastify';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly users: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: FastifyRequest = context.switchToHttp().getRequest();
    
    // Try to get email from params first (for routes like /one/:email/adminpermission)
    let email = request.params['email'] as string;
    
    // If not in params, extract from JWT token
    if (!email) {
      const authHeader = request.headers.authorization;
      if (authHeader) {
        try {
          const token = authHeader.split('.')[1];
          const payload = JSON.parse(Buffer.from(token, 'base64').toString());
          email = payload.user;
        } catch (err) {
          return false;
        }
      }
    }
    
    if (!email) {
      return false;
    }
    
    const permissions = await this.users.getPermissions(email);
    // Check if user is super_admin or has isAdmin flag
    return permissions.isAdmin || permissions.role === 'super_admin';
  }
}
