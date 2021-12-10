import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  private static userInfo: BehaviorSubject<{ loggedIn: boolean, userName: string }> =
    new BehaviorSubject<{ loggedIn: boolean, userName: string }>({ loggedIn: false, userName: '' });
  private storage: Storage;
  private user: { userName: string, jwtToken: string } = { userName: '', jwtToken: '' };
  private lastUserSync!: string;

  constructor(private httpClient: HttpClient) {
    this.storage = localStorage;
    this.tryReadUser();
  }

  public confirmEmail(token: string, email: string): Observable<any> {
    return this.httpClient.post(`createaccount/confirmation-email?token=${encodeURIComponent(token)}&email=${email}`
      , {});
  }

  public resetPassword(token: string, email: string, password: string): Observable<any> {
    return this.httpClient.post(`createaccount/reset-password?token=${encodeURIComponent(token)}&email=${email}`,
      { password });
  }

  public login(username: string, password: string): Observable<any> {
    return this.httpClient.post('users/authenticate', {
      Username: username,
      Password: password
    }).pipe(
      tap((item: any) => {
        this.storage.setItem('user', JSON.stringify({
          userName: username,
          jwtToken: item?.jwtToken
        }));
        this.tryReadUser();
      })
    );
  }

  public logout(): void {
    this.storage.removeItem('user');
    this.tryReadUser();
    this.httpClient.post('users/revoke-token', {}).subscribe();
  }

  public refreshToken(): Observable<any> {
    return this.httpClient.post('users/refresh-token', {})
      .pipe(
        tap((response: any) => {
          this.storage.setItem('user', JSON.stringify({
            userName: response.username,
            jwtToken: response.jwtToken
          }));
          this.tryReadUser();
        })
      )
  }

  public get User(): { userName: string, jwtToken: string } {
    return this.user;
  }

  public get getUserInfo$(): Observable<{ loggedIn: boolean, userName: string }> {
    return AuthentificationService.userInfo.asObservable();
  }

  public get getIsUserLogged(): boolean {
    return AuthentificationService.userInfo.value.loggedIn;
  }

  public syncUserWithStorage(): boolean {
    if (this.lastUserSync !== this.storage.getItem('lastUserSync')) {
      this.tryReadUser();
      return true;
    }

    return false
  }

  private tryReadUser() {
    let userString = this.storage.getItem('user');
    this.storage.setItem('lastUserSync', Date.now().toString());
    this.lastUserSync = this.storage.getItem('lastUserSync')!;

    if (userString) {
      this.user = JSON.parse(userString!);
    } else {
      this.user.jwtToken = '';
      this.user.userName = '';
    }

    if (
      AuthentificationService.userInfo.value.loggedIn != !!userString
      || AuthentificationService.userInfo.value.userName != this.user.userName
    ) {
      AuthentificationService.userInfo.next({ loggedIn: !!userString, userName: this.user.userName });
    }
  }
}