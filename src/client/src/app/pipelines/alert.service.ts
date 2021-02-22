import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Response } from '@app/models'

@Injectable({
  providedIn: 'root'
})

export class SharedAlertService{
  alertMessage = new Subject<any>();

  sendAlertEvent(e : Response) {
    this.alertMessage.next(e);
  }

  getAlertEvent(): Observable<Response>{ 
    return this.alertMessage.asObservable();
  }
}