import { Component, OnInit } from "@angular/core";
import { first } from "rxjs/operators";
import { Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Certificate } from '@app/models'
import { CertificateService } from "@app/services";
import { SharedAlertService } from "@app/pipelines";

@Component({
  selector: "app-certificate-dialog",
  templateUrl: "./certificate-dialog.component.html",
})

export class CertificateDialogComponent implements OnInit
{
  certificate: Certificate = new Certificate();
  action: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) private mat_data: any,
    private certificateService: CertificateService,
    private sharedAlertService: SharedAlertService) {}

  ngOnInit(): void {
    this.action = (this.mat_data.item_id == null) ? "add" : "edit";

    if (this.action == "edit"){
      this.certificateService
      .getById(this.mat_data.item_id)
      .pipe(first())
      .subscribe((data) => {
        this.certificate = data;
      });
    }
    else {
      this.certificate = new Certificate();
    }
  }

  close() {
  }

  save()
  {
    switch (this.action){
      case "edit":
        this.certificateService
        .update(this.certificate)
        .pipe(first())
        .subscribe((data) => {
          this.sharedAlertService.sendAlertEvent(data);
        });
        break
      case "add":
        this.certificateService
        .add(this.certificate)
        .pipe(first())
        .subscribe((data) => {
          this.sharedAlertService.sendAlertEvent(data);
        });
        break
    }
  }
}
