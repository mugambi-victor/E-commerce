import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../services/category.service'; 
import { ProductService } from '../../../services/product.service'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-products',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.css']
})
export class ManageProductsComponent implements OnInit {
  successMessage: string | null = null;
  alertTitle: string = '';
  alertType: 'success' | 'delete' = 'success';
  showSuccessAlert: boolean = false;
  ProductForm: FormGroup;
  categories: any[] = [];
  products: any[] = [];
  selectedFile: File | null = null;
  fileError: string | null = null;

  constructor(private fb: FormBuilder, private categoryService: CategoryService, private ProductService: ProductService,  private router: Router) {
    this.ProductForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      categoryId: ['', Validators.required],
      product_price: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      product_image: [null] // Add a form control for the file upload
    });

    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['successMessage']) {
      this.successMessage = navigation.extras.state['successMessage'];
      this.showSuccessAlert = true;
      this.alertTitle = 'Success'; 
      this.alertType = 'success';  
      setTimeout(() => {
        this.showSuccessAlert = false;
      }, 5000);
    }
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (error) => console.error('Failed to load categories', error)
    });
  }

  loadProducts(): void {
    this.ProductService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        console.log('Products loaded successfully:', this.products);
      },
      error: (error) => {
        console.error('Failed to load products', error);
      }
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2048000) { // Size limit (e.g., 2MB)
        this.fileError = 'File size should not exceed 2MB';
        this.selectedFile = null;
      } else {
        this.fileError = null;
        this.selectedFile = file;
        this.ProductForm.patchValue({
          product_image: file
        });
        this.ProductForm.get('product_image')?.updateValueAndValidity();
      }
    }
  }

  onSubmit(): void {
    if (this.ProductForm.valid) {
      const formData = new FormData();
      formData.append('product_name', this.ProductForm.value.name);
      formData.append('product_description', this.ProductForm.value.description);
      formData.append('category_name', this.ProductForm.value.categoryId);
      formData.append('product_price', this.ProductForm.value.product_price);
      formData.append('stock', this.ProductForm.value.stock);
      if (this.selectedFile) {
        formData.append('product_image', this.selectedFile);
      }
  
      this.ProductService.addProduct(formData).subscribe({
        next: (response) => {
          console.log('Product added successfully:', response);
          this.successMessage = 'Product added successfully!';
          this.alertTitle = 'Success';
          this.alertType = 'success';
          this.showSuccessAlert = true;
          this.ProductForm.reset();
          this.selectedFile = null;
          this.loadProducts();
          this.closeModal();
          setTimeout(() => {
            this.showSuccessAlert = false;
          }, 5000);
        },
        error: (error) => {
          console.error('Failed to add product', error);
          this.successMessage = 'Failed to add product.';
          this.alertTitle = 'Error';
          this.alertType = 'delete';
          this.showSuccessAlert = true;
          setTimeout(() => {
            this.showSuccessAlert = false;
          }, 5000);
        }
      });
    } else {
      console.log('Form is invalid');
      this.successMessage = 'Please fill out all required fields.';
      this.alertTitle = 'Error';
      this.alertType = 'delete';
      this.showSuccessAlert = true;
      setTimeout(() => {
        this.showSuccessAlert = false;
      }, 5000);
    }
  }

  closeModal(): void {
    const modal = document.getElementById('add-Product-modal');
    if (modal) {
      modal.classList.remove('hs-overlay-open');
      modal.classList.add('hidden');
  
      const overlay = document.querySelector('.hs-overlay-backdrop');
      if (overlay) {
        overlay.classList.remove('hs-overlay-backdrop-open');
        overlay.classList.add('hidden');
      }
    }
  }

  deleteProduct(productId: string): void {
    console.log('Deleting product:', productId);
    if (confirm('Are you sure you want to delete this product?')) {
      this.ProductService.deleteProduct(productId).subscribe({
        next: (response) => {
          console.log('Product deleted successfully:', response);
          this.successMessage = 'Product deleted successfully!';
          this.alertTitle = 'Success';
          this.alertType = 'delete';
          this.showSuccessAlert = true;
          this.loadProducts();
          setTimeout(() => {
            this.showSuccessAlert = false;
          }, 5000);
        },
        error: (error) => {
          console.error('Failed to delete product', error);
          this.successMessage = 'Failed to delete product.';
          this.alertTitle = 'Error';
          this.alertType = 'delete';
          this.showSuccessAlert = true;
          setTimeout(() => {
            this.showSuccessAlert = false;
          }, 5000);
        }
      });
    }
  }

  onEdit(productId: string): void {
    this.router.navigate(['/admindashboard/edit-product', productId]);
  }
}
