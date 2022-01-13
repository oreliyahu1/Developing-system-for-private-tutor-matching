import { Component, OnInit, ViewChild } from "@angular/core";
import { User, Location, MIN_MATCHING_GRADE, Meeting, MeetingStatus } from "@app/models";
import { Router, ActivatedRoute } from "@angular/router";
import { QuestionnaireService, MeetingService, UserService } from "@app/services";
import { first } from "rxjs/operators";
import { ModalDirective } from "ngx-bootstrap/modal";
import { SharedAlertService } from "@app/pipelines";

@Component({
  templateUrl: "./requestmeeting.component.html",
})
export class requestmeetingComponent implements OnInit {
  @ViewChild("myModal") public myModal: ModalDirective;
  tutor: User;

  DateTime = "";
  course = "";
  percent_student = [];
  questions = [];

  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
  };
  public barChartLabels: string[] = [];
  public barChartType = "bar";
  public barChartLegend = true;

  public barChartData: any[] = [
    {
      data: [],
      label: "Tutor weight",
    },
    {
      data: [],
      label: "Student answer",
    },
  ];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private questionnaireService: QuestionnaireService,
    private meetingService: MeetingService,
    private sharedAlertService: SharedAlertService
  ) {}

  public chartClicked(e: any): void {
  }

  public chartHovered(e: any): void {
  }

  ngOnInit(): void {
    this.tutor = new User();
    this.tutor.courses = new Array();
    this.tutor.location = new Location();
    
    this.activatedRoute.params.subscribe(
      (params) => (this.course = params["course"])
    );
    this.activatedRoute.params.subscribe(
      (params) => (this.tutor._id = params["tutor"])
    );
    
    this.userService
    .calcMatchingGrade(this.tutor._id)
    .pipe(first())
    .subscribe((res) => {
      this.tutor = res;
      if (this.tutor.matchingGrade < MIN_MATCHING_GRADE){
        this.router.navigate(["/search"]);
      }
      this.initBarChartLabels();
    });
  }

  initBarChartLabels() {
    this.barChartData[0].data = this.tutor.weights_vector.wght;
    this.questionnaireService
      .getById(this.userService.getCurrentUserValue().answers_vector.q_id)
      .pipe(first())
      .subscribe((data) => {
          var percent = [];
          for (var i = 0; i < data.questions.length; i++) {
            percent.push(this.userService.getCurrentUserValue().answers_vector.ans[i] / data.questions[i].grade_rate);
          }
          this.percent_student = percent;

          var q_student_grade = [];
          for (var i = 0; i < percent.length; i++) {
            q_student_grade.push(percent[i] * this.tutor.weights_vector.wght[i]);
          }

          this.questions = data.questions;
          this.barChartData[1].data = q_student_grade;
          for (var i = 0; i < this.percent_student.length; i++) {
            this.barChartLabels.push("Q" + (i + 1));
          }
      });
  }

  getDate(add_months): Date
  {
    let date_now = new Date();
    date_now.setMonth(date_now.getMonth() + add_months)
    return date_now;
  }

  public RequestMeeting(): void {
    this.myModal.hide();
    var c: any = this.course;
    var s: any = this.userService.getCurrentUserValue()._id;
    var t: any = this.tutor._id;
    var time: Date = new Date(this.DateTime);
    time.setSeconds(0);
    
    var m: Meeting = {
      _id: 1,
      course: c,
      student: s,
      tutor: t,
      status: MeetingStatus.Request,
      time: time,
      locatin: this.tutor.location
    };

    this.meetingService
    .add(m)
    .pipe(first())
    .subscribe((data) => {
      this.sharedAlertService.sendAlertEvent(data);
      if (data.response == "Success") {
        this.router.navigate(["/meetings"]);
      }
    });
  }
}
