import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { tap } from 'rxjs/operators';
import { DialogOverlayService } from 'src/app/core/services/dialog-overlay.service';
import { UserModel } from 'src/app/models/UserModel';
import { UsersDetailsService } from './users-details.service';

@Component({
    selector: 'user-details',
    templateUrl: './users-details.component.html',
    styleUrls: ['./users-details.component.less'],
    providers: [UsersDetailsService]
})
export class UsersDetailsComponent implements OnInit {
    public users: UserModel[] = [];
    @ViewChild('createUser') createUserTemplate!: TemplateRef<UserModel>;

    constructor(private userDetailsService: UsersDetailsService,
        private dialogOverlayService: DialogOverlayService) {
    }

    ngOnInit(): void {
        this.syncUsers();
    }

    public deleteUser = (user: UserModel): void => {
        this.userDetailsService.deteleUser(user.userName).subscribe(this.syncUsers);;
    }

    public editUser = (user: UserModel): void => {
        this.dialogOverlayService.open(this.createUserTemplate,
            {
                model: user,
                data: { header: 'Edit user', showPassword: false, create: false }
            }
            , undefined);
    }

    public addUser = (): void => {
        const ref = this.dialogOverlayService.open(this.createUserTemplate,
            {
                model: {} as UserModel,
                data: { header: 'Create user', showPassword: false, create: true },
            }
            , undefined);
    }


    public process(event: any, done: (x: boolean) => void, create: boolean) {
        if (event.success) {
            if (create)
                this.userDetailsService.createUser(event.user).pipe(tap(_ => done(true))).subscribe(this.syncUsers);
            else
                this.userDetailsService.updateUser(event.user).pipe(tap(_ => done(true))).subscribe(this.syncUsers);
            ;
        }
    }

    private syncUsers = () => {
        this.userDetailsService.getUsers(1, 20).pipe(
            tap(console.log)
        ).subscribe(model => this.users = model.users);
    }
}