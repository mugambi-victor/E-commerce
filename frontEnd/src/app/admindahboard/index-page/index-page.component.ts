import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DashcardsComponent } from "../dashcards/dashcards.component";
import { ManageCategoriesComponent } from '../manage-categories/manage-categories.component';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-index-page',
  standalone: true,
  imports: [RouterModule, DashcardsComponent, ManageCategoriesComponent, HttpClientModule],
  templateUrl: './index-page.component.html',
  styleUrl: './index-page.component.css'
})
export class IndexPageComponent {
  username: string = ''; // Replace with dynamic username fetching logic

  constructor(private router: Router, private authService: AuthService) {}
  ngOnInit(): void {
    this.authService.getUserProfile().subscribe(
      (user) => {
        this.username = user.name; // Assuming the API returns a 'name' field
      },
      (error) => {
        console.error('Failed to fetch user profile', error);
        // Handle the error (e.g., redirect to login)
      }
    );
  }
  logout() {
    this.authService.logout().subscribe(
      (success) => {
        if (success) {
          // Redirect to the login page or any other page after successful logout
          this.router.navigate(['/login']);
        } else {
          console.error('Logout failed');
        }
      },
      (error) => {
        console.error('An error occurred during logout', error);
      }
    );
  }

}
