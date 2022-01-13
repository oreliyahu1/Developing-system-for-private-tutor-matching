import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ChartsModule } from "ng2-charts";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ButtonsModule } from "ngx-bootstrap/buttons";
import { TabsModule } from "ngx-bootstrap/tabs";
import { ModalModule } from "ngx-bootstrap/modal";

import { UsersComponent } from "./users/users.component";
import { QuestionnairesComponent } from "./questionnaires/questionnaires.component";
import { CoursesComponent } from "./courses/courses.component";
import { CertificatesComponent } from "./certificates/certificates.component";
import { FaqsComponent } from "./faqs/faqs.component";

import { CourseDialogComponent } from "@app/views/admin/courses/course-dialog/course-dialog.component";
import { CertificateDialogComponent } from "@app/views/admin/certificates/certificate-dialog/certificate-dialog.component";
import { FaqDialogComponent } from "@app/views/admin/faqs/faq-dialog/faq-dialog.component";

import { CommonModule } from "@angular/common";
import { AdminRoutingModule } from "./admin-routing.module";
import { MatDialogModule } from "@angular/material/dialog";

import { PaginationModule } from "ngx-bootstrap/pagination";

@NgModule({
  entryComponents: [CourseDialogComponent, CertificateDialogComponent, FaqDialogComponent],
  imports: [
    FormsModule,
    AdminRoutingModule,
    ChartsModule,
    BsDropdownModule,
    TabsModule.forRoot(),
    ButtonsModule.forRoot(),
    CommonModule,
    MatDialogModule,
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
  ],
  declarations: [
    UsersComponent,
    QuestionnairesComponent,
    CoursesComponent,
    CertificatesComponent,
    FaqsComponent,
    FaqDialogComponent,
    CourseDialogComponent,
    CertificateDialogComponent,
  ],
})
export class AdminModule {}
