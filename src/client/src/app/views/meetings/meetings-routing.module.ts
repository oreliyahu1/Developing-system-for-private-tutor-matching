import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MeetingsComponent } from "./meetings.component";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Meetings",
    },
    children: [
      {
        path: "",
        component: MeetingsComponent,
        data: {
          title: "",
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MeetingsRoutingModule {}
