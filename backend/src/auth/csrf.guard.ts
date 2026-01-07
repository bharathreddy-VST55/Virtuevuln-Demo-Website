import {
  Injectable,
  CanActivate,
  UnauthorizedException,
  ExecutionContext,
  Logger
} from '@nestjs/common';
import { createHash } from 'crypto';
import { FastifyRequest } from 'fastify';
import { FormMode, LoginRequest } from './api/login.request';

@Injectable()
export class CsrfGuard implements CanActivate {
  private static readonly CSRF_COOKIE_HEADER = '_csrf';
  private readonly logger = new Logger(CsrfGuard.name);

  async canActivate(context: ExecutionContext) {
    this.logger.debug('Called canActivate');

    const request: FastifyRequest = context.switchToHttp().getRequest();

    try {
      const body: LoginRequest = request.body as LoginRequest;
      
      // If body is null or undefined, allow it through (will be handled by validation)
      if (!body) {
        return true;
      }
      
      const mode = body?.op;
      
      // Only validate CSRF for CSRF-based modes
      if (mode === FormMode.CSRF || mode === FormMode.DOM_BASED_CSRF) {
        const csrfCookie = request.cookies?.[CsrfGuard.CSRF_COOKIE_HEADER];

        if (!csrfCookie || !body.csrf) {
          this.logger.debug('Missing CSRF cookie or token');
          this.throwError();
        }

        try {
          if (decodeURIComponent(csrfCookie) !== body.csrf) {
            this.logger.debug('CSRF token mismatch');
            this.throwError();
          }
        } catch (decodeError) {
          this.logger.debug(`Failed to decode CSRF cookie: ${decodeError.message}`);
          this.throwError();
        }

        if (mode === FormMode.DOM_BASED_CSRF) {
          if (!body.fingerprint) {
            this.logger.debug('Missing fingerprint for DOM-based CSRF');
            this.throwError();
          }
          const fpHash = createHash('md5')
            .update(body.fingerprint)
            .digest('hex');
          if (body.csrf !== fpHash) {
            this.logger.debug('Fingerprint hash mismatch');
            this.throwError();
          }
        }
      }

      // For non-CSRF modes (BASIC, HTML, OIDC), allow through
      return true;
    } catch (err) {
      // Only catch CSRF validation errors, let other errors propagate
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      this.logger.debug(`Unexpected error in CSRF guard: ${err.message}`);
      // For unexpected errors, log but allow through (will be handled by other guards/validation)
      return true;
    }
  }

  private throwError() {
    throw new UnauthorizedException({
      error: 'Invalid credentials',
      location: __filename
    });
  }
}
