import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, switchMap, tap } from 'rxjs';
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
    private userManagerService: UserManagerService
  ) {
    this.authentificationService.getUserInfo$
      .pipe(
        switchMap(userInfo => userInfo.loggedIn ?
          this.userManagerService.getUser(userInfo.username)
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

  public update(name: string, password: string, phone: string, birthday: Date, address: string): void {
    this.CurrentUser.name = name;
    this.CurrentUser.address = address;
    this.CurrentUser.birth = birthday;
    this.CurrentUser.phone = phone;
    this.userManagerService.updateUser(this.CurrentUser, password)
      .pipe(
        tap(user => this.user.next({ ...user, loggedIn: this.CurrentUser.loggedIn }))
      ).subscribe();
  }
}
