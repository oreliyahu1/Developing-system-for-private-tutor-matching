import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "@environments/environment";
import { User, Response, Course } from "@app/models";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class UserService {
  currentUserSubject: BehaviorSubject<User>;
  currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem("currentUser"))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  isLoggin(): boolean {
    return this.currentUserValue != null;
  }

  private get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  getCurrentUserValue(): User {
    return { ...this.currentUserSubject.value };
  }

  signup(user: User) {
    return this.http.post<Response>(`${environment.apiUrl}/users/signup`, user);
  }

  getSuitableTutors(course: string) {
    return this.http.get<User[]>(`${environment.apiUrl}/users/suitabletutors/${this.currentUserValue._id}/${course}`);
  }

  getById(id: number) {
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
  }

  calcMatchingGrade(t_id: Number) {
    return this.http.get<User>(`${environment.apiUrl}/users/calcgrade/${this.currentUserValue._id}/${t_id}`);
  }

  forgotPassword(user: User) {
    return this.http.post<Response>(`${environment.apiUrl}/users/forgotpassword`,user);
  }

  getAll() {
    return this.http.get<User[]>(`${environment.apiUrl}/users/all`);
  }

  login(user: User) {
    return this.http
      .post<Response>(`${environment.apiUrl}/users/login`, user)
      .pipe(
        map((response) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          if (response.data) {
            localStorage.setItem("currentUser", JSON.stringify(response.data));
            this.currentUserSubject.next(response.data);
            console.log(this.currentUserSubject);
          }
          return response;
        })
      );
  }

  update(user: User) {
    return this.http.put<Response>(`${environment.apiUrl}/users/${user._id}`, user);
  }

  refreshData() {
    return this.http
      .get<User>(`${environment.apiUrl}/users/${this.currentUserValue._id}`)
      .pipe(
        map((response) => {
          if (response) {
            response.token = this.currentUserValue.token;
            localStorage.setItem("currentUser", JSON.stringify(response));
            this.currentUserSubject.next(response);
          }
        })
      );
  }

  logout() {
    localStorage.removeItem("currentUser");
    this.currentUserSubject.next(null);
    return this.http.post<Response>(`${environment.apiUrl}/users/logout`, "");
  }
}
