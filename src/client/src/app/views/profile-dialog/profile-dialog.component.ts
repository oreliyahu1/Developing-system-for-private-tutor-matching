import { Component, OnInit } from "@angular/core";
import { first } from "rxjs/operators";
import { Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { User, Location, Course, Certificate } from '@app/models'
import { CertificateService, CourseService, UserService } from "@app/services";
import { SharedAlertService } from "@app/pipelines";

@Component({
  selector: "app-profile-dialog",
  templateUrl: "./profile-dialog.component.html",
})

export class ProfileDialogComponent implements OnInit
{
  user: User;
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
    @Inject(MAT_DIALOG_DATA) private mat_data: any,
    private userService: UserService,
    private courseService: CourseService,
    private certificateService: CertificateService,
    private sharedAlertService: SharedAlertService) {}

  ngOnInit(): void {
    this.user = new User();
    this.user.location = new Location();
    this.userService
    .getById(this.mat_data.user_id)
    .pipe(first())
    .subscribe((data) => {
      this.user = data;
      this.selectedCertificatesItems = this.user.certificates;
      this.selectedCoursesItems = this.user.courses;
    });

    this.courseService
    .getAll()
    .pipe(first())
    .subscribe((data) => {
      this.coursesList = data;
    });

    this.certificateService
    .getAll()
    .pipe(first())
    .subscribe((data) => {
      this.certificatesList = data;
    });
  }

  close() {
  }

  save()
  {
    let selectedCourses = [];
    for (let selectedCourse of this.selectedCoursesItems) {
      selectedCourses.push(selectedCourse._id);
    }

    let selectedCertificates = []
    for (let selectedCertificate of this.selectedCertificatesItems) {
      selectedCertificates.push(selectedCertificate._id);
    }

    this.user.courses = selectedCourses;
    this.user.certificates = selectedCertificates;
    this.userService
    .update(this.user)
    .pipe(first())
    .subscribe((data) => {
      this.sharedAlertService.sendAlertEvent(data);
    });
  }
}
