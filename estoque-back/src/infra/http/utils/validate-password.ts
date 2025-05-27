import { InvalidFieldError } from '@application/errors/invalid-field.error';

export class ValidatePassword {
  public static validate(password: string, confirmPassword: string): void {
    const fields: string[] = [];

    if (
      !password ||
      password.length == 0 ||
      !confirmPassword ||
      confirmPassword?.length == 0
    )
      return;

    if (password.length < 8) fields.push('password');
    if (confirmPassword.length < 8) fields.push('confirmPassword');

    if (password !== confirmPassword) throw new InvalidFieldError(fields);

    if (fields.length > 0) throw new InvalidFieldError(fields);
  }
}
