import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AccountDetailComponent } from './account-detail.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AccountService } from '../service/account.service';
import { UtilsService } from '../../../shared/services/utils.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('AccountDetailComponent', () => {
  let component: AccountDetailComponent;
  let fixture: ComponentFixture<AccountDetailComponent>;
  let accountServiceSpy: jasmine.SpyObj<AccountService>;
  let utilsServiceSpy: jasmine.SpyObj<UtilsService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<AccountDetailComponent>>;

  beforeEach(async () => {
    accountServiceSpy = jasmine.createSpyObj('AccountService', ['findLoggedAccount']);
    utilsServiceSpy = jasmine.createSpyObj('UtilsService', ['onError']);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [AccountDetailComponent, ReactiveFormsModule, FormsModule],
      providers: [
        { provide: AccountService, useValue: accountServiceSpy },
        { provide: UtilsService, useValue: utilsServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { action: 'Cadastrar' }, // ou 'Editar' conforme o teste
        },
      ],
    }).compileComponents();
  });

  function setAction(action: 'Editar' | 'Cadastrar') {
    TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: { action } });
    fixture = TestBed.createComponent(AccountDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('deve criar o componente', () => {
    setAction('Cadastrar');
    expect(component).toBeTruthy();
  });

  it('deve criar o formulário com validadores corretos ao cadastrar', () => {
    setAction('Cadastrar');
    expect(component.form).toBeDefined();
    expect(component.password.validator).toBeTruthy();
    expect(component.confirmPassword.validator).toBeTruthy();
  });

it('deve chamar accountService.findLoggedAccount se ação for "Editar"', fakeAsync(() => {
  const mockAccount = { name: 'João', password: 'senhaSegura', confirmPassword: 'senhaSegura' } as any;

  accountServiceSpy.findLoggedAccount.and.returnValue(of(mockAccount));

  setAction('Editar');
  tick();

  expect(accountServiceSpy.findLoggedAccount).toHaveBeenCalled();
  expect(component.account).toEqual(mockAccount);
  expect(component.name.value).toBe(mockAccount.name);
}));


  it('deve tratar erro ao buscar conta no modo "Editar"', fakeAsync(() => {
    accountServiceSpy.findLoggedAccount.and.returnValue(throwError(() => new Error('Erro')));

    setAction('Editar');
    tick();

    expect(utilsServiceSpy.onError).toHaveBeenCalledWith('Erro ao encontrar conta!');
    expect(dialogRefSpy.close).toHaveBeenCalled();
  }));

  it('deve fechar o diálogo com os dados ao submeter formulário válido', () => {
    setAction('Cadastrar');
    component.form.setValue({
      name: 'Usuário',
      password: 'senhaSegura',
      confirmPassword: 'senhaSegura',
    });

    component.submit();

    expect(dialogRefSpy.close).toHaveBeenCalledWith({
      name: 'Usuário',
      password: 'senhaSegura',
      confirmPassword: 'senhaSegura',
    });
  });

  it('não deve fechar o diálogo se o formulário for inválido', () => {
    setAction('Cadastrar');
    component.form.setValue({
      name: '',
      password: '',
      confirmPassword: '',
    });

    component.submit();

    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });
});
