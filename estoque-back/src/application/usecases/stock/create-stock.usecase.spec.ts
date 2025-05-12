import { EntityInUseError } from '@application/errors/entity-in-use.error';
import { CreateStockUseCase } from './create-stock.usecase';
import { InMemoryStockRepository } from '@test/repositories/in-memory-stock.repository';
import { InvalidFieldError } from '@application/errors/invalid-field.error';

describe('CreateStockUsecase', () => {
  it('should create a stock correctly', async () => {
    const repository = new InMemoryStockRepository();
    const createStockUseCase = new CreateStockUseCase(repository);

    const stock = await createStockUseCase.execute({
      productId: 1,
      quantity: 23,
    });

    expect(repository.stocks[0]).toBe(stock);
  });

  it('should throw if a stock already has the referred product', async () => {
    const repository = new InMemoryStockRepository();
    const createStockUseCase = new CreateStockUseCase(repository);
    const request = {
      productId: 1,
      quantity: 23,
    };

    await createStockUseCase.execute(request);

    await expect(createStockUseCase.execute(request)).rejects.toThrow(
      EntityInUseError,
    );
  });

  it('should throw if a stock is created with a invalid quantity', async () => {
    const repository = new InMemoryStockRepository();
    const createStockUseCase = new CreateStockUseCase(repository);
    const request = {
      productId: 1,
      quantity: -2,
    };

    await expect(createStockUseCase.execute(request)).rejects.toThrow(
      InvalidFieldError,
    );
  });
});
