import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MembershipService } from '../services/membership.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-membership-info-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
  ],
  templateUrl: './membership-info-page.component.html',
  styleUrls: ['./membership-info-page.component.css'],
})
export class MembershipInfoComponent {
  membershipForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  category = ''; // Selected category
  membershipType = ''; // Selected membership type
  monthlyPrice = ''; // Monthly price
  yearlyPrice = ''; // Yearly price
  isYearly: boolean = false; // Toggle state for yearly/monthly pricing

  constructor(
    private route: ActivatedRoute,
    private membershipService: MembershipService,
    private fb: FormBuilder
  ) {
    // Initialize the form
    this.membershipForm = this.fb.group(
      {
        username: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[a-zA-Z0-9_]+$/),
            Validators.minLength(3),
            Validators.maxLength(20),
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
            Validators.minLength(8),
          ],
        ],
        confirmPassword: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        confirmEmail: ['', Validators.required],
        agreeToTerms: [false, Validators.requiredTrue],
      },
      {
        validators: [this.passwordMatchValidator, this.emailMatchValidator],
      }
    );

    // Retrieve route parameters
    this.route.queryParams.subscribe((params) => {
      this.category = params['category'];
      this.membershipType = params['type'];
      this.monthlyPrice = params['monthlyPrice'];
      this.yearlyPrice = params['yearlyPrice'];
    });
  }

  // Custom validator for password match
  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  // Custom validator for email match
  emailMatchValidator(control: AbstractControl) {
    const email = control.get('email')?.value;
    const confirmEmail = control.get('confirmEmail')?.value;
    return email === confirmEmail ? null : { emailMismatch: true };
  }

  // Toggle between monthly and yearly pricing
  togglePricing() {
    this.isYearly = !this.isYearly;
  }

  onSubmit() {
    if (this.membershipForm.invalid) {
      return;
    }

    const user = {
      username: this.membershipForm.value.username,
      email: this.membershipForm.value.email,
      password: this.membershipForm.value.password,
      category: this.category,
      membershipType: this.membershipType,
      price: this.isYearly ? this.yearlyPrice : this.monthlyPrice,
    };

    this.membershipService.registerUser(user).subscribe({
      next: (response: any) => {
        alert('Registration successful!');
      },
      error: (error: any) => {
        alert('Registration failed: ' + error.error);
      },
    });
  }
}
