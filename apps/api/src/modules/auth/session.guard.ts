import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class SessionGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    const sessionToken = request.cookies?.session_token;

    // In development with mock, allow the session guard to pass through
    // In production, JWT strategy handles the actual validation via Passport
    if (!authHeader && !sessionToken) {
      // For mock development, extract user from a dev header
      const devUser = request.headers['x-dev-user'];
      if (devUser) {
        try {
          request.user = JSON.parse(devUser as string);
          return true;
        } catch {}
      }
      throw new UnauthorizedException('Authentication required');
    }

    // The JwtAuthGuard from Passport will handle actual JWT validation
    // This guard is for routes that need a session but use the combined approach
    return true;
  }
}