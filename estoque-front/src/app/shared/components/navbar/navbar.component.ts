import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UtilsService } from '../../services/utils.service';
import { AccountDetailComponent } from '../../../pages/account/account-detail/account-detail.component';
import { AccountService } from '../../../pages/account/service/account.service';
import { AccountRequest } from '../../models/account.request';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, NgIf, MatMenuModule, MatButtonModule, MatIconModule, AsyncPipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly utilsService: UtilsService,
    private readonly accountService: AccountService,
    private readonly snackbarService: SnackbarService
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.isAdmin$ = this.authService.isAdmin$;
  }

  isLoggedIn$: Observable<boolean>;
  isAdmin$: Observable<boolean>;

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  async editAccountDialog() {
    const result = await this.utilsService.openDialog({
      component: AccountDetailComponent,
      data: {
        action: 'Editar',
      },
    });

    if (result) {
      this.edit(result);
    }
  }

  private edit(request: AccountRequest) {
    this.accountService.edit(request).subscribe({
      next: () => {
        this.snackbarService.open('Conta atualizada com sucesso! Realize o login novamente.');
        this.logout();
      },
      error: (err) => {
        this.utilsService.onError(err.error?.message ?? 'Erro ao atualizar conta!');
      },
    });
  }
}
