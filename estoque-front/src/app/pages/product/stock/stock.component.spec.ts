import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockComponent } from './stock.component';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Stock } from '../../../shared/models/stock';

describe('StockComponent', () => {
  let component: StockComponent;
  let fixture: ComponentFixture<StockComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<StockComponent>>;

  const stock: Stock = {
    id: 0,
    quantity: 10,
    product: { id: 5, name: 'Produto X', category: { id: 1, isActive: true, name: '' }, isActive: true, price: 12 },
  };

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [MatDialogModule, StockComponent, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { stock: stock } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StockComponent);
    component = fixture.componentInstance;
  });

  it('should create and initialize form with stock data', () => {
    fixture.detectChanges(); // ngOnInit
    expect(component).toBeTruthy();
    expect(component.stock).toEqual(stock);

    expect(component.form).toBeDefined();
    expect(component.form.get('quantity')?.value).toBe(stock.quantity);
    expect(component.form.get('productId')?.value).toBe(stock.product.id);
    expect(component.form.get('productId')?.disabled).toBeTrue();
  });

  it('should close dialog with form values on valid submit', () => {
    fixture.detectChanges();
    component.form.setValue({ quantity: 15, productId: stock.product.id });
    component.submit();

    expect(dialogRefSpy.close).toHaveBeenCalledWith({
      quantity: 15,
      productId: stock.product.id,
    });
  });

  it('should NOT close dialog on invalid submit', () => {
    fixture.detectChanges();
    component.form.setValue({ quantity: -5, productId: stock.product.id });
    component.submit();

    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });

  it('should provide getter for quantity form control', () => {
    fixture.detectChanges();
    expect(component.quantity).toBe(component.form.get('quantity')!);
  });
});
