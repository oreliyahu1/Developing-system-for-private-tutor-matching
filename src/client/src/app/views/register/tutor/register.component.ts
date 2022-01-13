import { Component, ElementRef } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from '@angular/router';
import { Questionnaire, Course, Certificate } from "@app/models";
import { SharedAlertService } from '@app/pipelines';
import { CourseService, CertificateService ,QuestionnaireService, UserService } from "@app/services";
import { first } from "rxjs/operators";

@Component({
  templateUrl: "register.component.html",
})
export class RegisterComponent {
  tutor_questionnaire: any = {};
  student_questionnaire: any = {};
  userForm: FormGroup;
  loading = false;

  answerVector: Array<Number> = [];

  CountryControl: FormControl = new FormControl();
  options: string[] = ["Israel", "Philipines", "United States"];
  options2: string[];
  selected_country: string;

  coursesList: Course[] = [];
  certificatesList: Certificate[] = [];
  selectedCertificatesItems = [];
  selectedCoursesItems = [];
  dropdownSettings = {
    singleSelection: false,
    idField: "_id",
    textField: "name",
    selectAllText: "Select All",
    unSelectAllText: "Remove All",
    itemsShowLimit: 5,
    allowSearchFilter: true,
  };

  constructor(
    private router: Router,
    private elementRef: ElementRef,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private questionnaireService: QuestionnaireService,
    private courseService: CourseService,
    private certificateService: CertificateService,
    private sharedAlertService: SharedAlertService
  ) {
    this.userForm = this.formBuilder.group({
      firstname: ["", Validators.required],
      lastname: ["", Validators.required],
      email: ["", [Validators.required]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      City: ["", [Validators.required]],
      Street: ["", [Validators.required]],
      costPerHour: ["", [Validators.required]],
    });
  }

  ngAfterViewInit() {
    this.CountryControl.valueChanges.subscribe((newValue) => {
      this.options2 = this.filterValues(newValue);
    });
  }

  filterValues(search: string) {
    return this.options.filter(
      (value) => value.toLowerCase().indexOf(search.toLowerCase()) === 0
    );
  }

  isValidInput(fieldName): boolean {
    return (
      this.userForm.controls[fieldName].invalid &&
      (this.userForm.controls[fieldName].dirty ||
        this.userForm.controls[fieldName].touched)
    );
  }

  onItemSelect(item: any) {
  }
  onSelectAll(items: any) {
  }

  ngOnInit(): void {
    this.questionnaireService
      .getLastTutorQuestionnaire()
      .pipe(first())
      .subscribe((data) => {
        this.tutor_questionnaire = data;
        this.answerVector = new Array(data.questions.length).fill(1);
      });

    this.questionnaireService
    .getLastStudentQuestionnaire()
    .pipe(first())
    .subscribe((data) => {
      this.student_questionnaire = data;
    });

    this.courseService
    .getAll()
    .pipe(first())
    .subscribe((data) => {
      this.coursesList = data;
      console.log(data);
    });

    this.certificateService
    .getAll()
    .pipe(first())
    .subscribe((data) => {
      this.certificatesList = data;
      console.log(data);
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


    if (this.userForm.invalid || this.loading || this.selectedCoursesItems.length < 2) {
      console.log("fill error");
      return;
    }

    var t = this.userForm.value;
    t["answers_vector"] = { q_id: this.tutor_questionnaire._id, ans: this.answerVector };
    t["weights_vector"] = { q_id: this.student_questionnaire._id, wght: this.student_questionnaire.weights };
    t["type"] = "Tutor";

    t["location"] = {
      country: this.selected_country,
      city: controls["City"].value,
      street: controls["Street"].value,
    };
    var courses_id_list = [];
    for(let element of this.selectedCoursesItems) {
      courses_id_list.push(element._id);
    }
    t["courses"] = courses_id_list;

    var cert_id_list = [];
    for(let element of this.selectedCertificatesItems) {
      cert_id_list.push(element._id);
    }
    t["certificates"] = cert_id_list;

    console.log(t)
  
    ////cast number error
    this.loading = true;
    this.userService
      .signup(this.userForm.value)
      .pipe(first())
      .subscribe((data) => {
        this.sharedAlertService.sendAlertEvent(data);
        if(data.response == 'Success'){
          this.router.navigate(['/login']);
        }
      });

    this.loading = false;
  }
}
