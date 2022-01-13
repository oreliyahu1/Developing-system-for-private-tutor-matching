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
  templateUrl: "password.component.html",
})
export class PasswordComponent implements OnInit {
  forgetPasswordForm: FormGroup;
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
    this.forgetPasswordForm = this.formBuilder.group({
      email: ["", Validators.required],
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.forgetPasswordForm.invalid || this.loading) {
      return;
    }

    this.loading = true;
    this.userService
      .forgotPassword(this.forgetPasswordForm.value)
      .pipe(first())
      .subscribe((data) => {
        this.sharedAlertService.sendAlertEvent(data);
        if(data.response == 'Success'){
          setTimeout(() => {  this.router.navigate(['/login']); }, 2000);
        }
      });
    this.loading = false;
  }
}
