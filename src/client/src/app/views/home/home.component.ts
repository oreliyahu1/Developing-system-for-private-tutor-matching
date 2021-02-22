import {Component, OnDestroy} from '@angular/core';
import { CarouselConfig } from 'ngx-bootstrap/carousel';

@Component({
  templateUrl: 'home.component.html',
  providers: [
    { provide: CarouselConfig, useValue: { interval: 4000, noPause: false } },
  ]
})
export class HomeComponent implements OnDestroy {

  prePathImage:string = "assets/img/home/";

  images = [
    {
      image: "4-900x380-min.jpg",
      text: "The best tutor for you",
      description: "Every search we find the most suitable private tutor for you",
    },
    {
      image: "3-900x380-min.jpg",
      text: "Giving feedback",
      description: "We learn you every lesson to give you the best",
    },
    {
      image: "2-900x380-min.jpg",
      text: "Community",
      description: "Your feedback helps all our students and tutors!",
    },
    {
      image: "1-900x380-min.jpg",
      text: "Don't miss your opportunity to grow",
      description: "",
    },
  ];

  slides: any[] = [];

  constructor() {
    this.images.forEach(image => {
      image.image = this.prePathImage + image.image;
      this.addSlide(image);
    });
  }

  ngOnDestroy(): void {
  }

  addSlide(image: any): void {
    setTimeout( () => {
      this.slides.push(image);
    }, 500);
  }

}
