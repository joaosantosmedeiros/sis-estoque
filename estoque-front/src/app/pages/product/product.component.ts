import { Component, inject, model, OnInit } from '@angular/core';
import { ProductService } from './service/product.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { UtilsService } from '../../shared/services/utils.service';
import { Product } from '../../shared/models/product';
import { ProductDetailComponent } from './product-form/product-form.component';
import { CategoryService } from '../category/service/category.service';
import { Category } from '../../shared/models/category';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ViewProductComponent } from './view-product/view-product.component';
import { StockService } from './service/stock.service';
import { StockComponent } from './stock/stock.component';
import { AuthService } from '../../shared/services/auth.service';
import { firstValueFrom, Observable } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';

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
    MatTableModule,
    MatCheckboxModule,
    AsyncPipe,
    NgIf,
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent implements OnInit {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly productService: ProductService,
    private readonly snackbarService: SnackbarService,
    private readonly utilsService: UtilsService,
    private readonly stockService: StockService,
    private readonly authService: AuthService
  ) {
    this.isAdmin = this.authService.isAdmin$;
  }

  categories: Category[] = [];
  products: Product[] = [];
  filteredProducts: Product[] = [];
  isAdmin: Observable<boolean>;

  displayedColumns: string[] = ['position', 'name', 'isActive', 'actions'];

  dialog = inject(MatDialog);

  form!: FormGroup;

  readonly onlyActives = model(true);

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
      this.filteredProducts = this.products.filter((product) => product.isActive);
    });
  }

  getCategories(): void {
    this.categoryService.list().subscribe((categories) => {
      this.categories = categories.filter((category) => category.isActive);
    });
  }

  clearSearch(): void {
    this.form.reset();
    this.filteredProducts = this.products;
    this.onlyActives.set(false);
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

  async viewDialog(product: any) {
    await this.utilsService.openDialog({
      component: ViewProductComponent,
      data: {
        product,
      },
    });
  }

  async viewStock(id: number) {
    try {
      const stock = await firstValueFrom(this.stockService.findByProduct(id));

      const result = await this.utilsService.openDialog({
        component: StockComponent,
        data: { stock },
      });

      if (!result?.quantity) return;

      await firstValueFrom(this.stockService.edit(stock.id, { quantity: result.quantity }));

      this.snackbarService.open('Estoque atualizado com sucesso!');
    } catch (err: any) {
      this.utilsService.onError(err?.error?.message ?? 'Erro ao processar operação!');
    }
  }

  async editDialog(product: any) {
    const result = await this.utilsService.openDialog({
      component: ProductDetailComponent,
      data: {
        action: 'Editar',
        product,
      },
    });

    if (result?.name) {
      this.edit(product.id, result);
    }
  }

  async deleteDialog(id: number) {
    const result = await this.utilsService.deleteDialog();

    if (result) this.remove(id);
  }

  private insert(product: Product) {
    this.productService.create(product).subscribe({
      next: (product) => {
        this.snackbarService.open('Produto cadastrado com sucesso!');
        this.getProducts();
      },
      error: (err) => {
        this.utilsService.onError(err.error.message ?? 'Erro ao inserir produto');
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
        this.utilsService.onError(err.error.message ?? 'Erro ao atualizar produto!');
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
        this.utilsService.onError(err.error.message ?? 'Erro ao deletar produto!');
      },
    });
  }

  search() {
    const { name, category } = this.form.getRawValue();

    const nameExists = !(!name || name.trim().length == 0);
    const categoryExists = !(!category || category == null);
    const onlyActives = this.onlyActives();

    if (!nameExists && !categoryExists) {
      this.filteredProducts = this.products;
    } else if (!nameExists && categoryExists) {
      this.filteredProducts = this.products.filter((product) => product.category.id == category);
    } else if (nameExists && !categoryExists) {
      this.filteredProducts = this.products.filter((product) => product.name.toLowerCase().includes(name.trim().toLowerCase()));
    } else {
      this.filteredProducts = this.products.filter((product) => {
        return product.name.toLowerCase().includes(name.trim().toLowerCase()) && product.category.id == category;
      });
    }

    if (onlyActives) this.filteredProducts = this.filteredProducts.filter((product) => product.isActive);
  }
}
