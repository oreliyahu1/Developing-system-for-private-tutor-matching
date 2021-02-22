import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { UserService } from "@app/services";
import { User, UserType } from "@app/models";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private userService: UserService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const prefix = '/';
    const adminPrefix = 'admin';
    const commomPages = ['', 'home', 'faq']
    const guestPages = ['login', 'register/student', 'register/tutor']
    const studentPages = ['meetings', 'search', 'videochat']
    const tutorPages = ['meetings', 'videochat']
    const adminPages = ['/users', '/questionnaires', '/courses', '/certificates', '/faqs']

    const userType = this.userService.getCurrentUserValue().type;

    for (const page of commomPages) {
      if (state.url == prefix + page) {
        return true;
      }
    }

    let pageToScan = [];
    let prefixScan = prefix;
    switch(userType)
    {
      case UserType.Student:
        pageToScan = studentPages;
        break;
      case UserType.Tutor:
        pageToScan = tutorPages;
        break;
      case UserType.Admin:
        pageToScan = adminPages;
        prefixScan += adminPrefix;
        break;
      default:
        pageToScan = guestPages;
        break;
    }

    for (const page of pageToScan) {
      if (state.url == prefixScan + page) {
        return true;
      }
    }

    this.router.navigate(["/"]);
    return false;
  }
}
