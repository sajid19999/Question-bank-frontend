import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

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

@Injectable({
  providedIn: 'root',
})
export class MembershipService {
  private apiUrl = 'http://79.72.87.78:8080/api/auth';
  private paymentApiUrl = 'http://localhost:8080/api/payment';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  // Add this error handling method
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      console.error('An error occurred:', error.error.message);
    } else {
      // Backend returned an unsuccessful response code
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`);
    }
    // Return an observable with a user-facing error message
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  // Method to handle user login
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
      responseType: 'text' // Important for handling redirect URLs
    }).pipe(
      map(response => {
        try {
          // Try to parse as JSON (for success messages)
          return JSON.parse(response);
        } catch (e) {
          // If not JSON, assume it's a redirect URL
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
}