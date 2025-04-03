import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MembershipService } from '../services/membership.service';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule} from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

interface Membership {
  membershipType: string;
  exiprationDate: string;
}
interface UserInfo {
  username: string;
  email: string;
  membership?: Membership[];
  category?: string;
}
@Component({
  selector: 'app-membership-info-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSlideToggleModule,
  ],
  templateUrl: './membership-info-page.component.html',
  styleUrls: ['./membership-info-page.component.css'],
})
export class MembershipInfoComponent {
  membershipForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  showDiscountInput = false;
  discountCode = '';
  category = '';
  membershipType = '';
  monthlyPrice = '';
  yearlyPrice = '';
  isYearly = false;
  productId = '';
  isLoading = false;
  isExistingMember = false;
  currentMemberships: any[] = [];

  // Mock benefits data - replace with actual benefits from your service
  membershipBenefits: { [key: string]: string[] } = {
    'Investment & Banking_BASIC': [
      'Access to basic investment resources',
      'Monthly market analysis reports',
      'Community forum access'
    ],
    'Investment & Banking_PREMIUM': [
      'All Basic benefits',
      'Weekly expert webinars',
      'Portfolio review tools',
      'Exclusive research reports'
    ],
    'Sales & Trading_BASIC': [
      'Basic trading strategies',
      'Market trend analysis',
      'Community access'
    ],
    'Sales & Trading_PREMIUM': [
      'All Basic benefits',
      'Advanced trading tools',
      'Real-time alerts',
      'Mentorship program'
    ],
    'BUNDLE': [
      'Access to all categories',
      'Premium features in each area',
      'Cross-disciplinary resources',
      'Priority support'
    ]
  };

  constructor(
    private route: ActivatedRoute,
    private membershipService: MembershipService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
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

    this.checkUserMembership();
    this.route.queryParams.subscribe((params) => {
      this.category = params['category'];
      this.membershipType = params['type'];
      this.monthlyPrice = params['monthlyPrice'];
      this.yearlyPrice = params['yearlyPrice'];
      this.productId = params['productId'];
    });
  }

  async checkUserMembership() {
    const email = this.authService.getUserEmail();
  if (email) {
    try {
      const userInfo = await this.membershipService.getUserInfo(email).toPromise() as UserInfo;
      this.currentMemberships = this.parseMembership(userInfo?.membership?.[0]);
      
      // Set form email if available
      this.membershipForm.patchValue({ 
        email: userInfo.email,
        username: userInfo.username || ''
      });
    } catch (error) {
      console.error('Error loading membership:', error);
    }
  }
  }

  parseMembership(membership: any) {
    const parts = membership.membershipType.split('_');
    const isYearly = parts[parts.length - 1] === 'YEARLY';
    const category = parts.slice(0, -1).join('_').replace(/_/g, ' ');
    
    return {
      ...membership,
      category,
      isYearly,
      displayName: `${category} ${isYearly ? '(Yearly)' : '(Monthly)'}`,
      status: this.getMembershipStatus(membership.exiprationDate)
    };
  }

  getMembershipStatus(expirationDate: string): string {
    if (!expirationDate) return 'Active';
    return new Date(expirationDate) > new Date() ? 'Active' : 'Expired';
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  emailMatchValidator(control: AbstractControl) {
    const email = control.get('email')?.value;
    const confirmEmail = control.get('confirmEmail')?.value;
    return email === confirmEmail ? null : { emailMismatch: true };
  }

  togglePricing() {
    this.isYearly = !this.isYearly;
  }

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

  getBenefitsForMembership(): string[] {
    const key = `${this.category}_${this.membershipType.toUpperCase()}`;
    return this.membershipBenefits[key] || this.membershipBenefits['BUNDLE'] || [
      'Premium content access',
      'Expert resources',
      'Community features'
    ];
  }

  applyDiscount() {
    this.isLoading = true;
    this.membershipService.validateDiscount(this.discountCode).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.valid) {
          // Apply discount to price
        } else {
          // Show error message
        }
      },
      error: (error) => {
        this.isLoading = false;
        // Show error message
      }
    });
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
      productId: this.productId,
      discountCode: this.discountCode || null
    };
  
    if (this.isExistingMember) {
      this.upgradeMembership(userData);
    } else {
      this.registerNewMember(userData);
    }
  }

  private registerNewMember(userData: any) {
    this.membershipService.registerUser(userData).subscribe({
      next: (registerResponse: any) => {
        if (registerResponse.redirectUrl) {
          window.location.href = registerResponse.redirectUrl;
        } else {
          this.createStripeSession(userData.email, userData.membershipType, userData.productId);
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Registration error:', error);
      }
    });
  }

  private upgradeMembership(userData: any) {
    this.membershipService.upgradeMembership(userData).subscribe({
      next: (upgradeResponse: any) => {
        if (upgradeResponse.redirectUrl) {
          window.location.href = upgradeResponse.redirectUrl;
        } else {
          this.createStripeSession(userData.email, userData.membershipType, userData.productId);
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Upgrade error:', error);
      }
    });
  }

  private createStripeSession(email: string, membershipType: string, productId: string) {
    this.membershipService.createCheckoutSession(email, membershipType, productId).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response) {
          window.location.href = response;
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Stripe session error:', error);
      }
    });
  }

  navigateToPricing() {
    this.router.navigate(['/pricing-details']);
  }
}