import { EntityAlreadyExistsError } from '@application/errors/entity-already-exists.error';
import { EntityInUseError } from '@application/errors/entity-in-use.error';
import { EntityNotFoundError } from '@application/errors/entity-not-found.error';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof EntityNotFoundError) {
          throw new NotFoundException(error.message);
        } else if (
          error instanceof EntityAlreadyExistsError ||
          error instanceof EntityInUseError
        ) {
          throw new ConflictException(error.message);
        } else {
          throw new BadRequestException(
            error.response?.message ?? error.message,
          );
        }
      }),
    );
  }
}
