import { Component, inject, model, OnInit } from '@angular/core';
import { CategoryService } from './service/category.service';
import { Category } from '../../shared/models/category';
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
import { CategoryDetailComponent } from './category-detail/category-detail.component';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { UtilsService } from '../../shared/services/utils.service';
import { AuthService } from '../../shared/services/auth.service';
import { MatTableModule } from '@angular/material/table';
import { Observable } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-category',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    AsyncPipe,
    NgIf,
    MatCheckboxModule,
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent implements OnInit {
  isAdmin: Observable<boolean>;

  constructor(
    private readonly categoryService: CategoryService,
    private readonly snackbarService: SnackbarService,
    private readonly utilsService: UtilsService,
    private readonly authService: AuthService
  ) {
    this.isAdmin = this.authService.isAdmin$;
  }

  readonly onlyActives = model(true);

  displayedColumns = ['position', 'name', 'isActive', 'actions'];
  categories: Category[] = [];
  filteredCategories: Category[] = [];

  dialog = inject(MatDialog);

  form!: FormGroup;

  toggleIsActive() {
    if (this.onlyActives()) {
      this.filteredCategories = this.filteredCategories.filter(
        (category) => category.isActive
      );
    } else {
      const value = this.form.get('name')?.value;
      this.filteredCategories = this.categories.filter((category) =>
        category.name.toLowerCase().includes(value?.trim().toLowerCase())
      );
    }
  }

  ngOnInit() {
    this.getCategories();
    this.createForm();
  }

  createForm(): void {
    this.form = new FormGroup({
      name: new FormControl(''),
    });

    this.form.get('name')?.valueChanges.subscribe((value) => {
      if (value) {
        this.filteredCategories = this.categories.filter((category) =>
          category.name.toLowerCase().includes(value.trim().toLowerCase())
        );
      } else {
        this.filteredCategories = this.categories;
      }
      if (this.onlyActives())
        this.filteredCategories = this.filteredCategories.filter(
          (c) => c.isActive
        );
    });
  }

  getCategories(): void {
    this.categoryService.list().subscribe((categories) => {
      this.categories = categories;
      this.filteredCategories = this.onlyActives()
        ? categories.filter((c) => c.isActive)
        : categories;
    });
  }

  clearSearch(): void {
    this.form.get('name')?.reset();
    this.filteredCategories = this.categories;
    this.onlyActives.set(false);
  }

  async insertDialog() {
    const category = await this.utilsService.openDialog({
      component: CategoryDetailComponent,
      data: {
        action: 'Cadastrar',
      },
    });

    if (category) {
      const categoryAlreadyExists = this.categories.filter(
        (c) => c.name.toLowerCase() === category.name.toLowerCase()
      );
      if (categoryAlreadyExists.length > 0) {
        this.utilsService.onError(
          'Já existe uma categoria cadastrada com esse nome.'
        );
        return;
      }

      this.insert(category);
    }
  }

  async editDialog(category: Category) {
    const result = await this.utilsService.openDialog({
      component: CategoryDetailComponent,
      data: {
        action: 'Editar',
        category,
      },
    });

    if (result?.removeId && typeof result.removeId == 'number') {
      this.remove(result.removeId);
    }

    if (result?.name) {
      this.edit(category.id, result);
    }
  }

  private insert(category: Category) {
    this.categoryService.create(category).subscribe({
      next: (category) => {
        this.snackbarService.open('Categoria cadastrada com sucesso!');
        this.getCategories();
      },
      error: (err) => {
        this.utilsService.onError(
          err.error.message ?? 'Erro ao inserir categoria'
        );
      },
    });
  }

  private edit(id: number, category: Category) {
    this.categoryService.edit(id, category).subscribe({
      next: () => {
        this.snackbarService.open('Categoria atualizada com sucesso!');
        this.getCategories();
      },
      error: (err) => {
        this.utilsService.onError(
          err.error.message ?? 'Erro ao atualizar categoria'
        );
      },
    });
  }

  private remove(id: number) {
    this.categoryService.delete(id).subscribe({
      next: () => {
        this.snackbarService.open('Categoria deletada com sucesso!');
        this.getCategories();
      },
      error: (err) => {
        this.utilsService.onError(
          err.error.message ?? 'Erro ao deletar categoria'
        );
      },
    });
  }
}
