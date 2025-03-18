import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

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


@Component({
  selector: 'app-pricing-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatAccordion,
    MatExpansionModule,
    MatTableModule,
    MatSlideToggleModule,
    MatButtonModule,
  ],
  templateUrl: './pricing-details.component.html',
  styleUrls: ['./pricing-details.component.css'],
})
export class PricingDetailsComponent {
  displayedColumns: string[] = ['plan', 'price', 'action'];
  isYearly: boolean = false; // Toggle state for all categories
constructor(private router: Router){}
  categories: Category[] = [
    {
      name: 'Investment & Banking',
      plans: [
        { name: 'Basic', type: 'Basic', monthlyPrice: 'Free', yearlyPrice: 'Free' },
        { name: 'Pro – Individual', type: 'Individual', monthlyPrice: '£9.99/month', yearlyPrice: '£7.90/month' },
        { name: 'Pro – Bundle', type: 'Bundle', monthlyPrice: '£14.99/month', yearlyPrice: '£9.99/month' },
      ],
    },
    {
      name: 'Sales & Trading',
      plans: [
        { name: 'Basic', type: 'Basic', monthlyPrice: 'Free', yearlyPrice: 'Free' },
        { name: 'Pro – Individual', type: 'Individual', monthlyPrice: '£9.99/month', yearlyPrice: '£7.90/month' },
        { name: 'Pro – Bundle', type: 'Bundle', monthlyPrice: '£14.99/month', yearlyPrice: '£9.99/month' },
      ],
    },
    {
      name: 'Accounting & Finance',
      plans: [
        { name: 'Basic', type: 'Basic', monthlyPrice: 'Free', yearlyPrice: 'Free' },
        { name: 'Pro – Individual', type: 'Individual', monthlyPrice: '£9.99/month', yearlyPrice: '£7.90/month' },
        { name: 'Pro – Bundle', type: 'Bundle', monthlyPrice: '£14.99/month', yearlyPrice: '£9.99/month' },
      ],
    },
  ];

  togglePricing(newValue: boolean) {
    this.isYearly = newValue;
    console.log(`Toggled to ${this.isYearly ? 'Yearly' : 'Monthly'}`);
  }
  

  selectPlan(category: string, type: string, monthlyPrice: string, yearlyPrice: string) {
    this.router.navigate(['/membership-info'], {
      queryParams: {
        category: category,
        type: type,
        monthlyPrice: monthlyPrice,
        yearlyPrice: yearlyPrice,
      },
    });
  }
}