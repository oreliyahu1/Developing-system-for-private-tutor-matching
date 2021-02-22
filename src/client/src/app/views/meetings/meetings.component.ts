import { Component, OnInit, ViewChild } from "@angular/core";
import { MeetingService, UserService, QuestionnaireService } from "@app/services";
import { first } from "rxjs/operators";
import { socketServices } from "@app/services/socketServices";
import { Router } from "@angular/router";
import { ModalDirective } from "ngx-bootstrap/modal";
import { SharedAlertService } from "@app/pipelines";
import { MatDialog } from "@angular/material/dialog";
import { FeedbackDialogComponent } from "./feedback-dialog/feedback-dialog.component";
import { Questionnaire, Meeting, MeetingStatus, UserType } from "@app/models";

@Component({
  templateUrl: "./meetings.component.html",
})
export class MeetingsComponent implements OnInit {
  @ViewChild("myModal") public myModal: ModalDirective;
  @ViewChild("myModal2") public myModal2: ModalDirective;

  sortType = "time";
  sortReverse = false;
  maxSize: number = 5;
  bigCurrentPage: number = 1;
  bigTotalItems: number = 0;
  itemsPerPage: number = 10;

  studentLastQuestionnaire: Questionnaire;
  tutorLastQuestionnaire: Questionnaire;

  dataSource: Meeting[] = [];
  dataSourceAll: Meeting[] = [];

  selected_meeting: number = 0;

  datetime: string;

  constructor(
    private meetingService: MeetingService,
    private userService: UserService,
    private questionnaireService: QuestionnaireService,
    private socketService: socketServices,
    private sharedAlertService: SharedAlertService,
    private router: Router,
    private feedbackdialog: MatDialog
  ) {}
  
  ngOnInit(): void {
    this.datetime = this.DateLocale(Date().toLocaleLowerCase()).toString();
    console.log(this.datetime);

    this.bigTotalItems = 0;
    this.studentLastQuestionnaire = new Questionnaire();
    this.tutorLastQuestionnaire = new Questionnaire();
    this.loadMeetings();
  }

  calcMatcingGrade(weights_vector: number[], answers_vector: number[], questionare: Questionnaire) {
    var mg = 0;
    for (let i = 0; i < answers_vector.length; i++){
      mg += weights_vector[i] * (answers_vector[i] / questionare.questions[i].grade_rate);
    }
    return mg;
  }

  loadMeetings() {
    this.meetingService
    .getByUserId(this.userService.getCurrentUserValue()._id)
    .pipe(first())
    .subscribe((res) => {

      this.questionnaireService
      .getLastTutorQuestionnaire()
      .pipe(first())
      .subscribe((tq) => {
        this.tutorLastQuestionnaire = tq;

        this.questionnaireService
        .getLastStudentQuestionnaire()
        .pipe(first())
        .subscribe((st) => {
          this.studentLastQuestionnaire = st;

          for(let i = 0; i < res.length; i++) {
            switch (this.userService.getCurrentUserValue().type) {
              case UserType.Student:
                res[i].matchingGrade = this.calcMatcingGrade(res[i].tutor.weights_vector.wght, res[i].student.answers_vector.ans, this.studentLastQuestionnaire);
                break;
              case UserType.Tutor:
                res[i].matchingGrade = this.calcMatcingGrade(res[i].student.weights_vector.wght, res[i].tutor.answers_vector.ans, this.tutorLastQuestionnaire);
                break;
              default:
                res[i].matchingGrade = 0;
                break;
            }
          }

          this.dataSourceAll = res;
          this.dataSource = this.dataSourceAll.slice(0, this.itemsPerPage);
          this.bigTotalItems = this.dataSourceAll.length;
        });
      });
    });
  }

  paginate(event: any) {
    this.bigCurrentPage = event.page;
    var begin: number;
    var end: number;
    begin = (this.bigCurrentPage - 1) * this.itemsPerPage;
    end = Number.parseInt(begin.toString()) + Number.parseInt(this.itemsPerPage.toString());
    this.dataSource = this.dataSourceAll.slice(begin, end);
  }

  sortFunc(text: string) {
    if (text === "time") {
      this.sortType = "time";
      if (this.sortReverse) {
        this.dataSource.sort((a, b) =>
          a.time.toString().localeCompare(b.time.toString())
        );
      } else {
        this.dataSource.reverse();
      }
    }
    this.sortReverse = !this.sortReverse;
  }

  join_room(id: Number) {
    this.socketService.set_room(id);
    this.router.navigateByUrl("/videochat");
  }

  TimeLocale(datetime: string) {
    var date = new Date(datetime);
    return date.toLocaleTimeString();
  }

  DateLocale(datetime: string) {
    var date = new Date(datetime);
    return date.toLocaleDateString();
  }

  model1pre(id: number) {
    this.selected_meeting = id;
    this.myModal.show();
  }

  ResponseMeeting(status) {
    var meeting: any = Object.assign(
      {},
      this.dataSourceAll.find((m) => m._id == this.selected_meeting)
    );
    meeting.student = meeting.student._id;
    meeting.tutor = meeting.tutor._id;
    meeting.status = status;
    this.meetingService
    .update(meeting)
    .pipe(first())
    .subscribe((res) => {
      this.sharedAlertService.sendAlertEvent(res);
      //update the datasource
      if (res.response == "Success") {
        var meetingu = this.dataSourceAll.find(
          (m) => m._id == this.selected_meeting
        );
        meetingu.status = status;
      }
    });

    if (status == MeetingStatus.Approved) {
      this.myModal.hide();
    } else {
      this.myModal2.hide();
    }
  }

  model2pre(id: number) {
    this.selected_meeting = id;
    this.myModal2.show();
  }

  GiveFeedback(id: number, mid: number) {
    let fbDialog = this.feedbackdialog.open(FeedbackDialogComponent, {
      data: {
        user1: id,
        meetingid: mid,
      },
    });
    
    fbDialog.afterClosed().subscribe(res=> {
      this.bigTotalItems = 0;
      this.loadMeetings();
    });
  }
}
