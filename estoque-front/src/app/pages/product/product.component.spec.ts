import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductComponent } from './product.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { ProductService } from './service/product.service';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { UtilsService } from '../../shared/services/utils.service';
import { CategoryService } from '../category/service/category.service';
import { StockService } from './service/stock.service';
import { AuthService } from '../../shared/services/auth.service';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { Product } from '../../shared/models/product';
import { Category } from '../../shared/models/category';
import { ViewProductComponent } from './view-product/view-product.component';
import { Stock } from '../../shared/models/stock';
import { StockComponent } from './stock/stock.component';

describe('ProductComponent', () => {
  const category: Category = { id: 1, name: 'Cat', isActive: true };
  const category2: Category = { id: 2, name: 'Cat', isActive: true };
  const products: Product[] = [
    { id: 1, name: 'P1', isActive: true, category, price: 12 },
    { id: 2, name: 'P2', isActive: true, category, price: 12 },
    { id: 3, name: 'P13', isActive: true, category: category2, price: 12 },
  ];

  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;

  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let categoryServiceSpy: jasmine.SpyObj<CategoryService>;
  let snackbarServiceSpy: jasmine.SpyObj<SnackbarService>;
  let utilsServiceSpy: jasmine.SpyObj<UtilsService>;
  let stockServiceSpy: jasmine.SpyObj<StockService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    productServiceSpy = jasmine.createSpyObj('ProductService', ['list', 'create', 'edit', 'delete']);
    categoryServiceSpy = jasmine.createSpyObj('CategoryService', ['list']);
    snackbarServiceSpy = jasmine.createSpyObj('SnackbarService', ['open']);
    utilsServiceSpy = jasmine.createSpyObj('UtilsService', ['openDialog', 'deleteDialog', 'onError']);
    stockServiceSpy = jasmine.createSpyObj('StockService', ['findByProduct', 'edit']);
    authServiceSpy = jasmine.createSpyObj('AuthService', [], { isAdmin$: of(true) });

    await TestBed.configureTestingModule({
      imports: [ProductComponent, MatDialogModule, ReactiveFormsModule],
      providers: [
        provideHttpClientTesting(),
        { provide: ProductService, useValue: productServiceSpy },
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: SnackbarService, useValue: snackbarServiceSpy },
        { provide: UtilsService, useValue: utilsServiceSpy },
        { provide: StockService, useValue: stockServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
  });

  it('should create component and initialize', () => {
    productServiceSpy.list.and.returnValue(of(products));
    categoryServiceSpy.list.and.returnValue(of([category]));

    component.ngOnInit();

    expect(component.products).toEqual(products);
    expect(component.filteredProducts).toEqual(products);
    expect(component.categories).toEqual([category]);
    expect(component.form).toBeDefined();
  });

  it('should filter products by name', () => {
    component.products = [
      { id: 1, name: 'Laptop', isActive: true, category, price: 12 },
      { id: 2, name: 'Mouse', isActive: true, category, price: 12 },
    ];
    component.createForm();
    component.form.get('name')?.setValue('Laptop');
    component.onlyActives.set(false);

    component.search();

    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].name).toBe('Laptop');
  });

  it('should reset form and filters', () => {
    component.createForm();
    component.products = products;
    component.filteredProducts = [];

    component.clearSearch();

    expect(component.form.getRawValue()).toEqual({ name: null, category: null });
    expect(component.filteredProducts).toEqual(component.products);
    expect(component.onlyActives()).toBeFalse();
  });

  it('should call insert and show snackbar', async () => {
    utilsServiceSpy.openDialog.and.returnValue(Promise.resolve(products[0]));
    productServiceSpy.create.and.returnValue(of(products[0]));
    productServiceSpy.list.and.returnValue(of(products));

    await component.insertDialog();

    expect(productServiceSpy.create).toHaveBeenCalledWith(products[0]);
    expect(snackbarServiceSpy.open).toHaveBeenCalledWith('Produto cadastrado com sucesso!');
  });

  it('should handle error on insert', async () => {
    const products = { id: 1, name: 'P1', isActive: true, category };
    utilsServiceSpy.openDialog.and.returnValue(Promise.resolve(products));
    productServiceSpy.create.and.returnValue(throwError(() => ({ error: { message: 'Erro X' } })));

    await component.insertDialog();

    expect(utilsServiceSpy.onError).toHaveBeenCalledWith('Erro X');
  });

  it('should handle error on insert with default message', async () => {
    const products = { id: 1, name: 'P1', isActive: true, category };
    utilsServiceSpy.openDialog.and.returnValue(Promise.resolve(products));
    productServiceSpy.create.and.returnValue(throwError(() => ({ error: { message: null } })));

    await component.insertDialog();

    expect(utilsServiceSpy.onError).toHaveBeenCalledWith('Erro ao inserir produto');
  });

  it('should call edit and show snackbar on success via editDialog', async () => {
    const product = { id: 1, name: 'Notebook', isActive: true, category, price: 12 };
    const updatedProduct = { ...product, name: 'Notebook Pro' };

    utilsServiceSpy.openDialog.and.returnValue(Promise.resolve(updatedProduct));
    productServiceSpy.edit.and.returnValue(of(updatedProduct));
    productServiceSpy.list.and.returnValue(of([updatedProduct]));

    await component.editDialog(product);

    expect(productServiceSpy.edit).toHaveBeenCalledWith(1, updatedProduct);
    expect(snackbarServiceSpy.open).toHaveBeenCalledWith('Produto atualizado com sucesso!');
  });

  it('should handle error on product edit', () => {
    const product = { id: 1, name: 'Produto', isActive: true, category, price: 12 };
    const error = { error: { message: 'Erro ao editar' } };

    productServiceSpy.edit.and.returnValue(throwError(() => error));

    component['edit'](1, product);

    expect(utilsServiceSpy.onError).toHaveBeenCalledWith('Erro ao editar');
  });

  it('should handle error on product edit with default message', () => {
    const product = { id: 1, name: 'Produto', isActive: true, category, price: 12 };
    const error = { error: { message: null } };

    productServiceSpy.edit.and.returnValue(throwError(() => error));

    component['edit'](1, product);

    expect(utilsServiceSpy.onError).toHaveBeenCalledWith('Erro ao atualizar produto!');
  });

  it('should delete product when confirmed', (done) => {
    const productId = 1;

    utilsServiceSpy.deleteDialog.and.returnValue(Promise.resolve(true));
    productServiceSpy.delete.and.returnValue(of({}));
    productServiceSpy.list.and.returnValue(of([]));

    component.deleteDialog(productId).then(() => {
      expect(productServiceSpy.delete).toHaveBeenCalledWith(productId);
      expect(snackbarServiceSpy.open).toHaveBeenCalledWith('Produto deletado com sucesso!');
      done();
    });
  });

  it('should handle error on delete', () => {
    productServiceSpy.delete.and.returnValue(throwError(() => ({ error: { message: 'Erro delete' } })));

    (component as any).remove(1);

    expect(utilsServiceSpy.onError).toHaveBeenCalledWith('Erro delete');
  });

  it('should handle error on delete with default message', () => {
    productServiceSpy.delete.and.returnValue(throwError(() => ({ error: { message: null } })));

    (component as any).remove(1);

    expect(utilsServiceSpy.onError).toHaveBeenCalledWith('Erro ao deletar produto!');
  });

  it('should not delete product if canceled', async () => {
    utilsServiceSpy.deleteDialog.and.returnValue(Promise.resolve(false));

    await component.deleteDialog(1);

    expect(productServiceSpy.delete).not.toHaveBeenCalled();
  });

  it('should open view dialog with product data', async () => {
    const product = { id: 1, name: 'Notebook' };

    utilsServiceSpy.openDialog.and.returnValue(Promise.resolve());

    await component.viewDialog(product);

    expect(utilsServiceSpy.openDialog).toHaveBeenCalledWith({
      component: ViewProductComponent,
      data: { product },
    });
  });

  it('should open stock dialog and update quantity when confirmed', async () => {
    const stock: Stock = {
      id: 0,
      quantity: 10,
      product: { id: 5, name: 'Produto X', category: { id: 1, isActive: true, name: '' }, isActive: true, price: 12 },
    };
    const dialogResult = { quantity: 20 };

    stockServiceSpy.findByProduct.and.returnValue(of(stock));
    utilsServiceSpy.openDialog.and.returnValue(Promise.resolve(dialogResult));
    stockServiceSpy.edit.and.returnValue(of(stock));
    snackbarServiceSpy.open.and.stub();

    await component.viewStock(1);

    expect(stockServiceSpy.findByProduct).toHaveBeenCalledWith(1);
    expect(utilsServiceSpy.openDialog).toHaveBeenCalledWith({
      component: StockComponent,
      data: { stock },
    });
    expect(stockServiceSpy.edit).toHaveBeenCalledWith(stock.id, { quantity: 20 });
    expect(snackbarServiceSpy.open).toHaveBeenCalledWith('Estoque atualizado com sucesso!');
  });

  it('should handle error if stock lookup or update fails', async () => {
    const error = { error: { message: 'Erro de estoque' } };
    stockServiceSpy.findByProduct.and.returnValue(throwError(() => error));

    await component.viewStock(1);

    expect(utilsServiceSpy.onError).toHaveBeenCalledWith('Erro de estoque');
  });

  it('should handle error if stock lookup or update fails with default message', async () => {
    const error = { error: { message: null } };
    stockServiceSpy.findByProduct.and.returnValue(throwError(() => error));

    await component.viewStock(1);

    expect(utilsServiceSpy.onError).toHaveBeenCalledWith('Erro ao processar operação!');
  });

  it('should return all products when no filters are applied', () => {
    component.createForm();
    component.products = products;
    component.form.setValue({ name: '', category: null });
    component.onlyActives.set(false);

    component.search();

    expect(component.filteredProducts).toEqual(products);
  });

  it('should filter by name only', () => {
    component.createForm();
    component.products = products;
    component.form.setValue({ name: 'p1', category: null });
    component.onlyActives.set(false);

    component.search();

    expect(component.filteredProducts.length).toBe(2);
    expect(component.filteredProducts.every((p) => p.name.toLowerCase().includes('p1'))).toBeTrue();
  });

  it('should filter by category only', () => {
    component.createForm();
    component.products = [...products];
    component.form.setValue({ name: '', category: 1 });
    component.onlyActives.set(false);

    component.search();

    expect(component.filteredProducts.length).toBe(2);
    expect(component.filteredProducts.every((p) => p.category.id === 1)).toBeTrue();
  });

  it('should filter by name and category', () => {
    component.createForm();
    component.products = [...products];
    component.form.setValue({ name: 'p', category: 1 });
    component.onlyActives.set(false);

    component.search();

    expect(component.filteredProducts.length).toBe(2);
    expect(component.filteredProducts.every((p) => p.category.id === 1 && p.name.toLowerCase().includes('p'))).toBeTrue();
  });

  it('should filter only actives after applying other filters', () => {
    component.createForm();
    component.products = [...products];
    component.form.setValue({ name: '', category: null });
    component.onlyActives.set(true);

    component.search();

    expect(component.filteredProducts.length).toBe(3);
    expect(component.filteredProducts.every((p) => p.isActive)).toBeTrue();
  });
});
