import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SnackbarSuccessComponent } from './snackbar-success.component';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

describe('SnackbarSuccessComponent', () => {
  let component: SnackbarSuccessComponent;
  let fixture: ComponentFixture<SnackbarSuccessComponent>;
  let snackBarRefSpy: jasmine.SpyObj<MatSnackBarRef<SnackbarSuccessComponent>>;

  beforeEach(async () => {
    snackBarRefSpy = jasmine.createSpyObj('MatSnackBarRef', ['dismiss']);

    await TestBed.configureTestingModule({
      imports: [SnackbarSuccessComponent, MatSnackBarModule, MatButtonModule, MatIconModule, MatProgressBarModule],
      declarations: [],
      providers: [
        { provide: MAT_SNACK_BAR_DATA, useValue: 'Mensagem de sucesso' },
        { provide: MatSnackBarRef, useValue: snackBarRefSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SnackbarSuccessComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial progressBarValue as 100', () => {
    expect(component.progressBarValue).toBe(100);
  });

  it('should decrease progressBarValue over time after ngOnInit', fakeAsync(() => {
    component.ngOnInit();

    expect(component.progressBarValue).toBe(100);

    tick(90);
    expect(component.progressBarValue).toBeCloseTo(100 - 99 / 40, 3);

    tick(90 * 9);
    expect(component.progressBarValue).toBeLessThan(100);

    tick(4000);

    const valueAfterTimeout = component.progressBarValue;
    tick(500);
    expect(component.progressBarValue).toBe(valueAfterTimeout);
  }));
});
