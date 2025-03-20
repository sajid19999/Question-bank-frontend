import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common'; // Import NgFor


@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatExpansionModule,
    FormsModule,
    NgFor
  ],
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css'],
})
export class ContactUsComponent {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  message: string = '';

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

  sendMessage() {
    console.log('Message sent:', {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      message: this.message,
    });
    alert('Message sent successfully!');
  }
}