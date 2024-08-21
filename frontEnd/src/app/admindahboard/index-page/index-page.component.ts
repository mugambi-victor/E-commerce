import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashcardsComponent } from "../dashcards/dashcards.component";
import { ManageCategoriesComponent } from '../manage-categories/manage-categories.component';

@Component({
  selector: 'app-index-page',
  standalone: true,
  imports: [RouterModule, DashcardsComponent, ManageCategoriesComponent],
  templateUrl: './index-page.component.html',
  styleUrl: './index-page.component.css'
})
export class IndexPageComponent {

}
