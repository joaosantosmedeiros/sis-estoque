import { InMemoryAccountRepository } from '@test/repositories/in-memory-account.repository';
import { FindAccountByNameUseCase } from './find-account-by-name-usecase';
import { EntityNotFoundError } from '@application/errors/entity-not-found.error';
import { makeAccount } from '@test/factories/account.factory';

describe('FindAccountByEmailUseCase', () => {
  it('should find an account correctly', async () => {
    const inMemoryAccountRepository = new InMemoryAccountRepository();
    const findAccountByNameUseCase = new FindAccountByNameUseCase(
      inMemoryAccountRepository,
    );

    const name = 'any_name';
    await inMemoryAccountRepository.create(makeAccount({ name }));

    const account = findAccountByNameUseCase.execute(name);

    expect(account).toBeTruthy();
  });

  it('should throw if no account is found', async () => {
    const inMemoryAccountRepository = new InMemoryAccountRepository();
    const findAccountByNameUseCase = new FindAccountByNameUseCase(
      inMemoryAccountRepository,
    );

    const name = 'any_name';

    void expect(async () => {
      await findAccountByNameUseCase.execute(name);
    }).rejects.toThrow(EntityNotFoundError);
  });
});
