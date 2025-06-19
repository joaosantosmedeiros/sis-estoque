import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorDialogComponent } from './error-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('ErrorDialogComponent', () => {
  let component: ErrorDialogComponent;
  let fixture: ComponentFixture<ErrorDialogComponent>;

  const mockErrorMessage = 'Erro inesperado no servidor!';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorDialogComponent, MatIconModule, MatButtonModule, MatDialogTitle, MatDialogActions, MatDialogClose, MatDialogContent],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: mockErrorMessage }],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the dialog component', () => {
    expect(component).toBeTruthy();
  });

  it('should receive error message via MAT_DIALOG_DATA', () => {
    expect(component.data).toBe(mockErrorMessage);
  });
});
