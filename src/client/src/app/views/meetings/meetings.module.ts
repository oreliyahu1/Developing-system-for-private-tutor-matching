import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";

// Angular
import { MeetingsRoutingModule } from "./meetings-routing.module";

// Collapse Component
import { CollapseModule } from "ngx-bootstrap/collapse";

import { PopoverModule } from "ngx-bootstrap/popover";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule } from "@angular/material/paginator";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { TabsModule } from "ngx-bootstrap/tabs";
import { ChartsModule } from "ng2-charts";
import { ModalModule } from "ngx-bootstrap/modal";
import { MeetingsComponent } from "./meetings.component";
import { FeedbackDialogComponent } from "./feedback-dialog/feedback-dialog.component";
import { MatDialogModule } from "@angular/material/dialog";

@NgModule({
  entryComponents: [FeedbackDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    CollapseModule.forRoot(),
    ReactiveFormsModule,
    MeetingsRoutingModule,
    PaginationModule.forRoot(),
    PopoverModule,
    MatTableModule,
    MatIconModule,
    TabsModule,
    MatPaginatorModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgbModule,
    BsDropdownModule,
    ChartsModule,
    ModalModule.forRoot(),
    MatDialogModule,
  ],
  declarations: [MeetingsComponent, FeedbackDialogComponent],
})
export class MeetingsModule {}
