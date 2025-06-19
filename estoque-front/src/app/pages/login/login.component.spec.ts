import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../shared/services/auth.service';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { Router } from '@angular/router';
import { UtilsService } from '../../shared/services/utils.service';
import { of, throwError } from 'rxjs';
import { Authentication } from '../../shared/models/auth';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let snackbarServiceSpy: jasmine.SpyObj<SnackbarService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let utilsServiceSpy: jasmine.SpyObj<UtilsService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'saveToken', 'saveUserType']);
    snackbarServiceSpy = jasmine.createSpyObj('SnackbarService', ['open']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    utilsServiceSpy = jasmine.createSpyObj('UtilsService', ['onError']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule, FormsModule, MatInputModule, MatFormFieldModule, MatIconModule, MatButtonModule],
      declarations: [],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: SnackbarService, useValue: snackbarServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: UtilsService, useValue: utilsServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create form with controls name and password, both required', () => {
    component.ngOnInit();
    expect(component.form.contains('name')).toBeTrue();
    expect(component.form.contains('password')).toBeTrue();

    const nameControl = component.form.get('name');
    const passwordControl = component.form.get('password');

    expect(nameControl?.valid).toBeFalse();
    expect(passwordControl?.valid).toBeFalse();

    nameControl?.setValue('user');
    passwordControl?.setValue('123');

    expect(nameControl?.valid).toBeTrue();
    expect(passwordControl?.valid).toBeTrue();
  });

  it('should navigate to "/" in ngOnInit if access_token in localStorage', () => {
    localStorage.setItem('access_token', 'fake-token');
    component.ngOnInit();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should not submit if form is invalid', () => {
    component.ngOnInit();
    component.form.setValue({ name: '', password: '' });
    component.submit();
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('should submit and handle success response', () => {
    component.ngOnInit();
    const fakeAuth: Authentication = {
      accessToken: 'token',
      account: { id: 1, isActive: true, name: '', userType: 0 },
    };
    authServiceSpy.login.and.returnValue(of(fakeAuth));
    component.form.setValue({ name: 'user', password: '123' });

    component.submit();

    expect(authServiceSpy.login).toHaveBeenCalledWith({ name: 'user', password: '123' });
    expect(authServiceSpy.saveToken).toHaveBeenCalledWith('token');
    expect(authServiceSpy.saveUserType).toHaveBeenCalledWith(0);
    expect(snackbarServiceSpy.open).toHaveBeenCalledWith('Usuário autenticado com sucesso!');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should handle error response on submit', () => {
    component.ngOnInit();
    authServiceSpy.login.and.returnValue(throwError(() => new Error('fail')));
    component.form.setValue({ name: 'user', password: '123' });

    component.submit();

    expect(utilsServiceSpy.onError).toHaveBeenCalledWith('Erro ao autenticar usuário');
  });

  it('should return the forms fields correctly', () => {
    component.createForm();

    expect(component.name.value).toBe('');
    expect(component.password.value).toBe('');
  });
});
