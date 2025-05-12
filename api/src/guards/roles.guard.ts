// src/auth/guards/roles.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/decorators/roles.decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

   
    if (!requiredRoles) return true;

  
    const request = context.switchToHttp().getRequest();
    
 
    if (!request.user) {
      throw new UnauthorizedException(
        'Accès refusé : utilisateur non authentifié', 
        'MISSING_AUTHENTICATION'
      );
    }

    // 4. Vérification des rôles avec gestion d'erreur
    try {
      return requiredRoles.some(role => request.user.role === role);
    } catch (error) {
      throw new UnauthorizedException(
        'Erreur de vérification des rôles',
        'ROLE_VALIDATION_FAILED'
      );
    }
  }
}