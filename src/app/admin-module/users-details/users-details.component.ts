import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { UserModel } from 'src/app/models/UserModel';
import { UsersDetailsService } from './users-details.service';

@Component({
    selector: 'user-details',
    templateUrl: './users-details.component.html',
    styleUrls: [],
    providers: [UsersDetailsService]
})
export class UsersDetailsComponent implements OnInit {
    public users: UserModel[] = [];

    constructor(private userDetailsService: UsersDetailsService) {
    }

    ngOnInit(): void {
        this.userDetailsService.getUsers(1, 20).pipe(
            tap(console.log)
        ).subscribe(model => this.users = model.users);
    }
}