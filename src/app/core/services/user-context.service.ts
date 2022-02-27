import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { UserModel } from 'src/app/models/UserModel';
import { AuthentificationService } from './authentification.service';
import { UserManagerService } from './user.manager.service';

@Injectable({
  providedIn: 'root'
})
export class UserContextService {
  private user: BehaviorSubject<UserModel> = new BehaviorSubject({} as UserModel);

  constructor(
    private authentificationService: AuthentificationService,
    private userManagerService: UserManagerService,
    private httpClient: HttpClient
  ) {
    this.authentificationService.getUserInfo$
      .pipe(
        switchMap(userInfo => userInfo.loggedIn ?
          this.userManagerService.getUser(userInfo.userName)
          : of({} as UserModel)
        ),
        map((userModel: UserModel) => {
          return { ...userModel, loggedIn: this.authentificationService.getIsUserLogged };
        })
      )
      .subscribe(userModel => this.user.next(userModel));
  }

  public get CurrentUser$(): Observable<UserModel> {
    return this.user.asObservable();
  }

  public get CurrentUser(): UserModel {
    return this.user.value;
  }

  public isInRole(roles: string[]): Observable<boolean> {
    if (!this.CurrentUser.loggedIn) return of(false);
    return this.httpClient.post<boolean>('users/isInRoles', roles);
  }

  public generateResetPasswordToken(): Observable<string> {
    return this.httpClient.post<{ token: string }>(`users/reset-password-form/${this.CurrentUser.userName}`
      , {}).pipe(map(item => item.token));
  }

  public update(name: string, phone: string, address: string): void {
    this.CurrentUser.name = name;
    this.CurrentUser.address = address;
    this.CurrentUser.phone = phone;
    this.userManagerService.updateUser(this.CurrentUser)
      .pipe(
        tap(user => this.user.next({ ...user, loggedIn: this.CurrentUser.loggedIn }))
      ).subscribe();
  }
}
