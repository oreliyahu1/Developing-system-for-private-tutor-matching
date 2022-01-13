import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment'
import { Response, Faq } from '@app/models'

@Injectable({ providedIn: 'root' })
export class FaqService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Faq[]>(`${environment.apiUrl}/faqs/all`);
    }

    getById(id: number) {
        return this.http.get<Faq>(`${environment.apiUrl}/faqs/${id}`);
    }

    add(faq: Faq) {
        return this.http.post<Response>(`${environment.apiUrl}/faqs/new`, faq);
    }

    delete(id: number) {
        return this.http.delete<Response>(`${environment.apiUrl}/faqs/${id}`);
    }

    update(faq: Faq) {
        return this.http.put<Response>(`${environment.apiUrl}/faqs/${faq._id}`, faq);
    }
}