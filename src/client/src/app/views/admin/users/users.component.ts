import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { User } from "@app/models";
import { UserService } from "@app/services";
import { ProfileDialogComponent } from "@app/views/profile-dialog/profile-dialog.component";
import { first } from "rxjs/operators";

@Component({
  templateUrl: "users.component.html",
})
export class UsersComponent implements OnInit {
  DatasourceAll: User[] = [];
  Datasource: User[] = [];

  maxSize: number = 5;
  bigCurrentPage: number = 1;
  bigTotalItems: number = 0;
  itemsPerPage: number = 10;

  search_input: string = ""

  constructor(private userService: UserService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadData();
  }

  openEdit(item_id) {
    let dialogRef = this.dialog.open(ProfileDialogComponent, {
      data: {
        user_id: item_id,
      },
    });

    dialogRef.afterClosed().subscribe((data) => {
      this.loadData();
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
      this.Datasource = this.DatasourceAll.filter(x => x.email.toLowerCase().startsWith(this.search_input) ||
       x._id.toString().toLowerCase().startsWith(this.search_input) || x.firstname.toLowerCase().startsWith(this.search_input) ||
       x.lastname.toLowerCase().startsWith(this.search_input) || x.type.toLowerCase().startsWith(this.search_input) )
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

  loadData() {
    this.userService
      .getAll()
      .pipe(first())
      .subscribe((data) => {
        this.bigCurrentPage = 1;
        this.DatasourceAll = data;
        this.Datasource = this.DatasourceAll.slice(0, this.itemsPerPage);
        this.bigTotalItems = this.DatasourceAll.length;
    });
  }
}
