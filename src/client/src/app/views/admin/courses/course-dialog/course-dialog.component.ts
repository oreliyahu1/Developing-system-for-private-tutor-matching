import { Component, OnInit } from "@angular/core";
import { first } from "rxjs/operators";
import { Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Course } from '@app/models'
import { CourseService } from "@app/services";
import { SharedAlertService } from "@app/pipelines";

@Component({
  selector: "app-course-dialog",
  templateUrl: "./course-dialog.component.html",
})

export class CourseDialogComponent implements OnInit
{
  course: Course = new Course();
  action: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) private mat_data: any,
    private courseService: CourseService,
    private sharedAlertService: SharedAlertService) {}

  ngOnInit(): void {
    this.action = (this.mat_data.item_id == null) ? "add" : "edit";

    if (this.action == "edit"){
      this.courseService
      .getById(this.mat_data.item_id)
      .pipe(first())
      .subscribe((data) => {
        this.course = data;
      });
    }
    else {
      this.course = new Course();
    }
  }

  close() {
  }

  save()
  {
    switch (this.action){
      case "edit":
        this.courseService
        .update(this.course)
        .pipe(first())
        .subscribe((data) => {
          this.sharedAlertService.sendAlertEvent(data);
        });
        break
      case "add":
        this.courseService
        .add(this.course)
        .pipe(first())
        .subscribe((data) => {
          this.sharedAlertService.sendAlertEvent(data);
        });
        break
    }
  }
}
