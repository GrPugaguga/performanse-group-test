import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Этот гард использует LocalStrategy (по имени 'local', которое является именем по умолчанию для passport-local).
 * Он будет использоваться на эндпоинте входа в систему.
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
