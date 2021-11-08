import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { UserModel } from '../models/UserModel';
import { ToastrService } from 'ngx-toastr';
import { UserManagerService } from '../core/services/user.manager.service';
import { UserContextService } from '../core/services/user-context.service';
import { Subscription } from 'rxjs';

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

  constructor(
    private userManagerService: UserManagerService,
    private userContextService: UserContextService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService) {
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
        username: this.f["email"].value
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
            console.log(response);
          }
        });
    } else {
      this.userContextService.update(
        this.f["name"].value,
        this.f['password'].value,
        this.f['phone'].value,
        this.f['birthday'].value,
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
    this.userForm = this.formBuilder.group({
      password: passWordSettings,
      confirmPassword: [],
      name: [this.userModel.name],
      email: [this.userModel.email, Validators.email],
      phone: [this.userModel.phone, Validators.required],
      birthday: [this.userModel.birth],
      address: [this.userModel.address]
    }, { validators: this.checkPasswords });
  }
}