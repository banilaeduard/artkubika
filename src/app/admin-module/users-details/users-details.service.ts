import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserModel } from "src/app/models/UserModel";

@Injectable({
    providedIn: "root"
})
export class UsersDetailsService {
    constructor(private httpClient: HttpClient) { }

    public getUsers(page: number, size: number): Observable<{ count: number, users: UserModel[] }> {
        return this.httpClient.get<any>(`usermanager/users/${page}/${size}`);
    }
}