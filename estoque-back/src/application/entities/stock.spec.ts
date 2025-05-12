import { makeProduct } from '@test/factories/product.factory';
import { Stock } from './stock';

describe('Stock', () => {
  it('should be able to create a new stock', () => {
    const stock = new Stock({
      productId: 0,
      quantity: 25,
    });
    expect(stock).toBeTruthy();
  });

  it('should create a new stock with correct values', () => {
    const productId = 0;
    const quantity = 25;
    const id = 2;

    const stock = new Stock(
      {
        productId,
        quantity,
      },
      id,
    );

    expect(stock.id).toBe(id);
    expect(stock.productId).toBe(productId);
    expect(stock.quantity).toBe(quantity);
  });

  it('should update stock with correct values', () => {
    const stock = new Stock({
      productId: 0,
      quantity: 25.5,
    });

    const anotherProduct = makeProduct();
    anotherProduct.id = 23;

    stock.id = 1;
    stock.quantity = 2;
    stock.product = anotherProduct;
    stock.productId = anotherProduct.id!;

    expect(stock.quantity).toBe(2);
    expect(stock.product).toBe(anotherProduct);
    expect(stock.productId).toBe(anotherProduct.id);
    expect(stock.id).toBe(1);
  });
});
