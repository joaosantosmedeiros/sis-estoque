import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../../../shared/models/category';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly categoryBaseUrl = 'http://localhost:3000/category';

  constructor(private readonly http: HttpClient) {}

  list(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoryBaseUrl);
  }

  findById(id: number): Observable<Category> {
    return this.http.get<Category>(this.categoryBaseUrl, { params: { id } });
  }

  create(category: Category) {
    return this.http.post<Category>(this.categoryBaseUrl, category);
  }

  edit(id: number, category: Category): Observable<Category> {
    return this.http.put<Category>(this.categoryBaseUrl + `/${id}`, category);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.categoryBaseUrl + `/${id}`);
  }
}
