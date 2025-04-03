import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatExpansionModule,
    FormsModule,
    CommonModule,
    MatIconModule
  ],
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  message: string = '';
  isCancellation: boolean = false;

  faqs = [
    {
      question: 'How can I reset my password?',
      answer: 'You can reset your password by clicking on the "Forgot Password" link on the login page.',
    },
    {
      question: 'What are your business hours?',
      answer: 'Our business hours are from 9 AM to 6 PM, Monday to Friday.',
    },
    {
      question: 'How do I contact support?',
      answer: 'You can contact support through this contact form or by emailing support@example.com.',
    },
  ];

  constructor(private route: ActivatedRoute, private snackBar: MatSnackBar) {
    this.route.queryParams.subscribe(params => {
      this.isCancellation = params['reason'] === 'membership-cancellation';
      if (this.isCancellation) {
        this.message = 'I would like to cancel my membership because...';
      }
    });
  }

  sendMessage() {
    // In a real app, you would send this to your backend
    console.log('Message sent:', {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      message: this.message,
      isCancellation: this.isCancellation
    });

    this.snackBar.open('Your message has been sent successfully!', 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });

    // Reset form
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.message = '';
    if (this.isCancellation) {
      this.message = 'I would like to cancel my membership because...';
    }
  }
}