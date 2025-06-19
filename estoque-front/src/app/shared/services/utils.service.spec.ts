import { TestBed } from '@angular/core/testing';
import { UtilsService } from './utils.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';

describe('UtilsService', () => {
  let service: UtilsService;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let dialogRefSpyObj: jasmine.SpyObj<MatDialogRef<any>>;

  beforeEach(() => {
    dialogRefSpyObj = jasmine.createSpyObj({
      afterClosed: of('result'),
      close: null,
    });

    dialogSpy = jasmine.createSpyObj('MatDialog', {
      open: dialogRefSpyObj,
    });

    TestBed.configureTestingModule({
      providers: [UtilsService, { provide: MatDialog, useValue: dialogSpy }],
    });

    service = TestBed.inject(UtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('onError should open dialog with ErrorDialogComponent and data', () => {
    const message = 'Error message';
    service.onError(message);
    expect(dialogSpy.open).toHaveBeenCalledWith(jasmine.any(Function), { data: message });
  });

  it('openDialog should open dialog with passed component and data, and resolve after close', async () => {
    const component = class DummyComponent {};
    const data = { foo: 'bar' };
    const promise = service.openDialog({ component, data });
    expect(dialogSpy.open).toHaveBeenCalledWith(component, {
      data,
      minWidth: undefined,
      minHeight: undefined,
      maxWidth: undefined,
      maxHeight: undefined,
    });
    await expectAsync(promise).toBeResolvedTo('result');
  });

  it('deleteDialog should open MessageDialogConfirmComponent and resolve after close', async () => {
    const promise = service.deleteDialog();
    expect(dialogSpy.open).toHaveBeenCalledWith(jasmine.any(Function), {
      data: 'O conteúdo apagado não pode ser recuperado, Deseja excluir?',
      minWidth: '17%',
      minHeight: 'auto',
      disableClose: true,
    });
    await expectAsync(promise).toBeResolvedTo('result');
  });

  it('convertToReal should format number to BRL currency string', () => {
    const result = service.convertToReal(1234.56);
    expect(result).toBe('R$ 1.234,56');
  });
});
