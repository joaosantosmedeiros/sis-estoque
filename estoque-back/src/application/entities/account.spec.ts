import { Account } from './account';

describe('Account', () => {
  it('should be able to create a new account', () => {
    const account = new Account({
      name: 'any_name',
      password: 'any_password',
    });

    expect(account).toBeTruthy();
  });

  it('should throw an error if an account is created with a short username', async () => {
    expect(() => {
      new Account({
        name: 'any',
        password: 'any_password',
      });
    }).toThrow();
  });

  it('should throw an error if an account is created with a short password', async () => {
    expect(() => {
      new Account({
        name: 'any_name',
        password: 'pass',
      });
    }).toThrow();
  });

  it('should throw an error if an account is created with a invalid usertype', async () => {
    expect(() => {
      new Account({
        name: 'any_name',
        password: 'any_password',
        userType: 2,
      });
    }).toThrow();
  });
});
