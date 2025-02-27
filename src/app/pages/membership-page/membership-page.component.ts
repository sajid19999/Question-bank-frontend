import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-membership-page',
  standalone: true,
   imports: [RouterModule],
  templateUrl: './membership-page.component.html',
  styleUrl: './membership-page.component.css',
})
export class MembershipComponent {
  category = '';
  membershipType = '';

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.category = params['category'] || 'Accounting & Finance';
      this.membershipType = params['type'] || 'Basic';
    });
  }
}
