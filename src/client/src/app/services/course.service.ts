import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "@environments/environment";
import { Response, Course } from "@app/models";

@Injectable({ providedIn: "root" })
export class CourseService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Course[]>(`${environment.apiUrl}/courses/all`);
  }

  getById(id: number) {
    return this.http.get<Course>(`${environment.apiUrl}/courses/${id}`);
  }

  add(courses: Course) {
    return this.http.post<Response>(`${environment.apiUrl}/courses/new`, courses);
  }

  delete(id: number) {
    return this.http.delete<Response>(`${environment.apiUrl}/courses/${id}`);
  }

  update(courses: Course) {
    return this.http.put<Response>(`${environment.apiUrl}/courses/${courses._id}`, courses);
  }
}
