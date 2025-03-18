import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, // Add CommonModule here
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

  constructor(private router: Router, private authService: AuthService) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.loading = true;
    console.log('Loading state:', this.loading); // Add this line to debug
  
    this.authService.login(this.email, this.password).subscribe({
      next: (response: { token: string }) => {
        this.authService.setToken(response.token);
        const userInfo = this.authService.getUserInfo();
        console.log('User Info after Login:', userInfo);
  
        const username = userInfo?.UserName;
        const email = userInfo?.sub;
        const membershipType = userInfo?.membershipType || 'BASIC';
  
        this.router.navigate(['/account'], {
          queryParams: {
            username: username,
            email: email,
            membershipType,
          },
        });
      },
      error: (err: any) => {
        console.error('Login failed. Error:', err);
        alert(err.error?.error || 'Invalid email or password');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  navigateToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}
