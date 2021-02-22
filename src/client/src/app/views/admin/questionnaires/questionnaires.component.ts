import { Component, OnInit, ViewChild } from "@angular/core";
import { Questionnaire } from "@app/models";
import { QuestionnaireService } from "@app/services";
import { first } from "rxjs/operators";
import { SharedAlertService } from "@app/pipelines";

@Component({
  templateUrl: "questionnaires.component.html",
})
export class QuestionnairesComponent implements OnInit {
  DatasourceAll: Questionnaire[] = [];
  Datasource: Questionnaire[] = [];

  maxSize: number = 5;
  bigCurrentPage: number = 1;
  bigTotalItems: number = 0;
  itemsPerPage: number = 1;

  search_input: string = ""

  constructor(
    private questionnaireService: QuestionnaireService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.questionnaireService
      .getAll()
      .pipe(first())
      .subscribe((data) => {
        this.bigCurrentPage = 1;
        this.DatasourceAll = data;
        this.Datasource = this.DatasourceAll.slice(0, this.itemsPerPage);
        this.bigTotalItems = this.DatasourceAll.length;
        console.log(this.Datasource);
    });
  }

  calaDataSource(){
    var items = [];
    for(let item of this.Datasource) {
        for(let qi = 0; qi < item.questions.length; qi++) {
          items.push({id: item._id, type: item.type, qid: qi, question: item.questions[qi].name, grade_rate: item.questions[qi].grade_rate, weight: item.weights[qi]});
      }
    }
    return items;
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
       x.type.toString().toLowerCase().startsWith(this.search_input));
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
