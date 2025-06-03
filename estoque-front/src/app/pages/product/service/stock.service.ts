import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Stock } from '../../../shared/models/stock';
import { StockRequest } from '../../../shared/models/stock.request';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  private readonly stockBaseUrl = 'http://localhost:3000/stock';

  constructor(private readonly http: HttpClient) {}

  list(): Observable<Stock[]> {
    return this.http.get<Stock[]>(this.stockBaseUrl);
  }

  findById(id: number): Observable<Stock> {
    return this.http.get<Stock>(this.stockBaseUrl, { params: { id } });
  }

  findByProduct(id: number): Observable<Stock> {
    return this.http.get<Stock>(this.stockBaseUrl + `/byProduct/${id}`);
  }

  create(stock: Stock) {
    return this.http.post<Stock>(this.stockBaseUrl, stock);
  }

  edit(id: number, stockRequest: StockRequest): Observable<Stock> {
    return this.http.put<Stock>(this.stockBaseUrl + `/${id}`, stockRequest);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.stockBaseUrl + `/${id}`);
  }
}
