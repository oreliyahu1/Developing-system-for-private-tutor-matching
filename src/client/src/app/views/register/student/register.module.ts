import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { RegisterComponent } from "./register.component";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
// Angular
import { RegistersRoutingModule } from "./register-routing.module";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RegistersRoutingModule,
    ReactiveFormsModule,
    PaginationModule,
    MatAutocompleteModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
  ],
  declarations: [RegisterComponent],
})
export class RegisterModule {}
