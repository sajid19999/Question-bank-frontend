import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports:[RouterLink],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const returnToTopLink = document.querySelector('.return-to-top');
      if (returnToTopLink) {
        returnToTopLink.addEventListener('click', (event) => {
          event.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }
    }
  }
}