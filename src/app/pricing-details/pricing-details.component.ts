import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../services/auth.service';
import { MembershipService } from '../services/membership.service';
export interface Plan {
  name: string;
  type: string; // 'Basic', 'Individual', or 'Bundle'
  monthlyPrice: string;
  yearlyPrice: string;
}

export interface Category {
  name: string;
  plans: Plan[];
}
interface Membership {
  membershipType: string;
  exiprationDate: string;
}

interface UserInfo {
  username: string;
  email: string;
  membership?: Membership[];
}
@Component({
  selector: 'app-pricing-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatExpansionModule,
    MatTableModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './pricing-details.component.html',
  styleUrls: ['./pricing-details.component.css']
})
export class PricingDetailsComponent {
  displayedColumns: string[] = ['plan', 'price', 'action'];
  isYearly: boolean = false;
  currentUserMemberships: string[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private membershipService: MembershipService
  ) {
    this.loadUserMemberships();
  }

  categories: Category[] = [
    {
      name: 'Investment & Banking',
      plans: [
        { name: 'Basic', type: 'Basic', monthlyPrice: 'Free', yearlyPrice: 'Free' },
        { name: 'Pro – Individual', type: 'Individual', monthlyPrice: '£9.99/month', yearlyPrice: '£7.90/month' },
      ],
    },
    {
      name: 'Sales & Trading',
      plans: [
        { name: 'Basic', type: 'Basic', monthlyPrice: 'Free', yearlyPrice: 'Free' },
        { name: 'Pro – Individual', type: 'Individual', monthlyPrice: '£9.99/month', yearlyPrice: '£7.90/month' },
      ],
    },
    {
      name: 'Accounting & Finance',
      plans: [
        { name: 'Basic', type: 'Basic', monthlyPrice: 'Free', yearlyPrice: 'Free' },
        { name: 'Pro – Individual', type: 'Individual', monthlyPrice: '£9.99/month', yearlyPrice: '£7.90/month' },
      ],
    },
  ];

  bundlePlan: Category = {
    name: 'All Categories Bundle',
    plans: [
      { name: 'Pro – Bundle', type: 'Bundle', monthlyPrice: '£14.99/month', yearlyPrice: '£9.99/month' }
    ]
  };

  private async loadUserMemberships() {
    const email = this.authService.getUserEmail();
    if (email) {
      try {
        const userInfo = await this.membershipService.getUserInfo(email).toPromise() as UserInfo;
        this.currentUserMemberships = userInfo?.membership?.map((m: Membership) => m.membershipType) || [];
      } catch (error) {
        console.error('Error loading user memberships:', error);
      }
    }
  }

  togglePricing(newValue: boolean) {
    this.isYearly = newValue;
  }

  hasMembership(category: string, planType: string): boolean {
    const categoryKey = category.toUpperCase().replace(/ /g, '_').replace('&', 'AND');
    const planKey = planType === 'Bundle' ? 'BUNDLE' : 
                   planType === 'Basic' ? 'BASIC' : 'PRO';
    const billingType = this.isYearly ? 'YEARLY' : 'MONTHLY';
    
    const membershipType = planType === 'Bundle' ? 
      `BUNDLE_${billingType}` : 
      `${categoryKey}_${billingType}`;
    
    return this.currentUserMemberships.includes(membershipType);
  }

  getPlanTooltip(category: string, planType: string): string {
    return this.hasMembership(category, planType) ? 
      'You already have this membership' : 
      planType === 'Basic' ? 'Select Basic plan' : 'Upgrade to Pro';
  }

  selectPlan(category: string, type: string, monthlyPrice: string, yearlyPrice: string) {
    if (this.hasMembership(category, type)) return;
    
    let productId = '';
    
    // Determine product ID based on category, type, and billing frequency
    if (type === 'Bundle') {
      productId = this.isYearly ? 'prod_S1hH7F6c3dkJ7q' : 'prod_S1hGDBeyHJZxMM';
    } else {
      // Individual plans
      switch(category) {
        case 'Accounting & Finance':
          productId = this.isYearly ? 'prod_S1hB1qXnpJNSQ6' : 'prod_Rxbj8M3yYHkXoS';
          break;
        case 'Investment & Banking':
          productId = this.isYearly ? 'prod_S1gv2uZ1EUSfJT' : 'prod_S1gqZnQWIt8c2M';
          break;
        case 'Sales & Trading':
          productId = this.isYearly ? 'prod_S1gvepEO79Soi6' : 'prod_S1grJD79ruqVgK';
          break;
      }
    }

    this.router.navigate(['/membership-info'], {
      queryParams: {
        category: category,
        type: type,
        monthlyPrice: monthlyPrice,
        yearlyPrice: yearlyPrice,
        productId: productId,
        isYearly: this.isYearly
      },
    });
  }
}