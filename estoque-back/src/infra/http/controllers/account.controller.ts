import { CreateAccountUseCase } from '@application/usecases/account/create-account-usecase';
import { DeleteAccountUseCase } from '@application/usecases/account/delete-account-usecase';
import { FindAccountByIdUseCase } from '@application/usecases/account/find-account-by-id-usecase';
import { FindAccountByNameUseCase } from '@application/usecases/account/find-account-by-name-usecase';
import { ListAccountsUseCase } from '@application/usecases/account/list-accounts-usecase';
import { UpdateAccountUseCase } from '@application/usecases/account/update-account-usecase';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Roles } from '../decoretors/roles.decorator';
import { UserType } from 'src/enums/user-type.enum';
import { ReturnAccountDto } from '@infra/dto/return-account.dto';
import { AccountId } from '../decoretors/account-id.decorator';
import { CreateAccountBody } from '@infra/dto/create-account.dto';
import { UpdateAccountBody } from '@infra/dto/update-account.dto';
import { ValidatePassword } from '../utils/validate-password';

@Controller('account')
export class AccountController {
  constructor(
    private readonly createAccountUseCase: CreateAccountUseCase,
    private readonly listAllAccountsUseCase: ListAccountsUseCase,
    private readonly findAccountByNameUseCase: FindAccountByNameUseCase,
    private readonly findAccountByIdUseCase: FindAccountByIdUseCase,
    private readonly deleteAccountUseCase: DeleteAccountUseCase,
    private readonly updateAccountUseCase: UpdateAccountUseCase,
  ) {}

  @Roles(UserType.Admin)
  @Get('/all')
  async list(): Promise<ReturnAccountDto[]> {
    return (await this.listAllAccountsUseCase.execute()).map(
      (account) => new ReturnAccountDto(account),
    );
  }

  @Roles(UserType.Admin)
  @Get(':name')
  async findByEmail(@Param('name') name: string): Promise<ReturnAccountDto> {
    const account = await this.findAccountByNameUseCase.execute(name);
    return new ReturnAccountDto(account);
  }

  @Roles(UserType.Admin, UserType.User)
  @Get()
  async getAccountInfo(
    @AccountId() accountId: number,
  ): Promise<ReturnAccountDto> {
    return new ReturnAccountDto(
      await this.findAccountByIdUseCase.execute(accountId),
    );
  }

  @Roles(UserType.Admin)
  @Post()
  async create(@Body() body: CreateAccountBody): Promise<ReturnAccountDto> {
    const { name, password, confirmPassword } = body;
    if (password !== confirmPassword) {
      throw new Error('Senhas não coindidem.');
    }

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    const account = await this.createAccountUseCase.execute({
      name,
      password: hashedPassword,
    });

    return new ReturnAccountDto(account);
  }

  @Roles(UserType.Admin, UserType.User)
  @Put()
  async update(
    @AccountId() accountId: number,
    @Body() body: UpdateAccountBody,
  ): Promise<ReturnAccountDto> {
    const account = await this.findAccountByIdUseCase.execute(accountId);

    if (account.id != accountId) {
      throw new HttpException('Restricted', HttpStatus.FORBIDDEN);
    }

    const saltOrRounds = 10;

    ValidatePassword.validate(body.password, body.confirmPassword);

    const updatedAccount = await this.updateAccountUseCase.execute({
      id: account.id,
      name: body.name,
      password: body.password
        ? await bcrypt.hash(body.password, saltOrRounds)
        : undefined,
    });

    return new ReturnAccountDto(updatedAccount);
  }

  @Roles(UserType.Admin)
  @Delete(':id')
  @HttpCode(204)
  async delete(
    @Param('id') id: number,
    @AccountId() accountId: number,
  ): Promise<void> {
    id = Number(id);
    const account = await this.findAccountByIdUseCase.execute(id);

    if (account.id == accountId) {
      throw new Error('Não é possível deletar a si mesmo.');
    }

    await this.deleteAccountUseCase.execute(id);
  }
}
