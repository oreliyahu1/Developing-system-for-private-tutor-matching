import {
  Component,
  OnInit,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentFactory,
  ComponentRef,
  ViewChild,
} from "@angular/core";
import { first } from "rxjs/operators";
import { Router } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { UserService } from "@app/services";
import { SharedAlertService } from '@app/pipelines';

@Component({
  templateUrl: "login.component.html",
})
export class LoginComponent implements OnInit {
  title = "Login";
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver,
    private userService: UserService,
    private sharedAlertService: SharedAlertService
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ["", Validators.required],
      password: ["", Validators.required],
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid || this.loading) {
      return;
    }

    this.loading = true;
    this.userService
      .login(this.loginForm.value)
      .pipe(first())
      .subscribe((data) => {
        this.sharedAlertService.sendAlertEvent(data);
        if (data.response == "Success") {
          if (this.userService.isLoggin()) {
            console.log("balagan");
            this.router.navigate(["/"]);
          }
        } else {
          console.log("err " + data.response);
        }
      });
    this.loading = false;
  }
}
