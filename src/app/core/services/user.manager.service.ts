import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
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
      Address: user.address
    });
  }

  public updateUser(): Observable<any> {
    return EMPTY;
  }
}
