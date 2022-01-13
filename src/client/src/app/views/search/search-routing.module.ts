import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SearchComponent } from "./search.component";
import { SearchResultsComponent } from "./results.component";
import { requestmeetingComponent } from "./requestmeeting.component";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Search",
    },
    children: [
      {
        path: "",
        component: SearchComponent,
        data: {
          title: "",
        },
      },
      {
        path: ":course",
        component: SearchResultsComponent,
        data: {
          title: "Results",
        },
      },
      {
        path: ":course/:tutor",
        component: requestmeetingComponent,
        data: {
          title: "Results",
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchRoutingModule {}
