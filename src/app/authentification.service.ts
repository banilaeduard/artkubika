import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, tap } from 'rxjs';
import { UserModel } from './models/UserModel';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  private isUserLoggedIn!: BehaviorSubject<boolean>;
  private storage: Storage;
  private user: { username: string, jwtToken: string } = { username: '', jwtToken: '' };

  constructor(private httpClient: HttpClient) {
    this.storage = sessionStorage;
    this.tryReadUser();
  }


  public confirmEmail(token: string, email: string): Observable<any> {
    return this.httpClient.post(`createaccount/confirmation-email?token=${encodeURIComponent(token)}&email=${email}`, {});
  }

  public createUser(user: UserModel, password: string): Observable<any> {
    return this.httpClient.post(`createaccount?confirmationUrl=${window.location.origin + '/confirmationEmail'}`, {
      Name: user.name,
      Email: user.email,
      Phone: user.phone,
      Password: password
    });
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

  public getIsUserLogged$(): Observable<boolean> {
    return this.isUserLoggedIn.asObservable();
  }

  private tryReadUser() {
    let userString = this.storage.getItem('user');

    if (!this.isUserLoggedIn) {
      this.isUserLoggedIn = new BehaviorSubject(!!userString);
    } else {
      this.isUserLoggedIn.next(!!userString);
    }

    if (userString) {
      this.user = JSON.parse(userString!);
    } else {
      this.user.jwtToken = '';
      this.user.username = '';
    }
  }
}