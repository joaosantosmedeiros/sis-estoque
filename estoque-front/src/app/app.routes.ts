import { Routes } from '@angular/router';
import { CategoryComponent } from './pages/category/category.component';
import { ProductComponent } from './pages/product/product.component';
import { LogComponent } from './pages/log/log.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { adminGuard } from './guards/admin.guard';
import { AccountComponent } from './pages/account/account.component';

export const routes: Routes = [
  { component: HomeComponent, path: '' },
  { component: CategoryComponent, path: 'category', canActivate: [authGuard] },
  { component: ProductComponent, path: 'product', canActivate: [authGuard] },
  { component: LogComponent, path: 'log', canActivate: [authGuard] },
  { component: AccountComponent, path: 'account', canActivate: [adminGuard] },
  { component: LoginComponent, path: 'login' },
];
