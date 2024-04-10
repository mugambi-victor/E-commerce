import { Component, PLATFORM_ID, Inject } from '@angular/core';
import { Router, Event, NavigationEnd, RouterOutlet, RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { IStaticMethods } from 'preline/preline';
import { CarouselComponent } from './carousel/carousel.component';
import { CategoriesComponent } from './categories/categories.component';
import { SlideshowComponent } from './slideshow/slideshow.component';
import { ProductsComponent } from './products/products.component';

declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

@Component({
  standalone:true,
  selector: 'app-root',
 
  imports: [RouterOutlet, CarouselComponent, CategoriesComponent, SlideshowComponent, RouterModule, ProductsComponent],

  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  title = 'frontEnd';

  ngOnInit() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          if (isPlatformBrowser(this.platformId)) {
            if (window.HSStaticMethods) {
              window.HSStaticMethods.autoInit();
            }
          }
        }, 100);
      }
    });
  }
}
