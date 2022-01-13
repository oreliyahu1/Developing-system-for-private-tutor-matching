import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment'
import { Response, Feedback } from '@app/models'

@Injectable({ providedIn: 'root' })
export class FeedbackService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Feedback[]>(`${environment.apiUrl}/feedbacks/all`);
    }

    getById(id: number) {
        return this.http.get<Feedback>(`${environment.apiUrl}/feedbacks/${id}`);
    }

    add(feedback: Feedback) {
        return this.http.post<Response>(`${environment.apiUrl}/feedbacks/new`, feedback);
    }

    delete(id: number) {
        return this.http.delete<Response>(`${environment.apiUrl}/feedbacks/${id}`);
    }

    update(feedback: Feedback) {
        return this.http.put<Response>(`${environment.apiUrl}/feedbacks/${feedback._id}`, feedback);
    }
}