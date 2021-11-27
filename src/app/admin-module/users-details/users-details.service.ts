import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserModel } from "src/app/models/UserModel";

@Injectable({
    providedIn: "root"
})
export class UsersDetailsService {

    constructor(
        private httpClient: HttpClient
    ) { }

    public getUsers(page: number, size: number): Observable<{ count: number, users: UserModel[] }> {
        return this.httpClient.get<any>(`usermanager/users/${page}/${size}`);
    }

    public deteleUser(username: string): Observable<any> {
        return this.httpClient.delete<any>(`usermanager/${username}`, {});
    }

    public getUser(username: string): Observable<UserModel> {
        return this.httpClient.get<UserModel>(`usermanager/${username}`, {});
    }

    public createUser(userModel: UserModel): Observable<UserModel> {
        return this.httpClient.post<UserModel>(`usermanager?resetUrl=${window.location.origin + '/resetPassword'}`, userModel);
    }

    public updateUser(userModel: UserModel): Observable<UserModel> {
        return this.httpClient.patch<UserModel>(`usermanager`, userModel);
    }
}