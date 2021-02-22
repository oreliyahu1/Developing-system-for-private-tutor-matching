import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { FaqComponent } from './faq.component';

// Angular
import { FaqRoutingModule } from './faq-routing.module';

// Collapse Component
import { CollapseModule } from 'ngx-bootstrap/collapse';


@NgModule({
  imports: [
    CommonModule,
    CollapseModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    FaqRoutingModule
    
  ],
  declarations: [
    FaqComponent
  ]
})
export class FaqModule { }
