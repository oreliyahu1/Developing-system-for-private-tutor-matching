import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment'
import { Response, Certificate } from '@app/models'

@Injectable({ providedIn: 'root' })
export class CertificateService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Certificate[]>(`${environment.apiUrl}/certificates/all`);
    }

    getById(id: number) {
        return this.http.get<Certificate>(`${environment.apiUrl}/certificates/${id}`);
    }

    add(certificate: Certificate) {
        return this.http.post<Response>(`${environment.apiUrl}/certificates/new`, certificate);
    }

    delete(id: number) {
        return this.http.delete<Response>(`${environment.apiUrl}/certificates/${id}`);
    }

    update(certificate: Certificate) {
        return this.http.put<Response>(`${environment.apiUrl}/certificates/${certificate._id}`, certificate);
    }
}