import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthentificationService } from '../authentification.service';
import { UserModel } from '../models/UserModel';

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

  public error!: string;


  constructor(
    private authentificationService: AuthentificationService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,) {

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

    this.authentificationService.createUser({
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
        error: error => {
          this.error = error;
          console.log(error);
        }
      });
  }

  ngOnDestroy(): void {

  }
}