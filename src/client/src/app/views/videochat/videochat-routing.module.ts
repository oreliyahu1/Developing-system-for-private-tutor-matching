import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { VideoChatComponent } from "./videochat.component";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Video Chat",
    },
    children: [
      {
        path: "",
        component: VideoChatComponent,
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
export class StudentMeetingsRoutingModule {}
