import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { MatIconModule } from '@angular/material/icon'; // Import MatIconModule for icons
import { MatInputModule } from '@angular/material/input'; // Import MatInputModule for input fields
import { MatFormFieldModule } from '@angular/material/form-field'; // Import MatFormFieldModule for form fields
import { MatButtonModule } from '@angular/material/button'; // Import MatButtonModule for buttons
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { HttpErrorResponse } from '@angular/common/http'; // Import HttpErrorResponse
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  providers: [AuthService], // Add AuthService to the providers array
})
export class ResetPasswordComponent implements OnInit {
  newPassword: string = '';
  confirmPassword: string = '';
  showPassword: boolean = false;
  passwordMismatch: boolean = false;
  token: string = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService, // Now Angular can inject AuthService
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
      if (!this.token) {
        alert('Invalid or missing reset token.');
        this.router.navigate(['/login']);
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.newPassword !== this.confirmPassword) {
      this.passwordMismatch = true;
      return;
    } else {
      this.passwordMismatch = false;
    }

    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: () => {
        alert('Password reset successfully. Please login with your new password.');
        this.router.navigate(['/login']);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error:', err);
        alert('Failed to reset password. Please try again.');
      },
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}