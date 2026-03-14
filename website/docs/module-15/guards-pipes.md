---
sidebar_position: 4
title: Guards & Pipes
---

# Guards & Pipes

Guards and Pipes are NestJS middleware-like mechanisms that handle authorization and data transformation/validation respectively.

## Guards

Guards determine whether a request should proceed. They run after middleware but before pipes and route handlers.

### JWT Auth Guard

```ts
// src/auth/guards/jwt-auth.guard.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);

    if (!token) throw new UnauthorizedException('No token provided');

    try {
      const payload = this.jwt.verify(token);
      request['user'] = payload; // attach to request for controllers
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractToken(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
```

### Roles Guard

```ts
// src/auth/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!requiredRoles) return true; // no roles required

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user.role);
  }
}
```

### Custom Decorators

```ts
// src/auth/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

// src/auth/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.user?.[data] : request.user;
  }
);
```

Using them together:

```ts
@Patch(':id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
update(
  @Param('id') id: string,
  @Body() dto: UpdatePostDto,
  @CurrentUser('id') userId: string,  // extracts user.id from request
) {
  return this.postsService.update(id, dto);
}
```

## Pipes

Pipes transform or validate data before it reaches the route handler.

### Built-in Pipes

```ts
import {
  ParseIntPipe,
  ParseUUIDPipe,
  ParseBoolPipe,
  DefaultValuePipe,
} from '@nestjs/common';

@Get(':id')
findOne(@Param('id', ParseUUIDPipe) id: string) {
  // id is guaranteed to be a valid UUID
}

@Get()
findAll(
  @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  @Query('active', new DefaultValuePipe(true), ParseBoolPipe) active: boolean,
) {}
```

### Validation Pipe

The most important pipe. Validates and transforms DTOs using `class-validator`:

```ts
// main.ts — apply globally
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,      // strip unknown properties
    forbidNonWhitelisted: true, // throw on unknown properties
    transform: true,      // auto-transform query strings to correct types
    transformOptions: {
      enableImplicitConversion: true,
    },
  })
);
```

```ts
// DTOs with class-validator decorators
import {
  IsString, IsEmail, MinLength, MaxLength,
  IsOptional, IsEnum, IsInt, Min, Max,
  IsArray, ArrayMaxSize, ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsEnum(['user', 'author', 'admin'])
  @IsOptional()
  role?: string;
}

export class PaginationDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number) // transform string query param to number
  page?: number = 1;

  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;
}
```

### Custom Pipe

```ts
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParsePositiveIntPipe implements PipeTransform<string, number> {
  transform(value: string): number {
    const val = parseInt(value, 10);
    if (isNaN(val) || val <= 0) {
      throw new BadRequestException(`${value} must be a positive integer`);
    }
    return val;
  }
}

// Usage
@Get(':page')
getPage(@Param('page', ParsePositiveIntPipe) page: number) {}
```

## Interceptors

Interceptors wrap route handlers for cross-cutting concerns:

```ts
// src/common/interceptors/transform.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, { data: T }> {
  intercept(_ctx: ExecutionContext, next: CallHandler): Observable<{ data: T }> {
    return next.handle().pipe(map(data => ({ data })));
  }
}

// Apply globally in main.ts
app.useGlobalInterceptors(new TransformInterceptor());
// Now all responses are wrapped: { "data": { ... } }
```

## Exception Filters

Catch and format errors consistently:

```ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    });
  }
}
```
