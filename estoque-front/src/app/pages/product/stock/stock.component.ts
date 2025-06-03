import { Component, Inject, OnInit, Optional } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Stock } from '../../../shared/models/stock';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-stock',
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './stock.component.html',
})
export class StockComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Optional() private readonly dialogRef: MatDialogRef<StockComponent>
  ) {}

  stock: Stock | null = null;
  form!: FormGroup;

  ngOnInit(): void {
    this.initiateData();
    this.createForm();
  }

  initiateData() {
    this.stock = this.data.stock ?? null;
  }

  createForm(): void {
    if (!this.stock) return;

    this.form = new FormGroup({
      quantity: new FormControl(this.stock?.quantity || 0, [
        Validators.required,
        Validators.min(0),
        Validators.max(10000),
      ]),
      productId: new FormControl(
        { value: this.stock?.product.id || null, disabled: true },
        Validators.required
      ),
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    const { quantity, productId } = this.form.getRawValue();

    const request = {
      quantity,
      productId,
    };

    this.dialogRef.close(request);
  }

  get quantity() {
    return this.form.get('quantity')!;
  }
}
