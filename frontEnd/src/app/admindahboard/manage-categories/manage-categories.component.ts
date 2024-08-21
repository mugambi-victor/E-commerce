import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../../category.service';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-manage-categories',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './manage-categories.component.html',
  styleUrls: ['./manage-categories.component.css']
})
export class ManageCategoriesComponent implements OnInit {
  successMessage: string | null = null;
  alertTitle: string = '';
  alertType: 'success' | 'delete' = 'success';
  showSuccessAlert: boolean = false;
  categoryForm: FormGroup;
  categories: Array<{ _id: string; category_name: string; category_description: string }> = [];

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });

    // Handle navigation end to capture state
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const navigation = this.router.getCurrentNavigation();
        if (navigation?.extras?.state) {
          const state = navigation.extras.state as { message?: string };
          if (state.message) {
            this.successMessage = state.message;
            this.alertTitle = 'Operation Successful'; // Customize as needed
            this.alertType = 'success';
            this.showSuccessAlert = true;
            this.cdr.detectChanges(); // Ensure UI is updated

            // Set timeout to hide the alert
            setTimeout(() => {
              this.showSuccessAlert = false;
            }, 5000); // Hide the alert after 5 seconds

          }
        }
      }
    });
  }
  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(
      data => {
        this.categories = data;
        console.log(data);
      },
      error => {
        console.error('Error fetching categories', error);
      }
    );
  }


  onSubmit() {
    if (this.categoryForm.valid) {
      const newCategory = {
        category_name: this.categoryForm.value.name,
        category_description: this.categoryForm.value.description
      };

      this.categoryService.addCategory(newCategory).subscribe(
        (response) => {
          console.log('Category added successfully', response);
          this.categoryForm.reset(); // Reset the form
          this.loadCategories(); // Reload the categories list
          this.successMessage = 'Your new category has been successfully added.';
          this.alertTitle = 'Category Created Successfully';
          this.alertType = 'success';
          this.showSuccessAlert = true; // Show the success alert
          setTimeout(() => this.showSuccessAlert = false, 5000); // Hide the alert after 5 seconds
          // Close the modal
          const modal = document.getElementById('add-category-modal');
          if (modal) {
            (window as any).HSOverlay.close(modal);
          }
        },
        (error) => {
          console.error('Error adding category', error);
          // Handle error (e.g., show error message to user)
        }
      );
    }
  }
  deleteCategory(id: string) {
    // Handle category deletion logic here
    this.categoryService.deleteCategory(id).subscribe(
      (response) => {
        console.log('Category deleted successfully', response);
        this.loadCategories(); // Reload the categories list
        this.successMessage = 'The category has been successfully deleted.';
        this.alertTitle = 'Category Deleted Successfully';
        this.alertType = 'delete';
        this.showSuccessAlert = true; // Show the success alert
        setTimeout(() => this.showSuccessAlert = false, 5000); // Hide the alert after 5 seconds
      },
      (error) => {
        console.error('Error deleting category', error);
        // Handle error (e.g., show error message to user)
      }
    );
  }
  onEdit(categoryId: string): void {
    this.router.navigate(['/admindashboard/edit-category', categoryId]);
  }
}