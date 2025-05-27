import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '@infra/database/databale.module';
import { AuthService } from './auth.service';
import { FindAccountByNameUseCase } from '@application/usecases/account/find-account-by-name-usecase';
import { AuthController } from './auth.controller';

@Module({
  providers: [AuthService, FindAccountByNameUseCase],
  controllers: [AuthController],
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
  ],
})
export class AuthModule {}
