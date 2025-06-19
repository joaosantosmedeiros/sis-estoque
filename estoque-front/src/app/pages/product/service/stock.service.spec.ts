import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { StockService } from './stock.service';
import { Stock } from '../../../shared/models/stock';
import { Category } from '../../../shared/models/category';
import { Product } from '../../../shared/models/product';

describe('StockService', () => {
  let stockService: StockService;
  let httpTestingController: HttpTestingController;

  const category: Category = { id: 0, name: 'C1', isActive: true };
  const product: Product = { id: 0, name: 'p1', category, price: 11, isActive: true };
  const product2: Product = { id: 1, name: 'p2', category, price: 12, isActive: true };

  const stocksMock: Stock[] = [
    { id: 0, product, quantity: 2 },
    { id: 1, product: product2, quantity: 3 },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    stockService = TestBed.inject(StockService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(stockService).toBeTruthy();
  });

  it('Teste rota byId', () => {
    const stockMock = stocksMock[0];
    const id = stockMock.id;

    stockService.findById(id).subscribe((stock) => {
      expect(stock).toEqual(stockMock);
      expect(stock.id).toEqual(id);
    });

    const request = httpTestingController.expectOne(`${stockService['stockBaseUrl']}?id=${id}`);

    expect(request.request.method).toBe('GET');
    expect(request.request.urlWithParams).toBe(`${stockService['stockBaseUrl']}?id=${id}`);
    request.flush(stockMock);
  });

  it('Teste rota listar', () => {
    const expectedUrl = `${stockService['stockBaseUrl']}`;

    stockService.list().subscribe((stocks) => {
      expect(stocks).toBe(stocksMock);
    });

    const request = httpTestingController.expectOne(expectedUrl);

    expect(request.request.method).toBe('GET');
    expect(request.request.urlWithParams).toBe(expectedUrl);
    request.flush(stocksMock);
  });

  it('Teste rota byProduct', () => {
    const productId = product.id;
    const expectedUrl = `${stockService['stockBaseUrl']}/byProduct/${productId}`;

    stockService.findByProduct(productId).subscribe((stock) => {
      expect(stock).toEqual(stocksMock[0]);
    });

    const request = httpTestingController.expectOne(expectedUrl);

    expect(request.request.method).toBe('GET');
    expect(request.request.urlWithParams).toEqual(expectedUrl);
  });

  it('Teste rota editar', () => {
    const stockMock = stocksMock[0];

    const id = stockMock.id;
    const expectedUrl = `${stockService['stockBaseUrl']}/${id}`;

    stockService.edit(id, stockMock).subscribe((stock) => {
      expect(stock).toBe(stockMock);
      expect(stock.id).toBe(id);
    });

    const request = httpTestingController.expectOne(expectedUrl);

    expect(request.request.method).toBe('PUT');
    expect(request.request.urlWithParams).toBe(expectedUrl);
    request.flush(stockMock);
  });

  it('Teste rota criar', () => {
    const stockMock = stocksMock[0];

    const expectedUrl = `${stockService['stockBaseUrl']}`;

    stockService.create(stockMock).subscribe((stock) => {
      expect(stock).toBe(stockMock);
      expect(stock.id).toBe(stockMock.id);
    });

    const request = httpTestingController.expectOne(expectedUrl);

    expect(request.request.method).toBe('POST');
    expect(request.request.urlWithParams).toBe(expectedUrl);
    request.flush(stockMock);
  });

  it('Teste rota deletar', () => {
    const id = 0;
    const expectedUrl = `${stockService['stockBaseUrl']}/${id}`;

    stockService.delete(id).subscribe((stock) => {
      expect(stock).toBeNull();
    });

    const request = httpTestingController.expectOne(expectedUrl);

    expect(request.request.method).toBe('DELETE');
    expect(request.request.urlWithParams).toBe(expectedUrl);
  });
});
