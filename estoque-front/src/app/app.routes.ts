import { Routes } from '@angular/router';
import { CategoryComponent } from './pages/category/category.component';
import { ProductComponent } from './pages/product/product.component';
import { LogComponent } from './pages/log/log.component';

export const routes: Routes = [
  { component: CategoryComponent, path: 'category' },
  { component: ProductComponent, path: 'product' },
  { component: LogComponent, path: 'log' },
];
