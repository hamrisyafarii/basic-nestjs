import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response as ExpressResponse } from 'express';
import { ApiResponse } from '../interfaces/response.interface';

export interface Response<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  ApiResponse<T>,
  Response<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<ApiResponse<T>>,
  ): Observable<Response<T>> {
    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse<ExpressResponse>();

    return next.handle().pipe(
      map((result: ApiResponse<T>) => {
        const statusCode = response.statusCode;
        const message = result?.message ?? 'Success';
        const data = result?.data !== undefined ? result.data : (result as T);

        return {
          statusCode,
          message,
          data,
        };
      }),
    );
  }
}
