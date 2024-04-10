import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-slideshow',
  standalone: true,
  imports: [],
  templateUrl: './slideshow.component.html',
  styleUrl: './slideshow.component.css'
})
export class SlideshowComponent implements OnInit {
  slideIndex: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.showSlides();
  }

  showSlides(): void {
    let slides: HTMLCollectionOf<Element> = document.getElementsByClassName("mySlides");
    let dots: HTMLCollectionOf<Element> = document.getElementsByClassName("dot");
    for (let i = 0; i < slides.length; i++) {
      (slides[i] as HTMLElement).style.display = "none";  
    }
    this.slideIndex++;
    if (this.slideIndex > slides.length) {
      this.slideIndex = 1;
    }
    for (let i = 0; i < dots.length; i++) {
      (dots[i] as HTMLElement).className = (dots[i] as HTMLElement).className.replace(" active", "");
    }
    (slides[this.slideIndex - 1] as HTMLElement).style.display = "block";  
    (dots[this.slideIndex - 1] as HTMLElement).className += " active";
    setTimeout(() => this.showSlides(), 10000); // Change image every 2 seconds
  }
}