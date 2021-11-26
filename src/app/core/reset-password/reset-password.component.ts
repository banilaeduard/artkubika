import { Component, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { switchMap, tap } from 'rxjs/operators';
import { AuthentificationService } from 'src/app/core/services/authentification.service';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.less']
})
export class ResetPasswordComponent {
  @Input()
  public token!: string;
  @Input()
  public email!: string;

  @Output()
  public emitSuccess: EventEmitter<boolean> = new EventEmitter();

  public userForm!: FormGroup;
  public submitted!: boolean;
  private params: boolean = false;

  constructor(
    private auth: AuthentificationService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder) {

    this.route.queryParams.subscribe(params => {
      if (params['token']) {
        this.token = params['token'];
        this.params = true;
      }
      if (params['email']) {
        this.email = params['email'];
      }
    });
    this.initUserForm();
  }

  get f() { return this.userForm.controls; }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.userForm.invalid) {
      if (!!this.userForm.errors?.notSame) {
        this.toastr.error('Parolele nu coincid');
      }
      return;
    }
    this.auth.resetPassword(this.token, this.email, this.f['password'].value)
      .pipe(
        switchMap(_ => this.auth.login(_.user, this.f['password'].value))
      )
      .subscribe(_ => {
        if (this.params)
          this.router.navigate(['/']);
        else
          this.emitSuccess.emit(true);
      });
  }

  private checkPasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    let pass = group.get('password')?.value;
    let confirmPass = group.get('confirmPassword')?.value
    return pass === confirmPass ? null : { notSame: true }
  }

  private initUserForm() {
    this.userForm = this.formBuilder.group({
      password: ['', Validators.required],
      confirmPassword: []
    }, { validators: this.checkPasswords });
  }
}