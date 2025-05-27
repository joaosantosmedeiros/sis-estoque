import { Component, Inject, OnInit, Optional } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Category } from '../../../shared/models/category';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-category-detail',
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './category-detail.component.html',
  styleUrl: './category-detail.component.scss',
})
export class CategoryDetailComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Optional()
    private readonly dialogRef: MatDialogRef<CategoryDetailComponent>
  ) {}

  form!: FormGroup;
  category: Category | null = null;

  ngOnInit(): void {
    this.initiateData();
    this.createForm();
  }

  initiateData(): void {
    this.category = this.data.category ?? null;
  }

  createForm(): void {
    this.form = new FormGroup({
      name: new FormControl(this.category?.name ?? '', [
        Validators.required,
        Validators.maxLength(60),
      ]),
      isActive: new FormControl(
        { value: this.category?.isActive, disabled: false },
        Validators.required
      ),
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    this.dialogRef.close(this.form.getRawValue());
  }

  get name() {
    return this.form.get('name')!;
  }

  get isActive() {
    return this.form.get('isActive')!;
  }
}
