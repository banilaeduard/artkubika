import { Component, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { UserContextService } from '../core/services/user-context.service';
import { UserModel } from '../models/UserModel';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.less']
})
export class UserEditComponent implements OnDestroy {
  public userModel!: UserModel;
  public resetPassword: boolean = false;
  public token!: string;

  private sub: Subscription;

  constructor(
    private userContextService: UserContextService,
    private toastr: ToastrService) {
    this.sub = this.userContextService.CurrentUser$.subscribe(_user => {
      console.log(_user);
      this.userModel = _user;
    });
  }

  ngOnDestroy(): void {
    this.sub && this.sub.unsubscribe();
  }

  public generateToken() {
    if (!this.resetPassword)
      this.userContextService.generateResetPasswordToken().subscribe(token => {
        this.resetPassword = true;
        this.token = token;
      })
  }

  public passwordChanged(event: boolean) {
    this.resetPassword = !event;
  }

  process($event: any) {
    if ($event.success) {
      const user = $event.user as UserModel;
      this.userContextService.update(
        user.name,
        user.phone,
        user.birth,
        user.address
      );
    } else {
      console.log($event);
      this.toastr.error($event.errors);
    }
  }
}
