import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserModel } from './models/UserModel';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  private isUserLoggedIn!: BehaviorSubject<boolean>;
  private storage: Storage;
  private user!: UserModel;

  constructor() {
    this.storage = sessionStorage;
    this.tryReadUser();
  }

  private tryReadUser() {
    let userString = this.storage.getItem('user');
    this.isUserLoggedIn = new BehaviorSubject(!!userString);
    this.user = JSON.parse(userString!);
  }

  public getUser(): UserModel {
    return this.user;
  }

  public getIsUserLogged$(): Observable<boolean> {
    return this.isUserLoggedIn.asObservable();
  }
}
