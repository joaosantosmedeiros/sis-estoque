import { InMemoryAccountRepository } from '@test/repositories/in-memory-account.repository';
import { CreateAccountUseCase } from './create-account-usecase';
import { FindAccountByNameUseCase } from './find-account-by-name-usecase';
import { EntityInUseError } from '@application/errors/entity-in-use.error';

describe('Create Account Use Case', () => {
  it('should be able to create a new account', async () => {
    const accountsRepository = new InMemoryAccountRepository();
    const createAccountUseCase = new CreateAccountUseCase(
      accountsRepository,
      new FindAccountByNameUseCase(accountsRepository),
    );

    const account = await createAccountUseCase.execute({
      password: 'any_password',
      name: 'any_name',
    });

    expect(account).toBeTruthy();
  });

  it('should not be able to create an account with an used email', async () => {
    const accountsRepository = new InMemoryAccountRepository();
    const createAccountUseCase = new CreateAccountUseCase(
      accountsRepository,
      new FindAccountByNameUseCase(accountsRepository),
    );
    await createAccountUseCase.execute({
      password: 'any_password',
      name: 'any_name',
    });

    void expect(async () => {
      await createAccountUseCase.execute({
        password: 'any_password',
        name: 'any_name',
      });
    }).rejects.toThrow(EntityInUseError);
  });
});
