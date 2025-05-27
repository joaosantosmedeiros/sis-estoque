import { InMemoryAccountRepository } from '@test/repositories/in-memory-account.repository';
import { ListAccountsUseCase } from './list-accounts-usecase';
import { makeAccount } from '@test/factories/account.factory';

describe('List Accounts Usecase', () => {
  it('should list all accounts properly', async () => {
    const inMemoryAccountRepository = new InMemoryAccountRepository();
    const listAllAccounts = new ListAccountsUseCase(inMemoryAccountRepository);

    await inMemoryAccountRepository.create(makeAccount({}));
    await inMemoryAccountRepository.create(
      makeAccount({ name: 'another_name' }),
    );
    await inMemoryAccountRepository.create(
      makeAccount({ name: 'another_name_2' }),
    );

    const accounts = await listAllAccounts.execute();

    expect(accounts.length).toBe(3);
  });
});
