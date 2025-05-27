import {
  UpdateAccountRequest,
  UpdateAccountUseCase,
} from './update-account-usecase';
import { FindAccountByNameUseCase } from './find-account-by-name-usecase';
import { InMemoryAccountRepository } from '@test/repositories/in-memory-account.repository';
import { makeAccount } from '@test/factories/account.factory';
import { EntityInUseError } from '@application/errors/entity-in-use.error';

const makeSut = () => {
  const accountRepository = new InMemoryAccountRepository();
  const updateAccount = new UpdateAccountUseCase(
    accountRepository,
    new FindAccountByNameUseCase(accountRepository),
  );

  return { updateAccount, accountRepository };
};

describe('UpdateAccountUseCase', () => {
  it('should update an account correctly', async () => {
    const { accountRepository, updateAccount } = makeSut();
    const id = 1;
    await accountRepository.create(makeAccount({ id }));

    const request: UpdateAccountRequest = {
      id,
      name: 'updated_name',
      password: 'updated_password',
    };

    const account = await updateAccount.execute(request);

    expect(account.name).toBe('updated_name');
    expect(account.password).toBe('updated_password');
  });

  it('should throw an erorr if an used name is passed', async () => {
    const { accountRepository, updateAccount } = makeSut();
    const name = 'invalid_name';
    const id = 2;
    await accountRepository.create(makeAccount({ name }));
    await accountRepository.create(makeAccount({ name: 'another_name', id }));

    void expect(
      async () =>
        await updateAccount.execute({
          id,
          name,
        }),
    ).rejects.toThrow(EntityInUseError);
  });
});
