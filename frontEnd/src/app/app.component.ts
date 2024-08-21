import { Component, PLATFORM_ID, Inject } from '@angular/core';
import { Router, Event, NavigationEnd, RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { IStaticMethods } from 'preline/preline';
import { CarouselComponent } from './carousel/carousel.component';
import { CategoriesComponent } from './categories/categories.component';
import { SlideshowComponent } from './slideshow/slideshow.component';
import { ProductsComponent } from './products/products.component';
import { HeaderComponent } from './header/header.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ImageSliderComponent } from './image-slider/image-slider.component';
import { ManageCategoriesComponent } from './admindahboard/manage-categories/manage-categories.component';
import { DashcardsComponent } from './admindahboard/dashcards/dashcards.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EditCategoryComponent } from './admindahboard/edit-category/edit-category.component';
declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

@Component({
  standalone:true,
  selector: 'app-root',
 
  imports: [RouterOutlet, CarouselComponent, CategoriesComponent, ImageSliderComponent, RouterModule, ProductsComponent, HeaderComponent,  CommonModule, HttpClientModule, ManageCategoriesComponent, DashcardsComponent, ReactiveFormsModule, EditCategoryComponent],

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
