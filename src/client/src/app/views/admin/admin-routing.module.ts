import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { UsersComponent } from "./users/users.component";
import { QuestionnairesComponent } from "./questionnaires/questionnaires.component";
import { CoursesComponent } from "./courses/courses.component";
import { CertificatesComponent } from "./certificates/certificates.component";
import { FaqsComponent } from "./faqs/faqs.component";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "",
    },
    children: [
      {
        path: "users",
        component: UsersComponent,
        data: {
          title: "Users",
        },
      },
      {
        path: "questionnaires",
        component: QuestionnairesComponent,
        data: {
          title: "Questionnaires",
        },
      },
      {
        path: "courses",
        component: CoursesComponent,
        data: {
          title: "Courses",
        },
      },
      {
        path: "certificates",
        component: CertificatesComponent,
        data: {
          title: "Certificates",
        },
      },
      {
        path: "faqs",
        component: FaqsComponent,
        data: {
          title: "Faqs",
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
