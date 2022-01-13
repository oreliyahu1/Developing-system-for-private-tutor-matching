import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "@environments/environment";
import { Response, Questionnaire } from "@app/models";

@Injectable({ providedIn: "root" })
export class QuestionnaireService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Questionnaire[]>(`${environment.apiUrl}/questionnaires/all`);
  }

  getLastStudentQuestionnaire() {
    return this.http.get<Questionnaire>(`${environment.apiUrl}/questionnaires/getlastsq`);
  }

  getLastTutorQuestionnaire() {
    return this.http.get<Questionnaire>(`${environment.apiUrl}/questionnaires/getlasttq`);
  }

  getById(id: number) {
    return this.http.get<Questionnaire>(`${environment.apiUrl}/questionnaires/${id}`);
  }

  add(questionnaire: Questionnaire) {
    return this.http.post<Response>(`${environment.apiUrl}/questionnaires/new`, questionnaire);
  }

  delete(id: number) {
    return this.http.delete<Response>(`${environment.apiUrl}/questionnaires/${id}`);
  }

  update(questionnaire: Questionnaire) {
    return this.http.put<Response>(`${environment.apiUrl}/questionnaires/${questionnaire._id}`, questionnaire);
  }
}
