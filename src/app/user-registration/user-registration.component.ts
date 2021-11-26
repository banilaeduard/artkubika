import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { UserManagerService } from '../core/services/user.manager.service';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.less']
})
export class UserRegistrationComponent implements OnInit {

  constructor(private userManagerService: UserManagerService,
    private toastr: ToastrService,
    private router: Router) { }

  ngOnInit(): void {
  }

  process($event: any) {
    if ($event.success) {
      const user = $event.user;
      this.userManagerService.createUser(user, $event.password)
        .pipe(first())
        .subscribe({
          next: data => {
            this.router.navigate(["/"]);
          },
          error: response => {
            response.error.forEach((error: { code: string, description: string }) => {
              this.toastr.error(error.description, error.code, { disableTimeOut: true });
            });
          }
        });
    }
  }
}
