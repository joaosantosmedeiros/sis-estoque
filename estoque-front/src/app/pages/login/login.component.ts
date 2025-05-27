import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../shared/services/auth.service';
import { Authentication } from '../../shared/models/auth';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { Router } from '@angular/router';
import { UtilsService } from '../../shared/services/utils.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, FormsModule, MatInputModule, MatFormFieldModule, MatIconModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private readonly authService: AuthService,
    private readonly snackbarService: SnackbarService,
    private readonly router: Router,
    private readonly utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    this.createForm();

    if (localStorage.getItem('access_token')) this.router.navigate(['/']);
  }

  createForm() {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    const { name, password } = this.form.getRawValue();

    this.authService.login({ name, password }).subscribe({
      next: (authentication: Authentication) => {
        this.authService.saveToken(authentication.accessToken);
        this.authService.saveUserType(authentication.account.userType);
        this.snackbarService.open('Usuário autenticado com sucesso!');
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.utilsService.onError('Erro ao autenticar usuário');
      },
    });
  }

  get name() {
    return this.form.get('name')!;
  }

  get password() {
    return this.form.get('password')!;
  }
}
