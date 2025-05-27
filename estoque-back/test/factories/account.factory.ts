import { Account } from '@application/entities/account';

export function makeAccount({
  name = 'any_name',
  password = 'any_password',
  isActive = true,
  userType = 1,
  id,
}: {
  name?: string;
  password?: string;
  isActive?: boolean;
  userType?: number;
  id?: number;
}) {
  return new Account(
    {
      name,
      password,
      isActive,
      userType,
    },
    id,
  );
}
