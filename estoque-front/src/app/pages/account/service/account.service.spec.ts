import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AccountService } from './account.service';
import { Account } from '../../../shared/models/account';
import { AccountRequest } from '../../../shared/models/account.request';

describe('AccountService', () => {
  let accountService: AccountService;
  let httpTestingController: HttpTestingController;

  const accountsMock: Account[] = [
    { id: 0, name: 'mock1', isActive: true, userType: 0 },
    { id: 0, name: 'mock1', isActive: true, userType: 0 },
  ];

  const accountRequestMock: AccountRequest = {
    name: 'any_name',
    password: '123456789',
    confirmPassword: '123456789',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    accountService = TestBed.inject(AccountService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(accountService).toBeTruthy();
  });

  it('Teste rota byId', () => {
    const accountMock = accountsMock[0];
    const id = accountMock.id;

    accountService.findLoggedAccount().subscribe((account) => {
      expect(account).toEqual(accountMock);
      expect(account.id).toEqual(id);
    });

    const request = httpTestingController.expectOne(`${accountService['baseUrl']}`);

    expect(request.request.method).toBe('GET');
    expect(request.request.urlWithParams).toBe(`${accountService['baseUrl']}`);
    request.flush(accountMock);
  });

  it('Teste rota listar', () => {
    const expectedUrl = `${accountService['baseUrl']}/all`;

    accountService.list().subscribe((accounts) => {
      expect(accounts).toBe(accountsMock);
    });

    const request = httpTestingController.expectOne(expectedUrl);

    expect(request.request.method).toBe('GET');
    expect(request.request.urlWithParams).toBe(expectedUrl);
    request.flush(accountsMock);
  });

  it('Teste rota editar', () => {
    const accountMock = accountsMock[0];

    const id = accountMock.id;
    const expectedUrl = `${accountService['baseUrl']}`;

    accountService.edit(accountRequestMock).subscribe((account) => {
      expect(account).toBe(accountMock);
      expect(account.id).toBe(id);
    });

    const request = httpTestingController.expectOne(expectedUrl);

    expect(request.request.method).toBe('PUT');
    expect(request.request.urlWithParams).toBe(expectedUrl);
    request.flush(accountMock);
  });

  it('Teste rota criar', () => {
    const accountMock = accountsMock[0];

    const expectedUrl = `${accountService['baseUrl']}`;

    accountService.create(accountMock).subscribe((account) => {
      expect(account).toBe(accountMock);
      expect(account.id).toBe(accountMock.id);
    });

    const request = httpTestingController.expectOne(expectedUrl);

    expect(request.request.method).toBe('POST');
    expect(request.request.urlWithParams).toBe(expectedUrl);
    request.flush(accountMock);
  });

  it('Teste rota deletar', () => {
    const id = 0;
    const expectedUrl = `${accountService['baseUrl']}/${id}`;

    accountService.delete(id).subscribe((account) => {
      expect(account).toBeNull();
    });

    const request = httpTestingController.expectOne(expectedUrl);

    expect(request.request.method).toBe('DELETE');
    expect(request.request.urlWithParams).toBe(expectedUrl);
  });
});
