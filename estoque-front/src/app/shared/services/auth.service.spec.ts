import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Authentication } from '../models/auth';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const accessToken = 'fake-token';
  const authentication: Authentication = { accessToken, account: { id: 0, isActive: true, name: '', userType: 0 } };

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    localStorage.clear();
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call http POST login and return Authentication', () => {
    const credentials = { name: 'user', password: '123' };

    service.login(credentials).subscribe((res) => {
      expect(res).toEqual(authentication);
    });

    const req = httpMock.expectOne('http://localhost:3000/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);

    req.flush(authentication);
  });

  it('should saveToken in localStorage and emit isLoggedIn$', () => {
    let emittedValue = false;
    service.isLoggedIn$.subscribe((val) => (emittedValue = val));

    service.saveToken(accessToken);

    expect(localStorage.getItem('access_token')).toBe(accessToken);
    expect(emittedValue).toBeTrue();
  });

  it('should saveUserType in localStorage and emit isAdmin$', () => {
    let emittedAdmin = false;
    service.isAdmin$.subscribe((val) => (emittedAdmin = val));

    service.saveUserType(0);

    expect(localStorage.getItem('user_type')).toBe('0');
    expect(emittedAdmin).toBeTrue();

    service.saveUserType(1);
    expect(localStorage.getItem('user_type')).toBe('1');
  });

  it('should getToken and getUserType when browser', () => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('user_type', '0');

    expect(service.getToken()).toBe(accessToken);
    expect(service.getUserType()).toBe('0');
  });
});
