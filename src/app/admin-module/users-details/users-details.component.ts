import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { tap } from 'rxjs/operators';
import { DialogOverlayService } from 'src/app/core/services/dialog-overlay.service';
import { PaginingModel } from 'src/app/models/PaginingModel';
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
    @ViewChild('editRolesTemplate') editRolesTemplate!: TemplateRef<UserModel>;
    public paging: PaginingModel;

    constructor(private userDetailsService: UsersDetailsService,
        private dialogOverlayService: DialogOverlayService) {
        this.paging = PaginingModel.getNew();
    }

    public get page() {
        return this.paging.page;
    }

    public set page(page: number) {
        this.paging.page = page;
    }

    ngOnInit(): void {
        this.syncUsers();
    }

    public deleteUser = (user: UserModel): void => {
        this.userDetailsService.deteleUser(user.userName).subscribe(this.syncUsers);
    }

    public editRoles = (user: UserModel): void => {
        this.userDetailsService.getUserRoles(user.userName).pipe(tap(console.log)).subscribe(roles =>
            this.dialogOverlayService.open(this.editRolesTemplate,
                {
                    model: user,
                    data: { header: `${user.userName}`, roles: roles }
                }
                , undefined)
        );
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

    public updateRoles(userName: string, roles: { remove?: string[], add?: string[] }, done: (x: boolean) => void) {
        if (roles?.remove) {
            this.userDetailsService.removeUserFromRole(userName, roles.remove![0]).subscribe(_ => done(true));
        }
        if (roles?.add) {
            this.userDetailsService.addUserToRole(userName, roles.add![0]).subscribe(_ => done(true));
        }

    }

    private syncUsers = () => {
        this.userDetailsService.getUsers(this.paging.page, this.paging.pageSize).pipe(
            tap(model => this.paging.collectionSize = model.count)
        ).subscribe(model => this.users = model.users);
    }
}
