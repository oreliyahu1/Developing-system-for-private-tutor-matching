import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ModalDirective } from "ngx-bootstrap/modal";
import { Faq } from "@app/models";
import { FaqService } from "@app/services";
import { FaqDialogComponent } from "@app/views/admin/faqs/faq-dialog/faq-dialog.component"
import { first } from "rxjs/operators";
import { SharedAlertService } from "@app/pipelines";

@Component({
  templateUrl: "faqs.component.html",
})
export class FaqsComponent implements OnInit {
  model_item_to_remove = null;
  @ViewChild("myModal") public myModal: ModalDirective;

  DatasourceAll: Faq[] = [];
  Datasource: Faq[] = [];

  maxSize: number = 5;
  bigCurrentPage: number = 1;
  bigTotalItems: number = 0;
  itemsPerPage: number = 10;

  search_input: string = ""

  constructor(
    private faqService: FaqService,
    private sharedAlertService: SharedAlertService,
    private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadData();
  }

  openDialog(item_id) {
    let dialogRef = this.dialog.open(FaqDialogComponent, {
      data: {
        item_id: item_id
      },
    });

    dialogRef.afterClosed().subscribe(data=>{
      this.loadData();
    });
  }

  openRemoveDialog(item_id) {
    this.model_item_to_remove = item_id;
    this.myModal.show();
  }

  removeItem() {
    this.faqService
      .delete(this.model_item_to_remove)
      .pipe(first())
      .subscribe((data) => {
        this.sharedAlertService.sendAlertEvent(data);

        this.model_item_to_remove = null;
        this.loadData();
        this.myModal.hide();
    });
  }

  loadData() {
    this.faqService
      .getAll()
      .pipe(first())
      .subscribe((data) => {
        this.bigCurrentPage = 1;
        this.DatasourceAll = data;
        this.Datasource = this.DatasourceAll.slice(0, this.itemsPerPage);
        this.bigTotalItems = this.DatasourceAll.length;
    });
  }

  search(input : string){
    if(input == ""){
      this.loadData();
    }else{
      this.bigCurrentPage = 1;
      this.updateDataSource();
      this.Datasource = this.Datasource.slice(0, this.itemsPerPage);
    }
  }

  updateDataSource(){
    if(this.search_input != ""){
      this.Datasource = this.DatasourceAll.filter(x => x._id.toString().toLowerCase().startsWith(this.search_input) ||
       x.question.toString().toLowerCase().startsWith(this.search_input) || x.answer.toLowerCase().startsWith(this.search_input));
    }else{
      this.Datasource = this.DatasourceAll;
    }
    this.bigTotalItems = this.Datasource.length;
  }

  paginate(event: any) {
    this.bigCurrentPage = event.page;
    var begin: number;
    var end: number;
    begin = (this.bigCurrentPage - 1) * this.itemsPerPage;
    end = Number.parseInt(begin.toString()) + Number.parseInt(this.itemsPerPage.toString());
    this.updateDataSource();
    this.Datasource = this.Datasource.slice(begin, end);
  }
}
