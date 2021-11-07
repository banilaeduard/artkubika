import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthentificationService } from '../core/services/authentification.service';
import { UserModel } from '../models/UserModel';
import { ToastrService } from 'ngx-toastr';
import { UserManagerService } from '../core/services/user.manager.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.less']
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  @Input()
  public userModel!: UserModel;

  public userForm!: FormGroup;

  public submitted!: boolean;

  constructor(
    private authentificationService: AuthentificationService,
    private userManagerService: UserManagerService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      password: ['', Validators.required],
      retypepassword: [],
      name: [],
      email: ['', Validators.email],
      phone: ['', Validators.required],
      birthday: [],
      address: []
    });
  }
  get f() { return this.userForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.userForm.invalid) {
      return;
    }
    if (!this.authentificationService.getIsUserLogged) {
      this.userManagerService.createUser({
        address: this.f['address'].value,
        birth: this.f['birthday'].value,
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

    }
  }

  ngOnDestroy(): void {

  }
}