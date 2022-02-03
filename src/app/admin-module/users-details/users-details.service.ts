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
        return this.httpClient.post<UserModel>(`usermanager?resetUrl=${encodeURIComponent(window.location.origin + '/resetPassword')}`, userModel);
    }

    public updateUser(userModel: UserModel): Observable<UserModel> {
        return this.httpClient.patch<UserModel>(`usermanager`, userModel);
    }

    public addUserToRole(userName: string, role: string): Observable<any> {
        return this.httpClient.post(`usermanager/add-to-role/${userName}?role=${role}`, {});
    }

    public removeUserFromRole(userName: string, role: string): Observable<any> {
        return this.httpClient.post(`usermanager/remove-role/${userName}?role=${role}`, { userName, role });
    }

    public getUserRoles(username: string): Observable<string[]> {
        return this.httpClient.get<string[]>(`usermanager/roles/${username}`, {});
    }
}