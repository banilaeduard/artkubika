import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthentificationService } from 'src/app/core/services/authentification.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { UserManagerService } from '../services/user.manager.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  order!: FormGroup;
  loading = false;
  submitted = false;
  returnUrl!: string;
  subscription!: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthentificationService,
    private userManagerService: UserManagerService,
    private toastr: ToastrService
  ) {
  }
  ngOnDestroy(): void {
    this.subscription && this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.order = this.formBuilder.group({
      orderId: ['']
    });

    // reset login status
    this.authenticationService.logout();
    this.subscription = this.authenticationService.getUserInfo$
      .subscribe(userInfo =>
        userInfo.loggedIn && this.router.navigate([this.returnUrl])
      );

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmitOrder() {

  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.f['username'].value, this.f['password'].value)
      .pipe(first())
      .subscribe({
        next: _ => this.router.navigate([this.returnUrl]),
        error: response => {
          this.toastr.error(response.error.message, 'Login error', { disableTimeOut: true });
          this.loading = false;
        }
      });
  }

  resetPassword(event: any) {
    this.userManagerService.generatePasswordResetToken(this.f['username'].value).subscribe();
  }
}