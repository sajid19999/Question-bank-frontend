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
  productId = ''; // Product ID
  isLoading = false; // Loading state for form submission
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
      this.productId = params['productId']; // Retrieve the product ID

      // Log the retrieved parameters
      console.log('Route Parameters:', {
        category: this.category,
        membershipType: this.membershipType,
        monthlyPrice: this.monthlyPrice,
        yearlyPrice: this.yearlyPrice,
        productId: this.productId,
      });
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
    console.log('Pricing Toggled:', this.isYearly ? 'Yearly' : 'Monthly');
  }

  // Format the membership type based on the category and pricing
  formatMembershipType(): string {
    const categoryMapping: { [key: string]: string } = {
      'Investment & Banking': 'INVESTMENT_BANKING',
      'Sales & Trading': 'SALES_AND_TRADING',
      'Accounting & Finance': 'ACCOUNTING_AND_FINANCE',
    };

    const categoryKey = categoryMapping[this.category] || 'BASIC';
    const pricingType = this.isYearly ? 'YEARLY' : 'MONTHLY';

    if (this.membershipType === 'Bundle') {
      return `BUNDLE_${pricingType}`;
    } else {
      return `${categoryKey}_${pricingType}`;
    }
  }

  onSubmit() {
    if (this.membershipForm.invalid) {
      return;
    }
  
    this.isLoading = true;
  
    const userData = {
      username: this.membershipForm.value.username,
      email: this.membershipForm.value.email,
      password: this.membershipForm.value.password,
      category: this.category,
      membershipType: this.formatMembershipType(),
      productId: this.productId
    };
  
    this.membershipService.registerUser(userData).subscribe({
      next: (registerResponse: any) => {
        if (registerResponse.redirectUrl) {
          // If there's a redirect URL (legacy flow), use it
          window.location.href = registerResponse.redirectUrl;
        } else {
          // New flow: Create Stripe checkout session
          this.createStripeSession(userData.email, userData.membershipType, userData.productId);
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        alert(error.message || 'Registration failed');
        console.error('Registration error:', error);
      }
    });
  }

  private createStripeSession(email: string, membershipType: string, productId: string) {
    this.membershipService.createCheckoutSession(email, membershipType, productId).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response) {
          // Redirect to Stripe Checkout
          window.location.href = response;
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        alert('Failed to create payment session. Please try again.');
        console.error('Stripe session error:', error);
      }
    });
  }
}