import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SharedUserService{
  userType = new Subject<string>();

  sendLoginState(status : string){
    this.userType.next(status);
  }

  getLoginStateEvent(): Observable<string>{ 
    return this.userType.asObservable();
  }
}