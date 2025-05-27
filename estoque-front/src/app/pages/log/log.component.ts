import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UtilsService } from '../../shared/services/utils.service';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';
import { Log } from '../../shared/models/log';
import { ViewProductComponent } from '../product/view-product/view-product.component';
import { StockService } from '../product/service/stock.service';
import { LogService } from './service/log.service';
import { Stock } from '../../shared/models/stock';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-log',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatTableModule,
    DatePipe,
  ],
  templateUrl: './log.component.html',
  styleUrl: './log.component.scss',
})
export class LogComponent implements OnInit {
  form!: FormGroup;
  @ViewChild('productInput') productInput!: ElementRef<HTMLInputElement>;

  stocks: Stock[] = [];
  filteredStocks: Stock[] = [];
  logs: Log[] = [];

  displayedColumns: string[] = [
    'position',
    'product',
    'account',
    'quantity',
    'date',
  ];

  constructor(
    private readonly stockService: StockService,
    private readonly utilsService: UtilsService,
    private readonly logService: LogService
  ) {}

  ngOnInit(): void {
    this.getLogs();
    this.getStocks();
    this.createForm();
  }

  getLogs(): void {
    this.logService.list().subscribe({
      next: (logs) => (this.logs = logs),
      error: (err) =>
        this.utilsService.onError(
          err.error?.message ?? 'Erro ao carregar logs!'
        ),
    });
  }

  getStocks(): void {
    this.stockService.list().subscribe({
      next: (stocks) => {
        this.stocks = stocks;
        this.filteredStocks = stocks;
      },
      error: (err) =>
        this.utilsService.onError(
          err.error?.message ?? 'Erro ao carregar produtos!'
        ),
    });
  }

  createForm(): void {
    this.form = new FormGroup({
      stock: new FormControl(),
    });
  }

  async viewDialog(log: any) {
    await this.utilsService.openDialog({
      component: ViewProductComponent,
      data: {
        log,
      },
    });
  }

  search() {
    if (this.stock.value?.id) {
      this.logService.findByStock(this.stock.value.id).subscribe({
        next: (logs) => {
          this.logs = logs;
        },
        error: (err) =>
          this.utilsService.onError(
            err.error?.message ?? 'Erro ao listar logs!'
          ),
      });
    } else {
      this.getLogs();
    }
  }

  clearSearch() {
    this.form.reset();
    this.getLogs();
  }

  get stock() {
    return this.form.get('stock')!;
  }

  filter(): void {
    const value = this.productInput.nativeElement.value.trim().toLowerCase();
    this.filteredStocks = this.stocks.filter((stock) =>
      stock.product.name.toLowerCase().includes(value)
    );
  }

  displayStock(stock: Stock) {
    return stock?.product?.name ?? '';
  }
}
