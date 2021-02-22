// Angular
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";

import { RegisterComponent as StudentRegisterComponent } from "./student/register.component";
import { RegisterComponent as TutorRegisterComponent } from "./tutor/register.component";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";

// Tabs Component
import { TabsModule } from "ngx-bootstrap/tabs";

// Carousel Component
import { CarouselModule } from "ngx-bootstrap/carousel";

// Collapse Component
import { CollapseModule } from "ngx-bootstrap/collapse";

// Dropdowns Component
import { BsDropdownModule } from "ngx-bootstrap/dropdown";

// Pagination Component
import { PaginationModule } from "ngx-bootstrap/pagination";

// Popover Component
import { PopoverModule } from "ngx-bootstrap/popover";

// Progress Component
import { ProgressbarModule } from "ngx-bootstrap/progressbar";

// Tooltip Component
import { TooltipModule } from "ngx-bootstrap/tooltip";

// Components Routing
import { RegisterBaseRoutingModule } from "./register_base-routing.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RegisterBaseRoutingModule,
    BsDropdownModule.forRoot(),
    TabsModule,
    ReactiveFormsModule,
    CarouselModule.forRoot(),
    CollapseModule.forRoot(),
    PaginationModule.forRoot(),
    PopoverModule.forRoot(),
    ProgressbarModule.forRoot(),
    TooltipModule.forRoot(),
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
  declarations: [StudentRegisterComponent, TutorRegisterComponent],
})
export class RegisterBaseModule {}
