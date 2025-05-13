import { Component, Inject, OnInit, Optional } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Product } from '../../../shared/models/product';
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
import { CategoryService } from '../../category/service/category.service';
import { Category } from '../../../shared/models/category';
import { UtilsService } from '../../../shared/services/utils.service';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-product-form',
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
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Optional() private dialogRef: MatDialogRef<ProductFormComponent>,
    private readonly categoryService: CategoryService,
    private readonly utilsService: UtilsService
  ) {}

  form!: FormGroup;
  product: Product | null = null;
  categories: Category[] = [];

  ngOnInit(): void {
    this.getCategories();
    this.initiateData();
    this.createForm();
  }

  initiateData(): void {
    this.product = this.data.product ?? null;
  }

  getCategories(): void {
    this.categoryService.list().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: () => this.utilsService.onError('Erro ao carregar categorias!'),
    });
  }

  createForm(): void {
    this.form = new FormGroup({
      name: new FormControl(this.product?.name || '', [
        Validators.required,
        Validators.maxLength(60),
      ]),
      price: new FormControl(this.product?.price || null, [
        Validators.required,
        Validators.min(1),
        Validators.max(10000),
      ]),
      category: new FormControl({value: this.product?.category.id || null, disabled: false}, [
        Validators.required,
      ]),
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    const { name, price, category } = this.form.getRawValue();

    const request = {
      name,
      price,
      categoryId: category,
    };

    this.dialogRef.close(request);
  }

  remove(): void {
    if (!this.product) return;

    this.dialogRef.close({ removeId: this.product.id });
  }

  get name() {
    return this.form.get('name')!;
  }

  get price() {
    return this.form.get('price')!;
  }

  get category() {
    return this.form.get('category')!;
  }
}