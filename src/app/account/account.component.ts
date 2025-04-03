import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatSpinner } from '@angular/material/progress-spinner';
import { MatChipListbox } from '@angular/material/chips';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

type MembershipCategory = 'ACCOUNTS_AND_FINANCE' | 'INVESTMENT_AND_BANKING' | 'SALES_AND_TRADING' | 'BUNDLE';
type MembershipType = 'BASIC' | 'PRO';
type BillingPeriod = 'MONTHLY' | 'YEARLY';

interface PricingInfo {
  monthly: string;
  yearly: string;
}

interface PricingStructure {
  [category: string]: {
    [type in MembershipType]?: PricingInfo;
  };
}

interface Membership {
  membershipType: string;
  exiprationDate: string;
  displayName?: string;
  isActive?: boolean;
  price?: string;
  billingPeriod?: string;
  category?: string;
}

interface UserInfo {
  username: string;
  email: string;
  category?: string;
  membership?: Membership[];
  attemptedQuestionList?: any[];
}

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatIconModule, 
    MatButtonModule, 
    MatListModule,
    MatSpinner,
    MatExpansionModule,
    MatChipsModule,  // This is the correct import
    MatTooltipModule
  ],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  providers: [DatePipe]
})
export class AccountComponent implements OnInit {
  user: UserInfo = {
    username: '',
    email: '',
    attemptedQuestionList: []
  };
  
  memberships: Membership[] = [];
  activeMemberships: Membership[] = [];
  expiredMemberships: Membership[] = [];
  hasBundle: boolean = false;
  isLoading: boolean = true;
  error: string | null = null;
  panelOpenState = false;

  private pricingData: PricingStructure = {
    'ACCOUNTS_AND_FINANCE': {
      'PRO': { monthly: '£9.99/month', yearly: '£7.90/month' }
    },
    'INVESTMENT_AND_BANKING': {
      'PRO': { monthly: '£9.99/month', yearly: '£7.90/month' }
    },
    'SALES_AND_TRADING': {
      'PRO': { monthly: '£9.99/month', yearly: '£7.90/month' }
    },
    'BUNDLE': {
      'PRO': { monthly: '£14.99/month', yearly: '£9.99/month' }
    }
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private datePipe: DatePipe,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    const email = this.authService.getUserEmail();
    if (!email) {
      this.error = 'Unable to retrieve user email';
      this.isLoading = false;
      return;
    }

    this.fetchUserDetails(email);
  }

  private fetchUserDetails(email: string): void {
    this.http.post<any>(`${this.authService.apiUrl}/user-info`, { email })
      .pipe(
        catchError((error: any) => {
          console.error('Error fetching user details:', error);
          this.handleError(error);
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (response) => {
          this.processUserData(response);
          this.isLoading = false;
        },
        error: (err) => {
          this.handleError(err);
          this.isLoading = false;
        }
      });
  }

  private handleError(error: any): void {
    let errorMessage = 'Failed to load user data';
    
    if (error.status === 400) {
      errorMessage = 'Invalid request format';
    } else if (error.status === 404) {
      errorMessage = 'User not found';
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    }

    this.error = errorMessage;
  }
  
  private processUserData(userData: UserInfo): void {
    this.user = {
      username: userData.username || 'N/A',
      email: userData.email || 'N/A',
      attemptedQuestionList: userData.attemptedQuestionList || [],
      membership: userData.membership || []
    };

    this.processMemberships(userData.membership || []);
  }

  private processMemberships(memberships: Membership[]): void {
    if (!memberships || memberships.length === 0) {
      // Add free membership if no memberships exist
      this.memberships = [{
        membershipType: 'FREE',
        exiprationDate: '',
        displayName: 'Free Membership',
        isActive: true,
        price: 'Free',
        billingPeriod: 'N/A',
        category: 'Free Access'
      }];
      return;
    }

    this.memberships = memberships.map(membership => {
      const parsed = this.parseMembershipType(membership.membershipType);
      const isActive = this.isMembershipActive(membership.exiprationDate);
      const priceInfo = this.getPriceInfo(parsed.category, parsed.isYearly);
      
      return {
        ...membership,
        displayName: this.getDisplayName(parsed.category, parsed.isYearly),
        isActive,
        price: priceInfo,
        billingPeriod: parsed.isYearly ? 'Yearly' : 'Monthly',
        category: parsed.category.replace(/_/g, ' ').replace('AND', '&')
      };
    });

    // Check for bundle
    this.hasBundle = this.memberships.some(m => m.membershipType.includes('BUNDLE'));
    
    // Separate active and expired memberships
    this.activeMemberships = this.memberships.filter(m => m.isActive);
    this.expiredMemberships = this.memberships.filter(m => !m.isActive);
  }

  private parseMembershipType(membershipType: string): {
    category: MembershipCategory,
    isYearly: boolean
  } {
    const parts = membershipType.split('_');
    let category: MembershipCategory = 'ACCOUNTS_AND_FINANCE';
    let isYearly = false;

    if (parts.length >= 2) {
      if (parts[0] === 'BUNDLE') {
        category = 'BUNDLE';
        isYearly = parts[parts.length - 1] === 'YEARLY';
      } else {
        category = parts.slice(0, -1).join('_') as MembershipCategory;
        isYearly = parts[parts.length - 1] === 'YEARLY';
      }
    }

    return { category, isYearly };
  }

  private getDisplayName(category: MembershipCategory, isYearly: boolean): string {
    const categoryName = category === 'BUNDLE' ? 'All Categories Bundle' : 
      category.replace(/_/g, ' ').replace('AND', '&');
    return `${categoryName} (${isYearly ? 'Yearly' : 'Monthly'})`;
  }

  private getPriceInfo(category: MembershipCategory, isYearly: boolean): string {
    const categoryPricing = this.pricingData[category];
    if (!categoryPricing) return 'N/A';
    
    const typePricing = categoryPricing['PRO']; // Assuming all paid memberships are PRO
    if (!typePricing) return 'N/A';
    
    return isYearly ? typePricing.yearly : typePricing.monthly;
  }

  private isMembershipActive(expirationDate: string): boolean {
    if (!expirationDate) return true;
    return new Date(expirationDate) > new Date();
  }

  getMembershipStatus(expirationDate: string): string {
    if (!expirationDate) return 'Active';
    return new Date(expirationDate) > new Date() ? 'Active' : 'Expired';
  }

  formatDate(date: string): string {
    if (!date) return 'N/A';
    return this.datePipe.transform(date, 'mediumDate') || 'N/A';
  }

  getCategoryColor(category: string): string {
    if (category.includes('Bundle')) return 'primary';
    if (category.includes('Account')) return 'accent';
    if (category.includes('Investment')) return 'warn';
    return '';
  }

  changePassword(): void {
    this.router.navigate(['/forgot-password']);
  }

  logOut(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  changeMembership(): void {
    this.router.navigate(['/pricing-details']);
  }

  cancelMembership(): void {
    this.router.navigate(['/contact'], {
      queryParams: { reason: 'membership-cancellation' }
    });
  }
}