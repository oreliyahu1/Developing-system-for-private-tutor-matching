import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AuthGuard } from "./interceptors";

// Import Containers
import { DefaultLayoutComponent } from "./containers";

import { P404Component } from "./views/error/404.component";
import { P500Component } from "./views/error/500.component";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
    canActivate: [AuthGuard],
  },
  {
    path: "404",
    component: P404Component,
    data: {
      title: "Page 404",
    },
  },
  {
    path: "500",
    component: P500Component,
    data: {
      title: "Page 500",
    },
  },
  {
    path: "",
    component: DefaultLayoutComponent,
    data: {
      title: "Home",
    },
    children: [
      {
        path: "home",
        canActivate: [AuthGuard],
        loadChildren: () =>
          import("./views/home/home.module").then((m) => m.HomeModule),
      },
      {
        path: "register",
        canActivate: [AuthGuard],
        loadChildren: () =>
          import("./views/register/register_base.module").then(
            (m) => m.RegisterBaseModule
          ),
      },
      {
        path: "search",
        canActivate: [AuthGuard],
        loadChildren: () =>
          import("./views/search/search.module").then((m) => m.SearchModule),
      },
      {
        path: "admin",
        canActivate: [AuthGuard],
        loadChildren: () =>
          import("./views/admin/admin.module").then((m) => m.AdminModule),
      },
      {
        path: "meetings",
        canActivate: [AuthGuard],
        loadChildren: () =>
          import("./views/meetings/meetings.module").then(
            (m) => m.MeetingsModule
          ),
      },
      {
        path: "videochat",
        canActivate: [AuthGuard],
        loadChildren: () =>
          import("./views/videochat/videochat.module").then(
            (m) => m.VideoChatModule
          ),
      },
      {
        path: "faq",
        canActivate: [AuthGuard],
        loadChildren: () =>
          import("./views/faq/faq.module").then((m) => m.FaqModule),
      },
      {
        path: "login",
        canActivate: [AuthGuard],
        loadChildren: () =>
          import("./views/login/login.module").then((m) => m.LoginModule),
      },
    ],
    canActivate: [AuthGuard],
  },

  { path: "**", component: P404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
