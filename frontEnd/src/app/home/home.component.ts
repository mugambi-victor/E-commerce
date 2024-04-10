import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SlideshowComponent } from '../slideshow/slideshow.component';
import { CategoriesComponent } from '../categories/categories.component';
import { ProductsComponent } from '../products/products.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, SlideshowComponent, CategoriesComponent, ProductsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
