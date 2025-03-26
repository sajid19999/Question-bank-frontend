// payment-success.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MembershipService } from '../services/membership.service';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule,MatIcon],
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {
  paymentStatus: string = 'Processing your payment...';
  isPaymentVerified: boolean = false;
  sessionId: string | null = null;
  email: string | null = null;
  membershipType: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private membershipService: MembershipService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.sessionId = params['session_id'];
      
      if (this.sessionId) {
        this.verifyPayment(this.sessionId);
      } else {
        this.paymentStatus = 'No session ID found in URL';
      }
    });
  }

  verifyPayment(sessionId: string) {
    this.membershipService.verifyPayment(sessionId).subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          this.paymentStatus = 'Payment successfully verified!';
          this.isPaymentVerified = true;
          // You can access additional data from the response if needed
        } else {
          this.paymentStatus = 'Payment verification failed: ' + (response.message || 'Unknown error');
        }
      },
      error: (error) => {
        this.paymentStatus = 'Error verifying payment: ' + (error.message || 'Server error');
        console.error('Verification error:', error);
      }
    });
  }
}