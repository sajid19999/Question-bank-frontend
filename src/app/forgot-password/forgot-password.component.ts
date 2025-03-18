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
  selector: 'app-forgot-password',
  standalone:true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  email: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.forgotPassword(this.email).subscribe({
      next: () => {
        alert('Password reset email sent. Please check your inbox.');
        this.router.navigate(['/login']);
      },
      error: (err: HttpErrorResponse) => {
              console.error('Error:', err);
              alert('Failed to send mail');
            },
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}