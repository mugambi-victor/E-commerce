import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, ChangeDetectorRef, NgZone } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('cardContainer') cardContainer!: ElementRef;
  
  showLeftArrow = false;
  showRightArrow = true;
  private scrollSubscription!: Subscription;

  constructor(private cdr: ChangeDetectorRef, private ngZone: NgZone) {}

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