import { makeAccount } from '@test/factories/account.factory';
import { InMemoryAccountRepository } from '@test/repositories/in-memory-account.repository';
import { DeleteAccountUseCase } from './delete-account-usecase';

describe('DeleteAccountUseCase', () => {
  it('should delete an account correctly', async () => {
    const inMemoryAccountRepository = new InMemoryAccountRepository();
    const deleteAccountUseCase = new DeleteAccountUseCase(
      inMemoryAccountRepository,
    );
    const account = makeAccount({ id: 1 });

    await inMemoryAccountRepository.create(account);
    await deleteAccountUseCase.execute(account.id!);

    expect(inMemoryAccountRepository.accounts.length).toBe(0);
  });

  it('should not delete an account if an invalid id is passed', async () => {
    const inMemoryAccountRepository = new InMemoryAccountRepository();
    const deleteAccountUseCase = new DeleteAccountUseCase(
      inMemoryAccountRepository,
    );

    void expect(
      async () => await deleteAccountUseCase.execute(-1),
    ).rejects.toThrow();
  });
});
