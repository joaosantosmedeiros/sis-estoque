import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { LogService } from './log.service';
import { Log } from '../../../shared/models/log';

describe('LogService', () => {
  let logService: LogService;
  let httpTestingController: HttpTestingController;

  const account = { id: 0, isActive: true, name: '', userType: 0 };
  const category = { id: 1, isActive: true, name: '' };
  const product = { category, id: 1, isActive: true, name: '', price: 12 };
  const stock = { id: 1, product, quantity: 12 };
  const logsMock: Log[] = [
    { id: 0, account, date: new Date(), quantity: 12, stock },
    { id: 1, account, date: new Date(), quantity: 12, stock },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    logService = TestBed.inject(LogService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(logService).toBeTruthy();
  });

  it('Teste rota byId', () => {
    const logMock = logsMock[0];
    const id = logMock.id;

    logService.findById(id).subscribe((log) => {
      expect(log).toEqual(logMock);
      expect(log.id).toEqual(id);
    });

    const request = httpTestingController.expectOne(`${logService['logBaseUrl']}?id=${id}`);

    expect(request.request.method).toBe('GET');
    expect(request.request.urlWithParams).toBe(`${logService['logBaseUrl']}?id=${id}`);
    request.flush(logMock);
  });

  it('Teste rota byStock', () => {

    logService.findByStock(stock.id).subscribe((logs) => {
      expect(logs).toEqual(logsMock);
    });

    const request = httpTestingController.expectOne(`${logService['logBaseUrl']}/byStock/${stock.id}`);

    expect(request.request.method).toBe('GET');
    expect(request.request.urlWithParams).toBe(`${logService['logBaseUrl']}/byStock/${stock.id}`);
    request.flush(logsMock);
  });

  it('Teste rota listar', () => {
    const expectedUrl = `${logService['logBaseUrl']}`;

    logService.list().subscribe((logs) => {
      expect(logs).toBe(logsMock);
    });

    const request = httpTestingController.expectOne(expectedUrl);

    expect(request.request.method).toBe('GET');
    expect(request.request.urlWithParams).toBe(expectedUrl);
    request.flush(logsMock);
  });
});
