import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import{ jwtDecode}from 'jwt-decode';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
   apiUrl = 'http://localhost:8080/api/auth';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private isBrowser: boolean;
  private userInfoSubject = new BehaviorSubject<any>(null); // Store decoded user info
  public userInfo$ = this.userInfoSubject.asObservable(); // Expose user info as observable

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.checkInitialAuthState();
  }

  private checkInitialAuthState(): void {
    if (this.isBrowser) {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = jwtDecode(token);
        this.userInfoSubject.next(decodedToken); // Store decoded token
      }
      this.isAuthenticatedSubject.next(!!token);
    }
  }

  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  
    return this.http.post<{ token: string }>(
      `${this.apiUrl}/login`, 
      { email, password },
      { headers, observe: 'response' } // Add observe: 'response' to get full response
    ).pipe(
      map((response: any) => {
        if (!response.body?.token) {
          throw new Error('No token received');
        }
        this.setToken(response.body.token);
        console.log("the token 57 : ",this.getToken);
        console.log("the token 58 : ",response.body);
        return response.body;
      }),
      catchError((error) => {
        console.error('Full error:', error);
        // Handle different error cases
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          return throwError(() => 'Network error. Please check your connection.');
        } else {
          // Server-side error
          const serverError = error.error?.message || 
                            error.error?.error || 
                            error.message || 
                            'Login failed. Please try again.';
          return throwError(() => serverError);
        }
      })
    );
  }
  // Check if the user is logged in
  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getUserInfo(): any {
    return this.userInfoSubject.value; // Get decoded user info
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('token');
    }
    this.isAuthenticatedSubject.next(false);
    this.userInfoSubject.next(null); // Clear user info
    this.router.navigate(['/']);
  }

  setToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem('token', token);
  
      // Decode the token and store user info
      const decodedToken = jwtDecode(token);
      console.log('Decoded Token in AuthService:', decodedToken); // Log the decoded token
  
      this.userInfoSubject.next(decodedToken); // Store decoded token
    }
    this.isAuthenticatedSubject.next(true);
  }
  // Get the token from localStorage
  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('token');
    }
    return null;
  }
  // Forgot password functionality
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email }).pipe(
      catchError((error) => {
        return throwError(() => new Error(error.error?.error || 'Failed to send password reset email'));
      })
    );
  }

  // Reset password functionality
  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { token, newPassword }).pipe(
      catchError((error) => {
        return throwError(() => new Error(error.error?.error || 'Failed to reset password'));
      })
    );
  }
  // Add this to your AuthService
getUserEmail(): string | null {
  if (this.isBrowser) {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        return decodedToken.sub || null;
      } catch (e) {
        console.error('Error decoding token:', e);
        return null;
      }
    }
  }
  return null;
}
getUserAccess(): { 
  hasAccountsAndFinanceAccess: boolean, 
  hasInvestmentBankingAccess: boolean, 
  hasSalesAndTradingAccess: boolean 
} | null {
  if (!this.isBrowser) return null;
  
  const token = this.getToken();
  if (!token) return null;

  try {
    const decodedToken: any = jwtDecode(token);
    return {
      hasAccountsAndFinanceAccess: decodedToken.hasAccountsAndFinanceAccess || false,
      hasInvestmentBankingAccess: decodedToken.hasInvestmentBankingAccess || false,
      hasSalesAndTradingAccess: decodedToken.hasSalesAndTradingAccess || false
    };
  } catch (e) {
    console.error('Error decoding token:', e);
    return null;
  }
}
}