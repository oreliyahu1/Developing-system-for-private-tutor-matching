import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { RegisterComponent } from "./register.component";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";

// Angular
import { RegistersRoutingModule } from "./register-routing.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RegistersRoutingModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
  ],
  declarations: [RegisterComponent],
})
export class RegisterModule {}
