import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from './service/product.service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { UtilsService } from '../../shared/services/utils.service';
import { Product } from '../../shared/models/product';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { CategoryService } from '../category/service/category.service';
import { Category } from '../../shared/models/category';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-product',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent implements OnInit {
  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private snackbarService: SnackbarService,
    private utilsService: UtilsService
  ) {}

  categories: Category[] = [];
  products: Product[] = [];
  filteredProducts: Product[] = [];

  dialog = inject(MatDialog);

  form!: FormGroup;

  ngOnInit() {
    this.getCategories();
    this.getProducts();
    this.createForm();
  }

  createForm(): void {
    this.form = new FormGroup({
      name: new FormControl(''),
      category: new FormControl(),
    });
  }

  getProducts(): void {
    this.productService.list().subscribe((products) => {
      this.products = products;
      this.filteredProducts = this.products;
    });
  }

  getCategories(): void {
    this.categoryService.list().subscribe((categories) => {
      this.categories = categories;
    });
  }

  clearSearch(): void {
    this.form.reset();
    this.filteredProducts = this.products;
  }

  async insertDialog() {
    const product = await this.utilsService.openDialog({
      component: ProductDetailComponent,
      data: {
        action: 'Cadastrar',
      },
    });

    if (product) {
      this.insert(product);
    }
  }

  async editDialog(product: Product) {
    const result = await this.utilsService.openDialog({
      component: ProductDetailComponent,
      data: {
        action: 'Editar',
        product,
      },
    });

    if (result && result.removeId && typeof result.removeId == 'number') {
      this.remove(result.removeId);
    }

    if (result && result.name) {
      this.edit(product.id, result);
    }
  }

  private insert(product: Product) {
    this.productService.create(product).subscribe({
      next: (product) => {
        this.snackbarService.open('Produto cadastrado com sucesso!');
        this.getProducts();
      },
      error: (err) => {
        this.utilsService.onError(
          err.error.message || 'Erro ao inserir produto'
        );
      },
    });
  }

  private edit(id: number, product: Product) {
    this.productService.edit(id, product).subscribe({
      next: () => {
        this.snackbarService.open('Produto atualizado com sucesso!');
        this.getProducts();
      },
      error: (err) => {
        this.utilsService.onError(
          err.error.message || 'Erro ao atualizar produto'
        );
      },
    });
  }

  private remove(id: number) {
    this.productService.delete(id).subscribe({
      next: () => {
        this.snackbarService.open('Produto deletado com sucesso!');
        this.getProducts();
      },
      error: (err) => {
        this.utilsService.onError(
          err.error.message || 'Erro ao deletar produto'
        );
      },
    });
  }

  search() {
    const { name, category } = this.form.getRawValue();

    const nameExists = !(!name || name.trim().length == 0);
    const categoryExists = !(!category || category == null);

    if (!nameExists && !categoryExists) {
      this.filteredProducts = this.products;
    } else if (!nameExists && categoryExists) {
      this.filteredProducts = this.products.filter(
        (product) => product.category.id == category
      );
    } else if (nameExists && !categoryExists) {
      this.filteredProducts = this.products.filter((product) =>
        product.name.toLowerCase().includes(name.trim().toLowerCase())
      );
    } else {
      this.filteredProducts = this.products.filter((product) => {
        return (
          product.name.toLowerCase().includes(name.trim().toLowerCase()) &&
          product.category.id == category
        );
      });
    }
  }
}
