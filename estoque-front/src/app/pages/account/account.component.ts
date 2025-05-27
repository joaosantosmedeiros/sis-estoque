import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject, model } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { AuthService } from '../../shared/services/auth.service';
import { AccountService } from './service/account.service';
import { Observable } from 'rxjs';
import { Account } from '../../shared/models/account';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { UtilsService } from '../../shared/services/utils.service';
import { AccountDetailComponent } from './account-detail/account-detail.component';
import { MessageDialogConfirmComponent } from '../../shared/components/message-dialog-confirm/message-dialog-confirm.component';

@Component({
  selector: 'app-account',
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
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent {
  isAdmin: Observable<boolean>;

  constructor(
    private readonly authService: AuthService,
    private readonly accountService: AccountService,
    private readonly snackbarService: SnackbarService,
    private readonly utilsService: UtilsService
  ) {
    this.isAdmin = this.authService.isAdmin$;
  }

  readonly onlyActives = model(true);

  displayedColumns = ['position', 'name', 'isAdmin', 'isActive', 'actions'];
  accounts: Account[] = [];
  filteredAccounts: Account[] = [];

  dialog = inject(MatDialog);

  form!: FormGroup;

  toggleIsActive() {
    if (this.onlyActives()) {
      this.filteredAccounts = this.filteredAccounts.filter(
        (account) => account.isActive
      );
    } else {
      const value = this.form.get('name')?.value;
      this.filteredAccounts = this.accounts.filter((account) =>
        account.name.toLowerCase().includes(value?.trim().toLowerCase())
      );
    }
  }

  ngOnInit() {
    this.getAccounts();
    this.createForm();
  }

  createForm(): void {
    this.form = new FormGroup({
      name: new FormControl(''),
    });

    this.form.get('name')?.valueChanges.subscribe((value) => {
      if (value) {
        this.filteredAccounts = this.accounts.filter((account) =>
          account.name.toLowerCase().includes(value.trim().toLowerCase())
        );
      } else {
        this.filteredAccounts = this.accounts;
      }
      if (this.onlyActives())
        this.filteredAccounts = this.filteredAccounts.filter((c) => c.isActive);
    });
  }

  getAccounts(): void {
    this.accountService.list().subscribe((accounts) => {
      this.accounts = accounts;
      this.filteredAccounts = this.onlyActives()
        ? accounts.filter((c) => c.isActive)
        : accounts;
    });
  }

  clearSearch(): void {
    this.form.get('name')?.reset();
    this.filteredAccounts = this.accounts;
    this.onlyActives.set(false);
  }

  async insertDialog() {
    const account = await this.utilsService.openDialog({
      component: AccountDetailComponent,
      data: {
        action: 'Cadastrar',
      },
    });

    if (account) {
      const accountAlreadyExists = this.accounts.filter(
        (acc) => acc.name.toLowerCase() === account.name.toLowerCase()
      );
      if (accountAlreadyExists.length > 0) {
        this.utilsService.onError(
          'Já existe uma conta cadastrada com esse nome.'
        );
        return;
      }

      this.insert(account);
    }
  }

  private insert(account: Account) {
    this.accountService.create(account).subscribe({
      next: (account) => {
        this.snackbarService.open('Conta cadastrada com sucesso!');
        this.getAccounts();
      },
      error: (err) => {
        this.utilsService.onError(err.error.message ?? 'Erro ao inserir conta');
      },
    });
  }

  async remove(id: number) {
    const result = await this.utilsService.openDialog({
      component: MessageDialogConfirmComponent,
      data: 'Deseja realmente deletar essa conta?',
    });

    if (!result) return;

    this.accountService.delete(id).subscribe({
      next: () => {
        this.snackbarService.open('Conta deletada com sucesso!');
        this.getAccounts();
      },
      error: (err) => {
        this.utilsService.onError(err.error.message ?? 'Erro ao deletar conta');
      },
    });
  }
}
