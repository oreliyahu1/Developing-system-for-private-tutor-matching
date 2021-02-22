import { AfterViewInit, Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from "@app/services";
import { first } from "rxjs/operators";
import { User } from "@app/models";

@Component({
  templateUrl: "./results.component.html",
})

export class SearchResultsComponent implements OnInit, AfterViewInit {
  ngAfterViewInit(): void {}
  public displayedColumns = ["icon", "details", "grade", "cost"];

  maxSize: number = 5;
  bigCurrentPage: number = 1;
  bigTotalItems: number = 0;
  itemsPerPage: number = 10;
  dataSource: User[] = [];
  dataSourceAll: User[] = [];

  courseName: string = "";

  sortType = "firstname";
  sortReverse = false;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService
  ) {}

  divideItems(current, total, perpage) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.courseName = params["course"];
      //get tutors from server with course name
      this.userService
      .getSuitableTutors(this.courseName)
      .pipe(first())
      .subscribe((res) => {
        this.dataSource = res;
        this.dataSourceAll = res;
        this.bigTotalItems = res.length;
        this.dataSource = this.dataSourceAll.slice(0, this.itemsPerPage);
      });
    });
  }

  itemspage(num: number) {
    if (this.bigCurrentPage == 1) {
      this.itemsPerPage = num;
      var t = { page: this.bigCurrentPage, itemsPerPage: num };
      this.paginate(t);
    }
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
    if (text === "firstname") {
      this.sortType = "firstname";
      if (this.sortReverse) {
        this.dataSource.sort((a, b) => a.firstname.localeCompare(b.firstname));
      } else {
        this.dataSource.reverse();
      }
    } else if (text === "matchingGrade") {
      this.sortType = "matchingGrade";
      if (this.sortReverse) {
        this.dataSource.sort((a, b) => a.matchingGrade - b.matchingGrade);
      } else {
        this.dataSource.reverse();
      }
    } else if (text === "costPerHour") {
      this.sortType = "costPerHour";
      if (this.sortReverse) {
        this.dataSource.sort((a, b) => a.costPerHour - b.costPerHour);
      } else {
        this.dataSource.reverse();
      }
    }
    this.sortReverse = !this.sortReverse;
  }

  requestMeeting(tutorid: number) {
    this.router.navigateByUrl("/search/" + this.courseName + "/" + tutorid);
  }
}
