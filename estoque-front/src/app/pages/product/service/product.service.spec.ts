import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from '../../../shared/models/product';
import { Category } from '../../../shared/models/category';

describe('ProductService', () => {
  let productService: ProductService;
  let httpTestingController: HttpTestingController;

  const category: Category = { id: 0, name: 'C1', isActive: true };

  const productsMock: Product[] = [
    { id: 0, name: 'p1', category, price: 11, isActive: true },
    { id: 1, name: 'p1', category, price: 12, isActive: true },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    productService = TestBed.inject(ProductService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(productService).toBeTruthy();
  });

  it('Teste rota byId', () => {
    const productMock = productsMock[0];
    const id = productMock.id;

    productService.findById(id).subscribe((product) => {
      expect(product).toEqual(productMock);
      expect(product.id).toEqual(id);
    });

    const request = httpTestingController.expectOne(`${productService['productBaseUrl']}?id=${id}`);

    expect(request.request.method).toBe('GET');
    expect(request.request.urlWithParams).toBe(`${productService['productBaseUrl']}?id=${id}`);
    request.flush(productMock);
  });

  it('Teste rota listar', () => {
    const expectedUrl = `${productService['productBaseUrl']}`;

    productService.list().subscribe((products) => {
      expect(products).toBe(productsMock);
    });

    const request = httpTestingController.expectOne(expectedUrl);

    expect(request.request.method).toBe('GET');
    expect(request.request.urlWithParams).toBe(expectedUrl);
    request.flush(productsMock);
  });

  it('Teste rota byCategory', () => {
    const categoryId = category.id;
    const expectedUrl = `${productService['productBaseUrl']}/byCategory/${categoryId}`;

    productService.findByCategory(categoryId).subscribe((products) => {
      expect(products).toBe(productsMock);
    });

    const request = httpTestingController.expectOne(expectedUrl);

    expect(request.request.method).toBe('GET');
    expect(request.request.urlWithParams).toBe(expectedUrl);
    request.flush(productsMock);
  });

  it('Teste rota editar', () => {
    const productMock = productsMock[0];

    const id = productMock.id;
    const expectedUrl = `${productService['productBaseUrl']}/${id}`;

    productService.edit(id, productMock).subscribe((product) => {
      expect(product).toBe(productMock);
      expect(product.id).toBe(id);
    });

    const request = httpTestingController.expectOne(expectedUrl);

    expect(request.request.method).toBe('PUT');
    expect(request.request.urlWithParams).toBe(expectedUrl);
    request.flush(productMock);
  });

  it('Teste rota criar', () => {
    const productMock = productsMock[0];

    const expectedUrl = `${productService['productBaseUrl']}`;

    productService.create(productMock).subscribe((product) => {
      expect(product).toBe(productMock);
      expect(product.id).toBe(productMock.id);
    });

    const request = httpTestingController.expectOne(expectedUrl);

    expect(request.request.method).toBe('POST');
    expect(request.request.urlWithParams).toBe(expectedUrl);
    request.flush(productMock);
  });

  it('Teste rota deletar', () => {
    const id = 0;
    const expectedUrl = `${productService['productBaseUrl']}/${id}`;

    productService.delete(id).subscribe((product) => {
      expect(product).toBeNull();
    });

    const request = httpTestingController.expectOne(expectedUrl);

    expect(request.request.method).toBe('DELETE');
    expect(request.request.urlWithParams).toBe(expectedUrl);
  });
});
