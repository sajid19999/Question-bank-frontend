import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion'; 
import { MatCardModule } from '@angular/material/card'; 

@Component({
  selector: 'app-terms-and-conditions',
  standalone: true, 
  imports: [
    CommonModule,
    MatExpansionModule, 
    MatCardModule, 
  ],
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.css'],
})
export class TermsAndConditionsComponent {
}