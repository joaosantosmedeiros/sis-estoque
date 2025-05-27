import { FindAccountByNameUseCase } from '@application/usecases/account/find-account-by-name-usecase';
import { LoginDto } from '@infra/dto/login.dto';
import { ReturnAccountDto } from '@infra/dto/return-account.dto';
import { LoginPayload } from '@infra/dto/return-login-payload.dto';
import { ReturnLoginDto } from '@infra/dto/return-login.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly findAccountByNameUseCase: FindAccountByNameUseCase,
    private readonly jwtService: JwtService,
  ) {}
  async login(loginDto: LoginDto): Promise<ReturnLoginDto> {
    const account = await this.findAccountByNameUseCase
      .execute(loginDto.name)
      .catch(() => {
        throw new HttpException(
          'Invalid name or password',
          HttpStatus.FORBIDDEN,
        );
      });

    const passwordMatches = await bcrypt.compare(
      loginDto.password,
      account?.password ? account?.password : '',
    );

    if (!passwordMatches || !account?.isActive) {
      throw new HttpException('Invalid mail or password', HttpStatus.FORBIDDEN);
    }

    return {
      accessToken: this.jwtService.sign({ ...new LoginPayload(account) }),
      account: new ReturnAccountDto(account),
    };
  }
}
