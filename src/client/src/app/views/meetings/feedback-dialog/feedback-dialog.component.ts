import { Component, OnInit } from "@angular/core";
import { Feedback, Questionnaire, FeedbackType, UserType } from "@app/models";
import { FeedbackService, QuestionnaireService, UserService } from "@app/services";
import { first } from "rxjs/operators";
import { Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { SharedAlertService } from "@app/pipelines";

@Component({
  selector: "app-feedback-dialog",
  templateUrl: "./feedback-dialog.component.html",
})
export class FeedbackDialogComponent implements OnInit {
  //passed data contains user id to give feedback on him!
  constructor(
    @Inject(MAT_DIALOG_DATA) public data_passed: any,
    private questionnaireService: QuestionnaireService,
    private userService: UserService,
    private Feedbackservice : FeedbackService,
    private sharedAlertService : SharedAlertService
  ) {}

  givenFeedback: any = {};
  data = new Questionnaire();
  AnswerFeedback: Array<number> = [];
  feedbacktype;
  myweights = [];
  feedbackgrade: number = 0;
  ngOnInit(): void {
    this.myweights = this.userService.getCurrentUserValue().weights_vector.wght;
    //get questionare to give a feedback
    switch (this.userService.getCurrentUserValue().type) {
      case UserType.Student:
        this.feedbacktype = FeedbackType.SST;
        this.questionnaireService
          .getLastTutorQuestionnaire()
          .pipe(first())
          .subscribe((data) => {
            this.AnswerFeedback = new Array(data.questions.length).fill(1);
            this.data = data;
            console.log(this.data);
          });
        break;
      case UserType.Tutor:
        this.feedbacktype = FeedbackType.TTS;
        this.questionnaireService
          .getLastStudentQuestionnaire()
          .pipe(first())
          .subscribe((data) => {
            this.AnswerFeedback = new Array(data.questions.length).fill(1);
            this.data = data;
            console.log(this.data);
          });
        break;
      default:
        break;
    }
  }

  onChangeAns() {
    console.log(this.AnswerFeedback);
    console.log(this.myweights);
    var grade = 0;

    for (var i = 0; i < this.myweights.length; i++) {
      grade +=
        (this.AnswerFeedback[i] / this.data.questions[i].grade_rate) *
        this.myweights[i];
    }
    this.feedbackgrade = grade;
  }

  close() {
    console.log("closed");
  }

  save() {
    this.givenFeedback.meeting = this.data_passed.meetingid;
    this.givenFeedback.from_user = this.userService.getCurrentUserValue()._id;
    this.givenFeedback.to_user = this.data_passed.user1;
    this.givenFeedback.type = this.feedbacktype;
    if (this.feedbackgrade >= 55) {
      this.givenFeedback.good = true;
    } else {
      this.givenFeedback.good = false;
    }
    this.givenFeedback.from_user_feedback_answers_vector = {
      q_id: this.data._id,
      ans: this.AnswerFeedback,
    };

    this.Feedbackservice
          .add(this.givenFeedback)
          .pipe(first())
          .subscribe((data) => {
            this.sharedAlertService.sendAlertEvent(data);
    });
  
  }
}
