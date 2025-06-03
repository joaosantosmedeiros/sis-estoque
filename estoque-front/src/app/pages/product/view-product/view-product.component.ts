import { Component, Inject, OnInit, Optional } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Product } from '../../../shared/models/product';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UtilsService } from '../../../shared/services/utils.service';
import { StockService } from '../service/stock.service';
import { Stock } from '../../../shared/models/stock';

@Component({
  selector: 'app-view-product',
  imports: [MatDialogModule, MatIcon, MatButtonModule],
  templateUrl: './view-product.component.html',
  styleUrl: './view-product.component.scss',
})
export class ViewProductComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Optional() private readonly dialogRef: MatDialogRef<ViewProductComponent>,
    public utilsService: UtilsService,
    private readonly stockService: StockService
  ) {}

  product: Product | null = null;
  stock: Stock | null = null;

  ngOnInit(): void {
    this.initiateData();
    this.getStock();
  }

  initiateData(): void {
    this.product = this.data.product ?? null;
  }

  getStock(): void {
    if (!this.product) return;

    this.stockService.findByProduct(this.product.id).subscribe({
      next: (stock: Stock) => {
        this.stock = stock;
      },
      error: (err) => {
        this.utilsService.onError(
          err.error?.message ?? 'Erro ao carregar estoque!'
        );
      },
    });
  }
}
