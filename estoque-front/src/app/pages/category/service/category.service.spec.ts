import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CategoryService } from './category.service';
import { Category } from '../../../shared/models/category';

describe('CategoryService', () => {
  let categoryService: CategoryService;
  let httpTestingController: HttpTestingController;

  const categorysMock: Category[] = [
    { id: 0, name: 'C1', isActive: true },
    { id: 1, name: 'C2', isActive: true },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    categoryService = TestBed.inject(CategoryService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(categoryService).toBeTruthy();
  });

  it('Teste rota byId', () => {
    const categoryMock = categorysMock[0];
    const id = categoryMock.id;

    categoryService.findById(id).subscribe((category) => {
      expect(category).toEqual(categoryMock);
      expect(category.id).toEqual(id);
    });

    const request = httpTestingController.expectOne(`${categoryService['categoryBaseUrl']}?id=${id}`);

    expect(request.request.method).toBe('GET');
    expect(request.request.urlWithParams).toBe(`${categoryService['categoryBaseUrl']}?id=${id}`);
    request.flush(categoryMock);
  });

  it('Teste rota listar', () => {
    const expectedUrl = `${categoryService['categoryBaseUrl']}`;

    categoryService.list().subscribe((categorys) => {
      expect(categorys).toBe(categorysMock);
    });

    const request = httpTestingController.expectOne(expectedUrl);

    expect(request.request.method).toBe('GET');
    expect(request.request.urlWithParams).toBe(expectedUrl);
    request.flush(categorysMock);
  });

  it('Teste rota editar', () => {
    const categoryMock = categorysMock[0];

    const id = categoryMock.id;
    const expectedUrl = `${categoryService['categoryBaseUrl']}/${id}`;

    categoryService.edit(id, categoryMock).subscribe((category) => {
      expect(category).toBe(categoryMock);
      expect(category.id).toBe(id);
    });

    const request = httpTestingController.expectOne(expectedUrl);

    expect(request.request.method).toBe('PUT');
    expect(request.request.urlWithParams).toBe(expectedUrl);
    request.flush(categoryMock);
  });

  it('Teste rota criar', () => {
    const categoryMock = categorysMock[0];

    const expectedUrl = `${categoryService['categoryBaseUrl']}`;

    categoryService.create(categoryMock).subscribe((category) => {
      expect(category).toBe(categoryMock);
      expect(category.id).toBe(categoryMock.id);
    });

    const request = httpTestingController.expectOne(expectedUrl);

    expect(request.request.method).toBe('POST');
    expect(request.request.urlWithParams).toBe(expectedUrl);
    request.flush(categoryMock);
  });

  it('Teste rota deletar', () => {
    const id = 0;
    const expectedUrl = `${categoryService['categoryBaseUrl']}/${id}`;

    categoryService.delete(id).subscribe((category) => {
      expect(category).toBeNull();
    });

    const request = httpTestingController.expectOne(expectedUrl);

    expect(request.request.method).toBe('DELETE');
    expect(request.request.urlWithParams).toBe(expectedUrl);
  });
});
