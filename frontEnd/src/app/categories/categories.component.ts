import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [ HttpClientModule, CommonModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
  providers: [CategoryService],
})
export class CategoriesComponent {
  public title = 'frontEnd';

  categories: any[] = [];

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
    });}
}
