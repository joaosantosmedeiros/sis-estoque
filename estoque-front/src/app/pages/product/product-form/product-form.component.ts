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
})
export class ProductDetailComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Optional()
    private readonly dialogRef: MatDialogRef<ProductDetailComponent>,
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
        this.categories = categories.filter((category) => category.isActive);
      },
      error: () => this.utilsService.onError('Erro ao carregar categorias!'),
    });
  }

  createForm(): void {
    this.form = new FormGroup({
      name: new FormControl(this.product?.name ?? '', [
        Validators.required,
        Validators.maxLength(60),
      ]),
      price: new FormControl(this.product?.price ?? null, [
        Validators.required,
        Validators.min(1),
        Validators.max(10000),
      ]),
      category: new FormControl(
        { value: this.product?.category.id ?? null, disabled: false },
        [Validators.required]
      ),
      isActive: new FormControl(
        { value: this.product?.isActive, disabled: false },
        Validators.required
      ),
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    const { name, price, category, isActive } = this.form.getRawValue();

    const request = {
      name,
      price,
      categoryId: category,
      isActive,
    };

    this.dialogRef.close(request);
  }

  get name() {
    return this.form.get('name')!;
  }

  get price() {
    return this.form.get('price')!;
  }

  get isActive() {
    return this.form.get('isActive')!;
  }

  get category() {
    return this.form.get('category')!;
  }
}
