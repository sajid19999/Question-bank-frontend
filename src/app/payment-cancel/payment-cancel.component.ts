// payment-cancel.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
@Component({
  selector: 'app-payment-cancel',
  standalone: true,
  imports: [CommonModule,MatIcon],
  templateUrl: './payment-cancel.component.html',
  styleUrls: ['./payment-cancel.component.css']
})
export class PaymentCancelComponent {
  constructor(private router: Router) {}

  retryPayment() {
    // You can implement logic to redirect back to the payment page
    this.router.navigate(['/membership']);
  }
}