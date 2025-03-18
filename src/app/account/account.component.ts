import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MatCard } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

import { ChangePasswordDialogComponent } from '../change-password-dialog/change-password-dialog.component';

@Component({
  selector: 'app-account',
  standalone: true,
  imports:[MatCard,MatTableModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  user: any = {};
  membership: any = {};
  orders: any[] = []; // Example data for order history
  displayedColumns: string[] = ['date', 'level', 'total', 'status'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.user = {
        username: params['username'],
        email: params['email']
      };
      this.membership = {
        name: params['membershipType']
      };
    });

    // Example order history data
    this.orders = [
      { date: '2023-10-01', level: 'Basic', total: '$10', status: 'Completed' },
      { date: '2023-09-15', level: 'Premium', total: '$20', status: 'Pending' }
    ];
  }

  // Change Password
  changePassword(): void {
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.resetPassword(result.token, result.newPassword).subscribe({
          next: () => {
            this.snackBar.open('Password changed successfully!', 'Close', { duration: 3000 });
          },
          error: (err) => {
            this.snackBar.open('Failed to change password. Please try again.', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  // Log Out
  logOut(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Change Membership
  changeMembership(): void {
    this.snackBar.open('Membership change functionality not implemented yet.', 'Close', { duration: 3000 });
  }

  // Cancel Membership
  cancelMembership(): void {
    this.snackBar.open('Membership cancellation functionality not implemented yet.', 'Close', { duration: 3000 });
  }
}