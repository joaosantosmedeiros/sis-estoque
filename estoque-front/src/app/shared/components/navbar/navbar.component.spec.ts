import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UtilsService } from '../../services/utils.service';
import { AccountService } from '../../../pages/account/service/account.service';
import { SnackbarService } from '../../services/snackbar.service';
import { of, throwError } from 'rxjs';
import { AccountRequest } from '../../models/account.request';
import { Account } from '../../models/account';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let utilsServiceSpy: jasmine.SpyObj<UtilsService>;
  let accountServiceSpy: jasmine.SpyObj<AccountService>;
  let snackbarServiceSpy: jasmine.SpyObj<SnackbarService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout'], {
      isLoggedIn$: of(true),
      isAdmin$: of(false),
    });
    utilsServiceSpy = jasmine.createSpyObj('UtilsService', ['openDialog', 'onError']);
    accountServiceSpy = jasmine.createSpyObj('AccountService', ['edit']);
    snackbarServiceSpy = jasmine.createSpyObj('SnackbarService', ['open']);

    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: UtilsService, useValue: utilsServiceSpy },
        { provide: AccountService, useValue: accountServiceSpy },
        { provide: SnackbarService, useValue: snackbarServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              root: {},
              routerState: {},
              paramMap: { get: () => null },
              queryParamMap: { get: () => null },
            },
            params: of({}),
            queryParams: of({}),
            data: of({}),
            url: of([]),
          },
        },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize isLoggedIn$ and isAdmin$', (done) => {
    component.isLoggedIn$.subscribe((val) => {
      expect(val).toBeTrue();
      done();
    });
  });

  it('should call logout and navigate to home', () => {
    component.logout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });

  it('should call editAccountDialog and call edit if dialog returns result', async () => {
    const mockResult: AccountRequest = {
      name: 'Test',
      password: '123',
      confirmPassword: '123',
    };

    utilsServiceSpy.openDialog.and.resolveTo(mockResult);
    const editSpy = spyOn<any>(component, 'edit');

    await component.editAccountDialog();

    expect(utilsServiceSpy.openDialog).toHaveBeenCalled();
    expect(editSpy).toHaveBeenCalledWith(mockResult);
  });

  it('should not call edit if dialog returns null', async () => {
    utilsServiceSpy.openDialog.and.resolveTo(null);
    const editSpy = spyOn<any>(component, 'edit');

    await component.editAccountDialog();

    expect(utilsServiceSpy.openDialog).toHaveBeenCalled();
    expect(editSpy).not.toHaveBeenCalled();
  });

  it('should handle successful account update in edit()', () => {
    const mockRequest: AccountRequest = {
      name: 'Test',
      password: '123',
      confirmPassword: '123',
    };
    const mockAccount: Account = {
      id: 0,
      isActive: true,
      name: '',
      userType: 0,
    };

    accountServiceSpy.edit.and.returnValue(of());
    const logoutSpy = spyOn(component, 'logout');
    accountServiceSpy.edit.and.returnValue(of(mockAccount));
    (component as any).edit(mockRequest);

    expect(accountServiceSpy.edit).toHaveBeenCalledWith(mockRequest);
    expect(snackbarServiceSpy.open).toHaveBeenCalledWith('Conta atualizada com sucesso! Realize o login novamente.');
    expect(logoutSpy).toHaveBeenCalled();
  });

  it('should handle error in account update in edit()', () => {
    const mockRequest: AccountRequest = {
      name: 'Test',
      password: '123',
      confirmPassword: '123',
    };

    accountServiceSpy.edit.and.returnValue(throwError(() => ({ error: { message: 'Erro personalizado' } })));

    (component as any).edit(mockRequest);

    expect(utilsServiceSpy.onError).toHaveBeenCalledWith('Erro personalizado');
  });
});
