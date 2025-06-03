import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../../../shared/models/product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly productBaseUrl = 'http://localhost:3000/product';

  constructor(private readonly http: HttpClient) {}

  list(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productBaseUrl);
  }

  findById(id: number): Observable<Product> {
    return this.http.get<Product>(this.productBaseUrl, { params: { id } });
  }

  findByCategory(id: number): Observable<Product[]> {
    return this.http.get<Product[]>(this.productBaseUrl + `/byCategory/${id}`);
  }

  create(product: Product) {
    return this.http.post<Product>(this.productBaseUrl, product);
  }

  edit(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(this.productBaseUrl + `/${id}`, product);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.productBaseUrl + `/${id}`);
  }
}
