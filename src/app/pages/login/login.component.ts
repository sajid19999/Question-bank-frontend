import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  loading: boolean = false;
  errorMessage: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.loading = true;
    this.errorMessage = '';
    
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password';
      this.loading = false;
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (response: any) => {
        const token = response.token || response;
        if (typeof token !== 'string') {
          throw new Error('Invalid token format');
        }
        
        const decoded = jwtDecode(token);
        console.log("Token in .ts 62 : ",response.token);
        console.log("Token in .ts 63 : ",decoded);
        console.log("Response in 64" , response);
        this.router.navigate(['/account'], {
          state: { userInfo: decoded }
        });
      },
      error: (err) => {
        console.error('Detailed error:', err);
        this.loading = false;
        
        // Handle different error cases
        if (err.status === 400) {
          this.errorMessage = 'Invalid email or password. Please try again.';
        } else if (err.status === 0) {
          this.errorMessage = 'Network error. Please check your connection.';
        } else {
          this.errorMessage = typeof err === 'string' ? err : 
                            err.error?.message || err.message || 'Login failed. Please try again.';
        }
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  navigateToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  navigateToSignup() {
    this.router.navigate(['/signup']);
  }
}