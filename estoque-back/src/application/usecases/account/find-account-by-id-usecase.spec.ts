import { makeAccount } from '@test/factories/account.factory';
import { InMemoryAccountRepository } from '@test/repositories/in-memory-account.repository';
import { FindAccountByIdUseCase } from './find-account-by-id-usecase';
import { EntityNotFoundError } from '@application/errors/entity-not-found.error';

describe('FindAccountByIdUseCase', () => {
  it('should find an account correctly', async () => {
    const accountRepository = new InMemoryAccountRepository();
    const findAccountById = new FindAccountByIdUseCase(accountRepository);

    const account = makeAccount({ id: 1 });
    await accountRepository.create(account);

    const foundAccount = findAccountById.execute(account.id!);

    expect(foundAccount).toBeTruthy();
  });

  it('should throw if no account is found', async () => {
    const accountRepository = new InMemoryAccountRepository();
    const findAccountById = new FindAccountByIdUseCase(accountRepository);

    await expect(findAccountById.execute(-1)).rejects.toThrow(
      EntityNotFoundError,
    );
  });
});
