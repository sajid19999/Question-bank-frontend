import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    RouterLink,
    NgIf,
    MatDivider,
    CommonModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false; // Track login state
  menuOpen: boolean = false; // Track mobile menu state

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // Subscribe to login state changes
    this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
      this.isLoggedIn = isAuthenticated; // Update login state
    });
  }

  /**
   * Handle topic selection
   * @param topic - The selected topic (e.g., 'Accounting & Finance')
   * @param membershipType - The membership type (e.g., 'Basic' or 'Pro')
   */
  selectTopic(topic: string, membershipType: string): void {
    this.router.navigate(['/questions', topic, membershipType]);
  }

  /**
   * Toggle mobile menu
   */
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  /**
   * Logout functionality
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']); // Redirect to home page
  }
}