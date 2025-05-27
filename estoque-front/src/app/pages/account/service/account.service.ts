import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Account } from '../../../shared/models/account';
import { AccountRequest } from '../../../shared/models/account.request';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly baseUrl = 'http://localhost:3000/account';

  constructor(private readonly http: HttpClient) {}

  list(): Observable<Account[]> {
    return this.http.get<Account[]>(this.baseUrl + '/all');
  }

  findLoggedAccount(): Observable<Account> {
    return this.http.get<Account>(this.baseUrl);
  }

  create(account: Account) {
    return this.http.post<Account>(this.baseUrl, account);
  }

  edit(request: AccountRequest): Observable<Account> {
    return this.http.put<Account>(this.baseUrl, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.baseUrl + `/${id}`);
  }
}
