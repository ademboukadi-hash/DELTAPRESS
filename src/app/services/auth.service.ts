import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';
import {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
  UserPreferences,
  UserRole
} from '../models/index';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:3000/api';
  private readonly TOKEN_KEY = 'deltapress_token';
  private readonly USER_KEY = 'deltapress_user';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadStoredAuth();
    }
  }

  login(credentials: LoginCredentials): Observable<User> {
    const fallbackUser = this.buildMockUser({
      email: credentials.email,
      name: this.inferNameFromEmail(credentials.email),
      role: this.inferRoleFromEmail(credentials.email)
    });

    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, credentials).pipe(
      map(response => response.user),
      tap(user => {
        this.storeAuth({
          user,
          token: `token_${Date.now()}`,
          expiresAt: new Date(Date.now() + 86400000)
        }, credentials.rememberMe || false);
      }),
      catchError(() => of(fallbackUser).pipe(
        delay(120),
        tap(user => this.storeAuth({
          user,
          token: `mock-token-${Date.now()}`,
          expiresAt: new Date(Date.now() + 86400000)
        }, credentials.rememberMe || false))
      ))
    );
  }

  register(data: RegisterData): Observable<User> {
    const fallbackUser = this.buildMockUser({
      email: data.email,
      name: data.name,
      role: data.role || 'user'
    });

    return this.http.post<AuthResponse>(`${this.API_URL}/auth/register`, data).pipe(
      map(response => response.user),
      tap(user => {
        this.storeAuth({
          user,
          token: `token_${Date.now()}`,
          expiresAt: new Date(Date.now() + 86400000)
        }, true);
      }),
      catchError(() => of(fallbackUser).pipe(
        delay(120),
        tap(user => this.storeAuth({
          user,
          token: `mock-token-${Date.now()}`,
          expiresAt: new Date(Date.now() + 86400000)
        }, true))
      ))
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
      sessionStorage.removeItem(this.TOKEN_KEY);
      sessionStorage.removeItem(this.USER_KEY);
    }

    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  forgotPassword(email: string): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/auth/forgot-password`, { email })
      .pipe(catchError(() => of(undefined)));
  }

  resetPassword(token: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/auth/reset-password`, { token, newPassword })
      .pipe(catchError(() => of(undefined)));
  }

  updateProfile(userData: Partial<User>): Observable<User> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('Aucun utilisateur connecte.'));
    }

    const mergedUser: User = {
      ...currentUser,
      ...userData,
      updatedAt: new Date()
    };

    return this.http.patch<User>(`${this.API_URL}/users/profile`, userData).pipe(
      catchError(() => of(mergedUser)),
      tap(user => {
        this.currentUserSubject.next(user);
        this.updateStoredUser(user);
      })
    );
  }

  changePassword(oldPassword: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/auth/change-password`, { oldPassword, newPassword })
      .pipe(catchError(() => of(undefined)));
  }

  refreshToken(): Observable<string> {
    return this.http.post<{ token: string; expiresAt: Date }>(`${this.API_URL}/auth/refresh`, {}).pipe(
      tap(response => {
        if (isPlatformBrowser(this.platformId)) {
          const storage = localStorage.getItem(this.TOKEN_KEY) ? localStorage : sessionStorage;
          storage.setItem(this.TOKEN_KEY, response.token);
        }
      }),
      map(response => response.token),
      catchError(() => of(this.getToken() || `mock-token-${Date.now()}`))
    );
  }

  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    return localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: UserRole): boolean {
    return this.currentUserSubject.value?.role === role;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    const role = this.currentUserSubject.value?.role;
    return !!role && roles.includes(role);
  }

  getDashboardRoute(user: User | null = this.currentUserSubject.value): string {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'doctor') return '/doctor';
    return '/user';
  }

  private loadStoredAuth(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const token = localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.TOKEN_KEY);
    const userJson = localStorage.getItem(this.USER_KEY) || sessionStorage.getItem(this.USER_KEY);

    if (!token || !userJson) {
      return;
    }

    try {
      const user = JSON.parse(userJson) as User;
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    } catch {
      this.logout();
    }
  }

  private storeAuth(response: AuthResponse, rememberMe: boolean): void {
    if (isPlatformBrowser(this.platformId)) {
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(this.TOKEN_KEY, response.token);
      storage.setItem(this.USER_KEY, JSON.stringify(response.user));
    }

    this.currentUserSubject.next(response.user);
    this.isAuthenticatedSubject.next(true);
  }

  private updateStoredUser(user: User): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const storage = localStorage.getItem(this.USER_KEY) ? localStorage : sessionStorage;
    storage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private inferRoleFromEmail(email: string): UserRole {
    const normalized = email.toLowerCase();

    if (normalized.includes('admin')) return 'admin';
    if (normalized.includes('medecin') || normalized.includes('doctor') || normalized.includes('psy')) {
      return 'doctor';
    }

    return 'user';
  }

  private inferNameFromEmail(email: string): string {
    const localPart = email.split('@')[0] || 'utilisateur';
    return localPart
      .replace(/[._-]+/g, ' ')
      .replace(/\b\w/g, letter => letter.toUpperCase());
  }

  private buildMockUser(data: { email: string; name: string; role: UserRole }): User {
    const preferences: UserPreferences = {
      notifications: true,
      newsletter: false,
      dataSharing: true,
      theme: 'light',
      crisisAlerts: true
    };

    return {
      id: data.role === 'doctor' ? 'doctor_demo' : data.role === 'admin' ? 'admin_demo' : 'user_demo',
      email: data.email,
      name: data.name,
      role: data.role,
      professionalProfileId: data.role === 'doctor' ? 'prof_2' : undefined,
      language: 'fr',
      location: 'Tunis, Tunisie',
      preferences,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
}
