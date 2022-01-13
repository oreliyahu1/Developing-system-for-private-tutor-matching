import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ChartsModule } from "ng2-charts";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ButtonsModule } from "ngx-bootstrap/buttons";

import { HomeComponent } from "./home.component";
import { HomeRoutingModule } from "./home-routing.module";
import { PopoverModule } from "ngx-bootstrap/popover";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { CommonModule } from "@angular/common";
import { CarouselModule } from 'ngx-bootstrap/carousel';

@NgModule({
  imports: [
    FormsModule,
    HomeRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    PaginationModule.forRoot(),
    PopoverModule,
    CommonModule,
    CarouselModule.forRoot()
  ],
  declarations: [HomeComponent],
})
export class HomeModule {}
