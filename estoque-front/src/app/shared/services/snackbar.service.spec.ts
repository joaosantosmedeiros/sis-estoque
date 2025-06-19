import { TestBed } from '@angular/core/testing';
import { SnackbarService } from './snackbar.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarSuccessComponent } from '../components/snackbar-success/snackbar-success.component';

describe('SnackbarService', () => {
  let service: SnackbarService;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('MatSnackBar', ['openFromComponent']);

    TestBed.configureTestingModule({
      providers: [
        SnackbarService,
        { provide: MatSnackBar, useValue: spy },
      ],
    });

    service = TestBed.inject(SnackbarService);
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call snackBar.openFromComponent with correct config', () => {
    const message = 'Test message';

    service.open(message);

    expect(snackBarSpy.openFromComponent).toHaveBeenCalledOnceWith(SnackbarSuccessComponent, {
      panelClass: ['custom-snackbar', 'snackbar-success'],
      data: message,
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  });
});
