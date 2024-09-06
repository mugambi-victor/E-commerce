import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, ChangeDetectorRef, NgZone, OnInit } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('cardContainer') cardContainer!: ElementRef;

  showLeftArrow = false;
  showRightArrow = true;
  private scrollSubscription!: Subscription;
  categories: any[] = [];  // Array to hold categories and their products

  constructor(
    private cdr: ChangeDetectorRef, 
    private ngZone: NgZone,
    private productService: ProductService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.checkArrows();
        this.cdr.detectChanges();
      });

      this.scrollSubscription = fromEvent(this.cardContainer.nativeElement, 'scroll')
        .pipe(debounceTime(100))
        .subscribe(() => {
          this.ngZone.run(() => {
            this.checkArrows();
          });
        });
    });
  }

  ngOnDestroy() {
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        // Group products by category
        const grouped = data.reduce((acc: any, product: any) => {
          const category = product.category_name; // Assumes each product has a category_name property
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push({
            ...product,
            safeImageUrl: this.getSafeImageUrl(product.product_image)
          });
          return acc;
        }, {});

        this.categories = Object.keys(grouped).map(categoryName => ({
          category_name: categoryName,
          products: grouped[categoryName]
        }));
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      }
    });
  }

  getSafeImageUrl(imagePath: string): SafeUrl {
    // Construct the full URL to the image in Laravel's public storage
    const fullImageUrl = `http://localhost:9000/storage/images/${imagePath}`;
    return this.sanitizer.bypassSecurityTrustUrl(fullImageUrl);
  }

  scrollLeft() {
    this.cardContainer.nativeElement.scrollBy({ left: -200, behavior: 'smooth' });
  }

  scrollRight() {
    this.cardContainer.nativeElement.scrollBy({ left: 200, behavior: 'smooth' });
  }

  private checkArrows() {
    const { scrollLeft, scrollWidth, clientWidth } = this.cardContainer.nativeElement;
    this.showLeftArrow = scrollLeft > 0;
    this.showRightArrow = scrollLeft < scrollWidth - clientWidth;
  }
}
