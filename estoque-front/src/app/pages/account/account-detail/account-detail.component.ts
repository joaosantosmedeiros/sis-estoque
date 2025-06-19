import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Account } from '../../../shared/models/account';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AccountService } from '../service/account.service';
import { UtilsService } from '../../../shared/services/utils.service';
import { passwordMatchValidator } from '../../../validators/password.validator';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-account-detail',
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    NgIf,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './account-detail.component.html',
  styleUrl: './account-detail.component.scss',
})
export class AccountDetailComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Optional()
    private readonly dialogRef: MatDialogRef<AccountDetailComponent>,
    private readonly accountService: AccountService,
    private readonly utilsService: UtilsService
  ) {}

  form!: FormGroup;
  account: Account | null = null;

  ngOnInit(): void {
    this.createForm();
    this.initiateData();
  }

  initiateData(): void {
    if (this.data.action != 'Editar') return;

    this.accountService.findLoggedAccount().subscribe({
      next: (account: Account) => {
        this.account = account;
        this.form.patchValue({
          name: account.name,
        });
      },
      error: (err: any) => {
        this.utilsService.onError('Erro ao encontrar conta!');
        this.dialogRef.close();
      },
    });
  }

  createForm(): void {
    this.form = new FormGroup(
      {
        name: new FormControl(this.account?.name ?? '', [Validators.required, Validators.maxLength(60)]),
        password: new FormControl('', [Validators.maxLength(60), Validators.minLength(8)]),
        confirmPassword: new FormControl('', [Validators.maxLength(60)]),
      },
      { validators: passwordMatchValidator() }
    );

    if (this.data.action == 'Cadastrar') {
      this.password.setValidators([Validators.required]);
      this.confirmPassword.setValidators([Validators.required]);
    }
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.dialogRef.close(this.form.getRawValue());
  }

  get name() {
    return this.form.get('name')!;
  }

  get password() {
    return this.form.get('password')!;
  }

  get confirmPassword() {
    return this.form.get('confirmPassword')!;
  }
}
