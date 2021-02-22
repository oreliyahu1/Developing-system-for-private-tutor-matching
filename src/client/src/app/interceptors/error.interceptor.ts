import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import { UserService } from "@app/services";
import { SharedAlertService } from "@app/pipelines";
import { Router } from "@angular/router";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private userService: UserService,
    private alertSharedService: SharedAlertService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status == 401) {
          // auto logout if 401 response returned from api
          this.userService.logout();
          this.router.navigate(["/"]);
          //location.reload(true);
        } else {
          this.alertSharedService.sendAlertEvent({
            response: "Error",
            msg: "Check your internet connection",
          });
        }

        const error = err.error.message || err.statusText;
        return throwError(error);
      })
    );
  }
}
