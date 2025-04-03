import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface DiscountValidationResponse {
  valid: boolean;
  discountedMonthly?: string;
  discountedYearly?: string;
  message?: string;
}

interface User {
  username: string;
  email: string;
  password: string;
  category: string;
  membershipType: string;
  productId: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface ApiResponse {
  status: string;
  message?: string;
  redirectUrl?: string;
  user?: any;
}

interface UserInfo {
  username: string;
  email: string;
  membership?: Array<{
    membershipType: string;
    exiprationDate: string;
  }>;
  category?: string;
}

@Injectable({
  providedIn: 'root',
})
export class MembershipService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private paymentApiUrl = 'http://localhost:8080/api/payment';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}
  
  // Add this method to get user info
  getUserInfo(email: string): Observable<UserInfo> {
    return this.http.post<UserInfo>(`${this.apiUrl}/user-info`, { email }, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  validateDiscount(code: string): Observable<DiscountValidationResponse> {
    return this.http.post<DiscountValidationResponse>('/api/validate-discount', { code });
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  login(email: string, password: string): Observable<ApiResponse> {
    const credentials: LoginCredentials = { email, password };
    return this.http.post<ApiResponse>(`${this.apiUrl}/login`, credentials, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  registerUser(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'text'
    }).pipe(
      map(response => {
        try {
          return JSON.parse(response);
        } catch (e) {
          return { redirectUrl: response };
        }
      }),
      catchError(this.handleError)
    );
  }

  createCheckoutSession(email: string, membershipType: string, productId: string): Observable<any> {
    const request = { email, membershipType, productId };
    return this.http.post(`${this.paymentApiUrl}/create-checkout-session`, request, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  verifyPayment(sessionId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-payment`, { sessionId }, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Add upgradeMembership method
  upgradeMembership(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/upgrade-membership`, userData, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
}
