import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CategoryService } from '../../category.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-category',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit {
  categoryId: string = '';
  editCategoryForm: FormGroup;

  // Additional properties for alerts
  successMessage: string | null = null;
  errorMessage: string | null = null;
  showErrorAlert: boolean = false;
  alertTitle: string = '';
  alertType: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) {
    this.editCategoryForm = this.fb.group({
      category_name: ['', [Validators.required]],
      category_description: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.paramMap.get('id')!;
    this.loadCategory();
  }

  loadCategory() {
    this.categoryService.getCategoryById(this.categoryId).subscribe(category => {
      this.editCategoryForm.patchValue({
        category_name: category.category_name,
        category_description: category.category_description
      });
    });
  }

  onSubmit() {
    if (this.editCategoryForm.valid) {
      this.categoryService.updateCategory(this.categoryId, this.editCategoryForm.value).subscribe(
        () => {
          // On success, navigate and set success message
          this.router.navigate(['/admindashboard/manage_categories'], {
            state: { message: 'Category updated successfully!' }
          });
        },
        (error) => {
          // On error, display error message
          console.error('Error updating category', error);
          this.errorMessage = 'Failed to update the category. Please try again.';
          this.alertTitle = 'Update Failed';
          this.alertType = 'error';
          this.showErrorAlert = true;
          this.cdr.detectChanges(); // Ensure UI is updated

          // Set timeout to hide the error alert
          setTimeout(() => {
            this.showErrorAlert = false;
          }, 5000); // Hide the alert after 5 seconds
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}
