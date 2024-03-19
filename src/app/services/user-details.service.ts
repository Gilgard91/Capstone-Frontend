import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserDetailsService {
  userEmailSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  userEmail$ = this.userEmailSubject.asObservable();

  userFirstNameSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );
  userFirstName$ = this.userFirstNameSubject.asObservable();

  setUserEmail(userEmail: string) {
    this.userEmailSubject.next(userEmail);
  }

  setUserFirstName(userFirstName: string) {
    this.userFirstNameSubject.next(userFirstName);
  }
}
