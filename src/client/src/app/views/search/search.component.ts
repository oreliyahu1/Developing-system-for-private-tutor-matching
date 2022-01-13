import { Component, OnInit } from "@angular/core";
import { first } from "rxjs/operators";
import { CourseService } from "@app/services";
import { Course } from "@app/models";
import { Router } from "@angular/router";
import { SharedAlertService } from "@app/pipelines";

@Component({
  templateUrl: "./search.component.html",
})

export class SearchComponent implements OnInit {
  serverCourses: Course[] = [];
  courseName: string = "";
  resCourses: Course[] = [];
  isCollapsed: boolean = true;

  constructor(
    private courseService: CourseService,
    private router: Router,
    private sharedAlertService: SharedAlertService
  ) {}

  ngOnInit(): void {
    this.courseService
      .getAll()
      .pipe(first())
      .subscribe((data) => {
        this.serverCourses = data;
    });
  }

  startWith(preCourse: string) {
    let coursesRe: Course[] = [];
    if (preCourse.length == 0) {
      return coursesRe;
    }

    for(const course of this.serverCourses) {
      if (course.name.startsWith(preCourse)) {
        coursesRe.push(course);
      }
    }

    return coursesRe;
  }

  displayOffer(event: any) {
    const courses = this.startWith(this.courseName);

    if (courses.length == 0) {
      this.resCourses = [];
      this.isCollapsed = true;
      return;
    }

    this.resCourses = courses;
    this.isCollapsed = false;
  }

  getBoldName(course: string) {
    let withBold = "";
    if (!course.startsWith(this.courseName)) {
      return withBold;
    }

    withBold = "<b>" + this.courseName + "</b>";
    withBold += course.replace(this.courseName, "");
    return withBold;
  }

  collapsed(event: any): void {}

  expanded(event: any): void {}

  search(itemname: string) {
    this.router.navigateByUrl("/search/" + itemname);
  }
}
