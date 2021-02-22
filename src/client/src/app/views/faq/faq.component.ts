import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { FaqService } from '@app/services'

@Component({
  templateUrl: 'faq.component.html'
})
export class FaqComponent implements OnInit {

  faq = [];

  constructor(private faqService : FaqService) {}

  ngOnInit(): void {
    this.faqService.getAll().pipe(first())
		.subscribe(data => {
        this.faq = data;
		});

    this.faq.forEach(item => {
      item['display'] = true;
    });
  }

  collapsed(event: any): void {
    // console.log(event);
  }

  expanded(event: any): void {
    // console.log(event);
  }

  toggleCollapse(i: number): void {
    this.faq[i]['display'] = !this.faq[i]['display'];
  }

  toggleCollapseIcon(i: number): string {
    return this.faq[i]['display'] ? 'icon-arrow-down' : 'icon-arrow-up';
  }
}
