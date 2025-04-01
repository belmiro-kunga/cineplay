import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { user } = context.switchToHttp().getRequest();
    
    if (!user || !user.isAdmin) {
      throw new ForbiddenException('Acesso negado. Você não é um administrador.');
    }
    
    return true;
  }
} 