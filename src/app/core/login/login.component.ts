import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthentificationService } from 'src/app/core/services/authentification.service';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  returnUrl!: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthentificationService,
    private socialLogin: SocialAuthService,
    private toastr: ToastrService
  ) {
    if (this.authenticationService.getIsUserLogged) {
      // this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  signInWithGoogle(): void {
    this.socialLogin.signIn(GoogleLoginProvider.PROVIDER_ID).then(console.log);
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
        next: data => {
          this.router.navigate([this.returnUrl]);
        },
        error: response => {
          this.toastr.error(response.error.message, 'Login error', { disableTimeOut: true });
          this.loading = false;
          console.log(response);
        }
      });
  }
}