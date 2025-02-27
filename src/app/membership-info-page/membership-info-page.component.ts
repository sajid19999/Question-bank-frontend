import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-membership-info-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './membership-info-page.component.html',
  styleUrl: './membership-info-page.component.css',
})
export class MembershipInfoComponent {
  category = '';
  membershipType = '';
  username = '';
  password = '';
  confirmPassword = '';
  email = '';
  confirmEmail = '';
  showPassword = false;
  showConfirmPassword = false;

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.category = params['category'];
      this.membershipType = params['type'];
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (this.email !== this.confirmEmail) {
      alert('Emails do not match!');
      return;
    }
    alert('Form submitted successfully!');
  }
}
