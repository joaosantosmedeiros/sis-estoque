import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogComponent } from './log.component';
import { LogService } from './service/log.service';
import { StockService } from '../product/service/stock.service';
import { UtilsService } from '../../shared/services/utils.service';
import { of, throwError } from 'rxjs';
import { Log } from '../../shared/models/log';
import { Stock } from '../../shared/models/stock';

describe('LogComponent', () => {
  let component: LogComponent;
  let fixture: ComponentFixture<LogComponent>;

  let logServiceSpy: jasmine.SpyObj<LogService>;
  let stockServiceSpy: jasmine.SpyObj<StockService>;
  let utilsServiceSpy: jasmine.SpyObj<UtilsService>;

  const category = { id: 1, name: '', isActive: true };
  const mockLogs: Log[] = [
    {
      id: 1,
      quantity: 5,
      account: { id: 1, name: 'Admin', userType: 0, isActive: true },
      stock: {
        id: 1,
        quantity: 100,
        product: { id: 1, name: 'Mouse', category, isActive: true, price: 12 },
      },
      date: new Date(),
    },
  ];

  const mockStocks: Stock[] = [
    {
      id: 1,
      quantity: 100,
      product: { id: 1, name: 'Mouse', category, isActive: true, price: 12 },
    },
    {
      id: 2,
      quantity: 50,
      product: { id: 2, name: 'Teclado', category, isActive: true, price: 12 },
    },
  ];

  beforeEach(() => {
    logServiceSpy = jasmine.createSpyObj('LogService', ['list', 'findByStock']);
    stockServiceSpy = jasmine.createSpyObj('StockService', ['list']);
    utilsServiceSpy = jasmine.createSpyObj('UtilsService', ['onError', 'openDialog']);

    TestBed.configureTestingModule({
      imports: [LogComponent],
      providers: [
        { provide: LogService, useValue: logServiceSpy },
        { provide: StockService, useValue: stockServiceSpy },
        { provide: UtilsService, useValue: utilsServiceSpy },
      ],
    });

    fixture = TestBed.createComponent(LogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getLogs, getStocks and createForm on ngOnInit', () => {
  const logsSpy = spyOn(component, 'getLogs').and.callThrough();
  const stocksSpy = spyOn(component, 'getStocks').and.callThrough();
  const formSpy = spyOn(component, 'createForm').and.callThrough();

  logServiceSpy.list.and.returnValue(of([]));
  stockServiceSpy.list.and.returnValue(of([]));

  component.ngOnInit();

  expect(logsSpy).toHaveBeenCalled();
  expect(stocksSpy).toHaveBeenCalled();
  expect(formSpy).toHaveBeenCalled();
});


  it('should call getLogs and set logs', () => {
    logServiceSpy.list.and.returnValue(of(mockLogs));
    component.getLogs();
    expect(component.logs.length).toBe(1);
  });

  it('should call getStocks and set stocks and filteredStocks', () => {
    stockServiceSpy.list.and.returnValue(of(mockStocks));
    component.getStocks();
    expect(component.stocks.length).toBe(2);
    expect(component.filteredStocks.length).toBe(2);
  });

  it('should handle error in search', () => {
    component.createForm();
    component.stock.setValue({id: 12,});
    logServiceSpy.findByStock.and.returnValue(throwError(() => ({error: { message: 'Erro ao buscar'}})));

    component.search();
    expect(utilsServiceSpy.onError).toHaveBeenCalledWith('Erro ao buscar');
  });

  it('should handle error in search with default message', () => {
    component.createForm();
    component.stock.setValue({id: 12,});
    logServiceSpy.findByStock.and.returnValue(throwError(() => ({error: { message: null}})));

    component.search();
    expect(utilsServiceSpy.onError).toHaveBeenCalledWith('Erro ao listar logs!');
  });

  it('should handle error in getLogs', () => {
    logServiceSpy.list.and.returnValue(throwError(() => ({ error: { message: 'Erro Logs' } })));
    component.getLogs();
    expect(utilsServiceSpy.onError).toHaveBeenCalledWith('Erro Logs');
  });

  it('should handle error in getLogs with default message', () => {
    logServiceSpy.list.and.returnValue(throwError(() => ({ error: { message: null } })));
    component.getLogs();
    expect(utilsServiceSpy.onError).toHaveBeenCalledWith('Erro ao carregar logs!');
  });

  it('should handle error in getStocks', () => {
    stockServiceSpy.list.and.returnValue(throwError(() => ({ error: { message: 'Erro Stocks' } })));
    component.getStocks();
    expect(utilsServiceSpy.onError).toHaveBeenCalledWith('Erro Stocks');
  });

  it('should handle error in getStocks with default message', () => {
    stockServiceSpy.list.and.returnValue(throwError(() => ({ error: { message: null } })));
    component.getStocks();
    expect(utilsServiceSpy.onError).toHaveBeenCalledWith('Erro ao carregar produtos!');
  });

  it('should create form on createForm()', () => {
    component.createForm();
    expect(component.form).toBeDefined();
    expect(component.form.get('stock')).toBeDefined();
  });

  it('should filter logs by selected stock on search()', () => {
    const selectedStock = { id: 1 };
    component.createForm();
    component.stock.setValue(selectedStock);

    logServiceSpy.findByStock.and.returnValue(of(mockLogs));

    component.search();
    expect(logServiceSpy.findByStock).toHaveBeenCalledWith(1);
    expect(component.logs.length).toBe(1);
  });

  it('should fallback to getLogs on search() with no stock selected', () => {
    component.createForm();
    component.stock.setValue(null);
    logServiceSpy.list.and.returnValue(of(mockLogs));
    component.search();
    expect(logServiceSpy.list).toHaveBeenCalled();
  });

  it('should call getLogs on clearSearch()', () => {
    logServiceSpy.list.and.returnValue(of(mockLogs));
    component.createForm();
    component.clearSearch();
    expect(component.logs.length).toBe(1);
  });

  it('should display product name in displayStock()', () => {
    const result = component.displayStock(mockStocks[0]);
    expect(result).toBe('Mouse');
  });

  it('should return empty string for displayStock(null)', () => {
    const result = component.displayStock(null as any);
    expect(result).toBe('');
  });

  it('should call openDialog in viewDialog()', async () => {
    await component.viewDialog(mockLogs[0]);
    expect(utilsServiceSpy.openDialog).toHaveBeenCalledWith(
      jasmine.objectContaining({
        component: jasmine.any(Function),
        data: { log: mockLogs[0] },
      })
    );
  });

  it('should filter stocks by name with filter()', () => {
    component.stocks = mockStocks;

    component.productInput = {
      nativeElement: { value: 'teclado' } as HTMLInputElement,
    };

    component.filter();
    expect(component.filteredStocks.length).toBe(1);
    expect(component.filteredStocks[0].product.name).toBe('Teclado');
  });
});
