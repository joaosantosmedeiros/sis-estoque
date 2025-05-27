import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Authentication } from '../models/auth';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:3000/auth/login';
  private readonly tokenKey = 'access_token';
  private readonly userTypeKey = 'user_type';
  private readonly platformId = inject(PLATFORM_ID);

  private readonly isLoggedInSubject = new BehaviorSubject<boolean>(
    this.hasToken()
  );
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  private readonly isAdminSubject = new BehaviorSubject<boolean>(
    this.isAdmin()
  );
  public isAdmin$ = this.isAdminSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  login(credentials: {
    name: string;
    password: string;
  }): Observable<Authentication> {
    return this.http.post<Authentication>(`${this.apiUrl}`, credentials);
  }

  saveToken(token: string) {
    if (!this.isBrowser()) return;
    localStorage.setItem(this.tokenKey, token);
    this.isLoggedInSubject.next(true);
  }

  saveUserType(userType: number) {
    if (!this.isBrowser()) return;
    localStorage.setItem(this.userTypeKey, userType.toString());
    this.isAdminSubject.next(userType == 0 || false);
  }

  getToken() {
    if (!this.isBrowser()) return;
    return localStorage.getItem(this.tokenKey);
  }

  getUserType() {
    if (!this.isBrowser()) return;
    return localStorage.getItem(this.userTypeKey);
  }

  logout() {
    if (!this.isBrowser()) return;
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userTypeKey);
    this.isLoggedInSubject.next(false);
    this.isAdminSubject.next(false);
  }

  private hasToken(): boolean {
    if (!this.isBrowser()) return false;
    return !!localStorage.getItem(this.tokenKey);
  }

  private isAdmin(): boolean {
    if (!this.isBrowser()) return false;
    return localStorage.getItem(this.userTypeKey) == "0";
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
