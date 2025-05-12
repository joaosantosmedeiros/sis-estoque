export class InvalidFieldError extends Error {
  constructor(fields: string[]) {
    super(`Campos '${fields.join(', ')}' inválidos.`);
  }
}
