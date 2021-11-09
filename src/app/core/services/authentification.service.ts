import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  private userInfo!: BehaviorSubject<{ loggedIn: boolean, username: string }>;
  private storage: Storage;
  private user: { username: string, jwtToken: string } = { username: '', jwtToken: '' };
  private lastUserSync!: string;

  constructor(private httpClient: HttpClient) {
    this.storage = localStorage;
    this.tryReadUser();
  }

  public confirmEmail(token: string, email: string): Observable<any> {
    return this.httpClient.post(`createaccount/confirmation-email?token=${encodeURIComponent(token)}&email=${email}`, {});
  }

  public login(username: string, password: string): Observable<any> {
    return this.httpClient.post('users/authenticate', {
      Username: username,
      Password: password
    }).pipe(
      tap((item: any) => {
        this.storage.setItem('user', JSON.stringify({
          username: username,
          jwtToken: item.jwtToken
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
            username: response.username,
            jwtToken: response.jwtToken
          }));
          this.tryReadUser();
        })
      )
  }

  public get User(): { username: string, jwtToken: string } {
    return this.user;
  }

  public get getUserInfo$(): Observable<{ loggedIn: boolean, username: string }> {
    return this.userInfo.asObservable();
  }

  public get getIsUserLogged(): boolean {
    return this.userInfo.value.loggedIn;
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
      this.user.username = '';
    }

    if (!this.userInfo) {
      this.userInfo = new BehaviorSubject({ loggedIn: !!userString, username: this.user.username });
    } else if (
      this.userInfo.value.loggedIn != !!userString
      || this.userInfo.value.username != this.user.username
    ) {
      this.userInfo.next({ loggedIn: !!userString, username: this.user.username });
    }
  }
}