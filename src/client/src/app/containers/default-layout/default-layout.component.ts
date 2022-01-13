import { Component, OnInit } from "@angular/core";
import { SharedAlertService } from "@app/pipelines";
import { UserService } from "@app/services";
import {
  navItems,
  navItemsStudent,
  navItemsTutor,
  navItemsAdmin,
} from "@app/_nav";
import { AlertConfig } from "ngx-bootstrap/alert";
import { MatDialog } from "@angular/material/dialog";
import { ProfileDialogComponent } from "@app/views/profile-dialog/profile-dialog.component"
import { UserType } from "@app/models";
import { Router } from "@angular/router";

export function getAlertConfig(): AlertConfig {
  return Object.assign(new AlertConfig(), { type: "success" });
}

@Component({
  selector: "app-dashboard",
  templateUrl: "./default-layout.component.html",
  providers: [{ provide: AlertConfig, useFactory: getAlertConfig }],
})

export class DefaultLayoutComponent implements OnInit {
  public sidebarMinimized = false;
  public navItems = navItems;
  alertsDismiss: any = [];

  constructor(
    private userService: UserService,
    private sharedAlertService: SharedAlertService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.sharedAlertService.getAlertEvent().subscribe((res) => {
      let type = "";
      switch (res.response) {
        case "Success":
          type = "success";
          break;
        case "Error":
          type = "danger";
          break;
        default:
          type = "info";
          break;
      }
      this.alertsDismiss.push({
        type: type,
        msg: res.msg,
        timeout: 2000,
      });
    });
  }
  showtest = false;

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  somethingChanged() {
  }

  changeNavItems() {
    switch (this.userService.getCurrentUserValue().type) {
      case UserType.Student:
        this.navItems = navItemsStudent;
        break;
      case UserType.Tutor:
        this.navItems = navItemsTutor;
        break;
      case UserType.Admin:
        this.navItems = navItemsAdmin;
        break;
      default:
        this.navItems = navItems;
        break;
    }
  }

  openProfile() {
    this.dialog.open(ProfileDialogComponent, {
      data: {
        user_id: this.userService.getCurrentUserValue()._id
      },
    });
  }

  ngOnInit() {
    //this.userService.logout();
  }

  logout() {
    this.router.navigateByUrl("/home");
    this.userService.logout();
  }
}
