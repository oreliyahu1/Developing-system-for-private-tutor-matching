import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "@environments/environment";
import { Response, Meeting } from "@app/models";

@Injectable({ providedIn: "root" })
export class MeetingService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Meeting[]>(`${environment.apiUrl}/meetings/all`);
  }

  getByUserId(uid: number) {
    return this.http.get<Meeting[]>(`${environment.apiUrl}/meetings/all/${uid}`);
  }

  getById(id: number) {
    return this.http.get<Meeting>(`${environment.apiUrl}/meetings/${id}`);
  }

  add(meeting: Meeting) {
    return this.http.post<Response>(`${environment.apiUrl}/meetings/new`, meeting);
  }

  delete(id: number) {
    return this.http.delete<Response>(`${environment.apiUrl}/meetings/${id}`);
  }

  update(meeting: Meeting) {
    return this.http.put<Response>(`${environment.apiUrl}/meetings/${meeting._id}`, meeting);
  }
}
