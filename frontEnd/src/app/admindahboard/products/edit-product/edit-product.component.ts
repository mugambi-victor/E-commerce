import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  productForm: FormGroup;
  productId: string | null = null;
  categories: any[] = [];
  fileError: string | null = null;  // Declare fileError
  imagePreview: string | null = null; // For image preview
  selectedFile: File | null = null;    // For the selected file

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      product_name: ['', Validators.required],
      product_description: ['', Validators.required],
      category_name: ['', Validators.required],
      product_price: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      product_image: ['']  // Form control for the image
    });
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.loadProduct();
    }
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (error) => console.error('Failed to load categories', error)
    });
  }

  loadProduct(): void {
    if (this.productId) {
      this.productService.getProductById(this.productId).subscribe({
        next: (product) => {
          this.productForm.patchValue({
            product_name: product.product_name,
            product_description: product.product_description,
            category_name: product.category_name,
            product_price: product.product_price,
            stock: product.stock
          });
          this.imagePreview = `http://localhost:9000/storage/images/${product.product_image}`;

console.log("The image URL is", this.imagePreview);
        },
        error: (error) => console.error('Failed to load product', error)
      });
    }
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
        console.log(file);
        this.productForm.patchValue({
          product_image: file
        });
  
  
        // Generate image preview
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result as string;
        };
        reader.readAsDataURL(file);
      }
    }
  }
  
  

  onSubmit(): void {
    if (this.productForm.valid) {
      console.log("logging selected",this.selectedFile);
      const formData = new FormData();
      formData.append('product_name', this.productForm.get('product_name')?.value.toString());
      // formData.append('product_name', this.productForm.value.product_name);
      formData.append('product_description', this.productForm.get('product_description')?.value.toString());
      formData.append('category_name', this.productForm.value.category_name);
      formData.append('product_price', this.productForm.value.product_price);
      formData.append('stock', this.productForm.value.stock);
      if (this.selectedFile) {
        console.log('Uploading file:', this.selectedFile);
        formData.append('product_image', this.selectedFile);
        console.log('Appended file:', formData.get('product_image'));
        console.log('product_name:', formData.get('product_name'));
        console.log('product_price:', formData.get('product_price'));
      }
   
      // Log FormData for debugging
      console.log("the form data",formData);
  console.log("the product id",this.productId);
      if (this.productId) {
        this.productService.updateProduct(this.productId, formData).subscribe({
          next: (response) => {
            console.log('Product updated successfully:', response);
            this.router.navigate(['/admindashboard/manage-products'], {
              state: { successMessage: 'Product updated successfully!' }
            });
          },
          error: (error) => console.error('Failed to update product', error)
        });
      }
    } else {
      console.error('Form is invalid');
    }
  }
  
  
  
  
}
