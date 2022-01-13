import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpClient,
  HttpHeaders,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { environment } from "@environments/environment";
import { first } from "rxjs/operators";
import { Variable } from "@angular/compiler/src/render3/r3_ast";
import { UserService } from "@app/services";
import { SharedUserService } from "@app/pipelines";

@Injectable()
export class SyncInterceptor implements HttpInterceptor {
  constructor(
    private userService: UserService,
    private http: HttpClient,
    private sharedUserService: SharedUserService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    if (request.headers.has("None") || !this.userService.isLoggin()) {
      return next.handle(request);
    }

    this.http
      .get<Variable>(
        `${environment.apiUrl}/sync/${this.userService.getCurrentUserValue()._id}`,
        { headers: new HttpHeaders({ None: "true" }) }
      )
      .pipe(first())
      .subscribe((data) => {
        if (data["update"]) {
          this.userService.refreshData().subscribe(() => {
            this.sharedUserService.sendLoginState(
              this.userService.getCurrentUserValue().type
            );
          });
        }
      });

    return next.handle(request);
  }
}
