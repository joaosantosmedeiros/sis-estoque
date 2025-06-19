import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryDetailComponent } from './category-detail.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Category } from '../../../shared/models/category';

describe('CategoryDetailComponent', () => {
  let component: CategoryDetailComponent;
  let fixture: ComponentFixture<CategoryDetailComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<CategoryDetailComponent>>;

  const mockCategory: Category = {
    id: 1,
    name: 'Alimentos',
    isActive: true,
  };

  function createComponentWithData(categoryData: Category | null) {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      imports: [CategoryDetailComponent,],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { category: categoryData } },
        { provide: MatDialogRef, useValue: dialogRefSpy },
      ],
    });

    fixture = TestBed.createComponent(CategoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create with category data', () => {
    createComponentWithData(mockCategory);

    expect(component).toBeTruthy();
    expect(component.form).toBeDefined();
    expect(component.name.value).toBe('Alimentos');
    expect(component.isActive.value).toBe(true);
  });

  it('should create without category data', () => {
    createComponentWithData(null);

    expect(component).toBeTruthy();
    expect(component.form).toBeDefined();
    expect(component.name.value).toBe('');
    expect(component.isActive.value).toBeUndefined();
  });

  it('should mark form invalid if required fields are missing', () => {
    createComponentWithData(null);
    component.name.setValue('');
    component.isActive.setValue(null);
    expect(component.form.invalid).toBeTrue();
  });

  it('should call dialogRef.close with form value when valid', () => {
    createComponentWithData(mockCategory);

    component.submit();

    expect(dialogRefSpy.close).toHaveBeenCalledWith({
      name: 'Alimentos',
      isActive: true,
    });
  });

  it('should NOT call dialogRef.close when form is invalid', () => {
    createComponentWithData(null);

    component.submit();

    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });

  it('should return controls via getters', () => {
    createComponentWithData(mockCategory);

    expect(component.name).toBe(component.form.get('name')!);
    expect(component.isActive).toBe(component.form.get('isActive')!);
  });
});
