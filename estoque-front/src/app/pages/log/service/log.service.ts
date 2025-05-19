import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Log } from '../../../shared/models/log';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  private readonly logBaseUrl = 'http://localhost:3000/log';

  constructor(private readonly http: HttpClient) {}

  list(): Observable<Log[]> {
    return this.http.get<Log[]>(this.logBaseUrl);
  }

  findById(id: number): Observable<Log> {
    return this.http.get<Log>(this.logBaseUrl, { params: { id } });
  }

  findByStock(id: number): Observable<Log[]> {
    return this.http.get<Log[]>(this.logBaseUrl + `/byStock/${id}`);
  }
}
