import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req?.cookies?.session_token || ExtractJwt.fromAuthHeaderAsBearerToken()(req),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'hostpanel-dev-secret-change-in-production',
    });
  }

  async validate(payload: { sub: string; email: string; type: string }) {
    if (payload.type !== 'access') {
      throw new UnauthorizedException();
    }
    return { id: payload.sub, email: payload.email };
  }
}