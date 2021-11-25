import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { UserModel } from '../models/UserModel';
import { ToastrService } from 'ngx-toastr';
import { UserManagerService } from '../core/services/user.manager.service';
import { UserContextService } from '../core/services/user-context.service';
import { from, Subscription } from 'rxjs';
import { NgbDate, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.less']
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  private sub!: Subscription;

  public userModel!: UserModel;

  public userForm!: FormGroup;

  public submitted!: boolean;

  public resetPassword!: boolean;

  public token!: string;

  constructor(
    private userManagerService: UserManagerService,
    private userContextService: UserContextService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService) {
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

  ngOnInit(): void {
    this.sub = this.userContextService.CurrentUser$.subscribe(user => {
      this.userModel = user;
      this.initUserForm();
    });
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

    if (!this.userModel.loggedIn) {
      this.userManagerService.createUser({
        address: this.f['address'].value,
        birth: new Date(this.f['birthday'].value),
        phone: this.f['phone'].value,
        email: this.f["email"].value,
        name: this.f["name"].value,
        userName: this.f["email"].value
      } as UserModel, this.f['password'].value)
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
    } else {
      this.userContextService.update(
        this.f["name"].value,
        this.f['phone'].value,
        new Date(new Date(0).setFullYear(this.f['birthday'].value.year, this.f['birthday'].value.month, this.f['birthday'].value.day)),
        this.f['address'].value
      );
    }
  }

  ngOnDestroy(): void {
    this.sub && this.sub.unsubscribe();
  }

  private checkPasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    if (this.userModel.loggedIn) return null;
    let pass = group.get('password')?.value;
    let confirmPass = group.get('confirmPassword')?.value
    return pass === confirmPass ? null : { notSame: true }
  }

  private initUserForm() {
    let passWordSettings;
    if (!this.userModel.loggedIn) {
      passWordSettings = ['', Validators.required];
    } else {
      passWordSettings = [''];
    }
    const fromUser = new Date(this.userModel.birth);
    const ngDate = new NgbDate(
      fromUser?.getFullYear(),
      fromUser?.getMonth(),
      fromUser?.getDay());
    this.userForm = this.formBuilder.group({
      password: passWordSettings,
      confirmPassword: [],
      name: [this.userModel.name],
      email: [this.userModel.email, [Validators.email, Validators.required]],
      phone: [this.userModel.phone, [Validators.required]],
      birthday: [ngDate],
      address: [this.userModel.address, [Validators.required]]
    }, { validators: this.checkPasswords });
  }
}