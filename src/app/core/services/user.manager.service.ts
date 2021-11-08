import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserModel } from 'src/app/models/UserModel';

@Injectable({
  providedIn: 'root'
})
export class UserManagerService {
  constructor(private httpClient: HttpClient) { }

  public createUser(user: UserModel, password: string): Observable<any> {
    return this.httpClient.post(`createaccount?confirmationUrl=${window.location.origin + '/confirmationEmail'}`, {
      Name: user.name,
      Email: user.email,
      Phone: user.phone,
      Password: password,
      Address: user.address,
      Birth: user.birth
    });
  }

  public updateUser(user: UserModel, password: string): Observable<UserModel> {
    return this.httpClient.post<UserModel>('users', { ...user, Password: password });
  }

  public getUser(username: string): Observable<UserModel> {
    return this.httpClient.get<UserModel>(`users/${username}`);
  }

  public getAllUser(): Observable<UserModel[]> {
    return this.httpClient.get<UserModel[]>('users');
  }
}