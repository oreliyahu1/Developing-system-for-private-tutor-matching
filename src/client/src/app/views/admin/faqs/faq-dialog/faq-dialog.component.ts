import { Component, OnInit } from "@angular/core";
import { first } from "rxjs/operators";
import { Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Faq } from '@app/models'
import { FaqService } from "@app/services";
import { SharedAlertService } from "@app/pipelines";

@Component({
  selector: "app-faq-dialog",
  templateUrl: "./faq-dialog.component.html",
})

export class FaqDialogComponent implements OnInit
{
  faq: Faq = new Faq();
  action: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) private mat_data: any,
    private faqService: FaqService,
    private sharedAlertService: SharedAlertService) {}

  ngOnInit(): void {
    this.action = (this.mat_data.item_id == null) ? "add" : "edit";

    if (this.action == "edit"){
      this.faqService
      .getById(this.mat_data.item_id)
      .pipe(first())
      .subscribe((data) => {
        this.faq = data;
      });
    }
    else {
      this.faq = new Faq();
    }
  }

  close() {
  }

  save()
  {
    switch (this.action){
      case "edit":
        this.faqService
        .update(this.faq)
        .pipe(first())
        .subscribe((data) => {
          this.sharedAlertService.sendAlertEvent(data);
        });
        break
      case "add":
        this.faqService
        .add(this.faq)
        .pipe(first())
        .subscribe((data) => {
          this.sharedAlertService.sendAlertEvent(data);
        });
        break
    }
  }
}
