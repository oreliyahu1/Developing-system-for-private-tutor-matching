import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Questionnaire } from "@app/models";
import { QuestionnaireService, UserService } from "@app/services";
import { first } from "rxjs/operators";
import { SharedAlertService } from "@app/pipelines/alert.service";
import { Router } from '@angular/router';

@Component({
  templateUrl: "register.component.html",
})

export class RegisterComponent implements OnInit {
  student_questionnaire: any = {};
  tutor_questionnaire: any = {};

  answerVector: Array<Number> = [];

  userForm: FormGroup;
  loading = false;

  options: string[] = ["Israel", "Philipines", "United States"];
  options2: string[];
  selected_country: string;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private questionnaireService: QuestionnaireService,
    private sharedAlertService: SharedAlertService
  ) {
    this.userForm = this.formBuilder.group({
      firstname: ["", Validators.required],
      lastname: ["", Validators.required],
      email: ["", [Validators.required]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      City: ["", [Validators.required]],
      Street: ["", [Validators.required]],
    });
  }

  isValidInput(fieldName): boolean {
    return (
      this.userForm.controls[fieldName].invalid &&
      (this.userForm.controls[fieldName].dirty ||
        this.userForm.controls[fieldName].touched)
    );
  }

  ngAfterViewInit() {
  }

  ngOnInit(): void {
    this.questionnaireService
      .getLastStudentQuestionnaire()
      .pipe(first())
      .subscribe((data) => {
        this.student_questionnaire = data;
        this.answerVector = new Array(data.questions.length).fill(1);
    });

    this.questionnaireService
    .getLastTutorQuestionnaire()
    .pipe(first())
    .subscribe((data) => {
      this.tutor_questionnaire = data;
    });
  }

  searchCountry(event: any) {
    console.log(event);
    this.options2 = this.options.filter(
      (value) => value.toLowerCase().indexOf(event.toLowerCase()) === 0
    );
  }

  onSubmit() {
    const controls = this.userForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        console.log(name + " is invalid!");
      }
    }

    if (!this.options.includes(this.selected_country)) {
      this.sharedAlertService.sendAlertEvent({
        response: "Error",
        msg: "Please Fill the Country!",
      });
      return;
    }

    if (this.userForm.invalid || this.loading) {
      return;
    }

    var t = this.userForm.value;
    t["answers_vector"] = { q_id: this.student_questionnaire._id, ans: this.answerVector };
    t["weights_vector"] = { q_id: this.tutor_questionnaire._id, wght: this.tutor_questionnaire.weights };
    t["type"] = "Student";
    t["location"] = {
      country: this.selected_country,
      city: controls["City"].value,
      street: controls["Street"].value,
    };

    this.loading = true;
    this.userService
      .signup(this.userForm.value)
      .pipe(first())
      .subscribe((data) => {
        this.sharedAlertService.sendAlertEvent(data);
        if (data.response == "Success") {
          this.router.navigate(["/login"]);
        }
      });

    this.loading = false;
  }
}
