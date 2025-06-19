import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryComponent } from './category.component';
import { Category } from '../../shared/models/category';
import { of, throwError } from 'rxjs';
import { CategoryService } from './service/category.service';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { UtilsService } from '../../shared/services/utils.service';
import { AuthService } from '../../shared/services/auth.service';

describe('CategoryComponent', () => {
  let component: CategoryComponent;
  let fixture: ComponentFixture<CategoryComponent>;

  let categoryServiceSpy: jasmine.SpyObj<CategoryService>;
  let snackbarSpy: jasmine.SpyObj<SnackbarService>;
  let utilsSpy: jasmine.SpyObj<UtilsService>;
  let authServiceStub: Partial<AuthService>;

  const mockCategories: Category[] = [
    { id: 1, name: 'Eletrônicos', isActive: true },
    { id: 2, name: 'Alimentos', isActive: false },
  ];

  beforeEach(() => {
    categoryServiceSpy = jasmine.createSpyObj('CategoryService', ['list', 'create', 'edit', 'delete']);
    snackbarSpy = jasmine.createSpyObj('SnackbarService', ['open']);
    utilsSpy = jasmine.createSpyObj('UtilsService', ['openDialog', 'onError']);
    authServiceStub = { isAdmin$: of(true) };

    TestBed.configureTestingModule({
      imports: [CategoryComponent],
      providers: [
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: SnackbarService, useValue: snackbarSpy },
        { provide: UtilsService, useValue: utilsSpy },
        { provide: AuthService, useValue: authServiceStub },
      ],
    });

    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture?.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getCategories and filter active by default', () => {
    categoryServiceSpy.list.and.returnValue(of(mockCategories));

    component.ngOnInit();

    expect(categoryServiceSpy.list).toHaveBeenCalled();
    expect(component.categories.length).toBe(2);
    expect(component.filteredCategories.length).toBe(1);
  });

  it('should filter categories by name and active', () => {
    categoryServiceSpy.list.and.returnValue(of(mockCategories));
    component.ngOnInit();
    component.form.get('name')?.setValue('ele');

    expect(component.filteredCategories.length).toBe(1);
    expect(component.filteredCategories[0].name).toBe('Eletrônicos');
  });

    it('should return all categorias with onlyActives disables', () => {
    categoryServiceSpy.list.and.returnValue(of(mockCategories));
    component.onlyActives.set(false);
    component.getCategories();
    expect(categoryServiceSpy.list).toHaveBeenCalled();
    expect(component.categories.length).toBe(2);
    expect(component.filteredCategories.length).toBe(2);
  });


  it('should clear search and show all categories', () => {
    categoryServiceSpy.list.and.returnValue(of(mockCategories));
    component.ngOnInit();
    component.clearSearch();

    expect(component.filteredCategories.length).toBe(2);
    expect(component.onlyActives()).toBeFalse();
  });

  it('should insert new category if it does not already exist', async () => {
    categoryServiceSpy.list.and.returnValue(of([]));
    categoryServiceSpy.create.and.returnValue(of(mockCategories[0]));
    utilsSpy.openDialog.and.resolveTo(mockCategories[0]);

    component.ngOnInit();
    await component.insertDialog();

    expect(categoryServiceSpy.create).toHaveBeenCalledWith(mockCategories[0]);
    expect(snackbarSpy.open).toHaveBeenCalledWith('Categoria cadastrada com sucesso!');
  });

  it('should not insert if category already exists', async () => {
    categoryServiceSpy.list.and.returnValue(of([mockCategories[0]]));
    utilsSpy.openDialog.and.resolveTo(mockCategories[0]);

    component.ngOnInit();
    await component.insertDialog();

    expect(categoryServiceSpy.create).not.toHaveBeenCalled();
    expect(utilsSpy.onError).toHaveBeenCalledWith('Já existe uma categoria cadastrada com esse nome.');
  });

  it('should handle error on insert', async () => {
    categoryServiceSpy.list.and.returnValue(of([]));
    categoryServiceSpy.create.and.returnValue(throwError(() => ({ error: { message: 'Erro!' } })));
    utilsSpy.openDialog.and.resolveTo(mockCategories[0]);

    component.ngOnInit();
    await component.insertDialog();

    expect(utilsSpy.onError).toHaveBeenCalledWith('Erro!');
  });

  it('should handle error on insert with default message', async () => {
    categoryServiceSpy.list.and.returnValue(of([]));
    categoryServiceSpy.create.and.returnValue(throwError(() => ({ error: { message: null } })));
    utilsSpy.openDialog.and.resolveTo(mockCategories[0]);

    component.ngOnInit();
    await component.insertDialog();

    expect(utilsSpy.onError).toHaveBeenCalledWith('Erro ao inserir categoria');
  });

  it('should edit a category if result has name', async () => {
    const result = { id: 0, name: 'Atualizado', isActive: true };
    categoryServiceSpy.edit.and.returnValue(of(result));
    categoryServiceSpy.list.and.returnValue(of([result]));
    utilsSpy.openDialog.and.resolveTo(result);

    await component.editDialog(mockCategories[0]);

    expect(categoryServiceSpy.edit).toHaveBeenCalledWith(mockCategories[0].id, result);
    expect(snackbarSpy.open).toHaveBeenCalledWith('Categoria atualizada com sucesso!');
  });

  it('should delete category if removeId is passed in edit dialog result', async () => {
    const result = { removeId: 1 };
    categoryServiceSpy.delete.and.returnValue(of(void 0));
    categoryServiceSpy.list.and.returnValue(of([]));
    utilsSpy.openDialog.and.resolveTo(result);

    await component.editDialog(mockCategories[0]);

    expect(categoryServiceSpy.delete).toHaveBeenCalledWith(1);
    expect(snackbarSpy.open).toHaveBeenCalledWith('Categoria deletada com sucesso!');
  });

  it('should handle error on edit', async () => {
    const result = { name: 'Erro', isActive: true };
    categoryServiceSpy.edit.and.returnValue(throwError(() => ({ error: { message: 'Falha' } })));
    utilsSpy.openDialog.and.resolveTo(result);

    await component.editDialog(mockCategories[0]);

    expect(utilsSpy.onError).toHaveBeenCalledWith('Falha');
  });

  it('should handle error on edit with default message', async () => {
    const result = { name: 'Erro', isActive: true };
    categoryServiceSpy.edit.and.returnValue(throwError(() => ({ error: { message: null } })));
    utilsSpy.openDialog.and.resolveTo(result);

    await component.editDialog(mockCategories[0]);

    expect(utilsSpy.onError).toHaveBeenCalledWith('Erro ao atualizar categoria');
  });

  it('should handle error on delete', () => {
    categoryServiceSpy.delete.and.returnValue(throwError(() => ({ error: { message: 'Erro delete' } })));

    (component as any).remove(1);

    expect(utilsSpy.onError).toHaveBeenCalledWith('Erro delete');
  });

  it('should handle error on delete', () => {
    categoryServiceSpy.delete.and.returnValue(throwError(() => ({ error: { message: null } })));

    (component as any).remove(1);

    expect(utilsSpy.onError).toHaveBeenCalledWith('Erro ao deletar categoria');
  });

  it('should filter only active categories when onlyActives is true', () => {
    categoryServiceSpy.list.and.returnValue(of(mockCategories));
    component.ngOnInit();

    component.filteredCategories = mockCategories;
    component.onlyActives.set(true);

    component.toggleIsActive();

    expect(component.filteredCategories.length).toBe(1);
    expect(component.filteredCategories[0].isActive).toBeTrue();
  });

  it('should filter categories by name when onlyActives is false', () => {
    categoryServiceSpy.list.and.returnValue(of(mockCategories));
    component.ngOnInit();

    component.categories = mockCategories;
    component.onlyActives.set(false);
    component.form.get('name')?.setValue('ali'); // "Alimentos"

    component.toggleIsActive();

    expect(component.filteredCategories.length).toBe(1);
    expect(component.filteredCategories[0].name).toContain('Alimentos');
  });
});
