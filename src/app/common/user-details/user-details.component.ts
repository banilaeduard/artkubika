import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { UserModel } from 'src/app/models/UserModel';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.less']
})
export class UserDetailsComponent implements OnInit, OnChanges {
  @Input() userModel!: UserModel;
  @Input() showPassword: boolean = true;
  @Output() message: EventEmitter<any> = new EventEmitter();

  public userForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder) {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.userModel) {
      this.initUserForm();
    }
  }

  ngOnInit(): void {
    this.initUserForm();
  }

  get f() { return this.userForm.controls; }

  public onSubmit(): boolean {
    // stop here if form is invalid
    if (this.userForm.invalid) {
      this.message.emit({
        invalid: true,
        notSame: !!this.userForm.errors?.notSame,
        errors: this.userForm.errors
      });
      return false;
    }

    this.message.emit({
      success: true,
      user: {
        address: this.f['address'].value,
        phone: this.f['phone'].value,
        email: this.f["email"].value,
        name: this.f["name"].value,
        userName: this.f["email"].value,
      } as UserModel,
      password: this.f['password'].value
    });
    return true;
  }

  private checkPasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    if (!this.showPassword) return null;
    let pass = group.get('password')?.value;
    let confirmPass = group.get('confirmPassword')?.value
    return pass === confirmPass ? null : { notSame: true }
  }

  private initUserForm() {
    let passWordSettings;
    if (!!this.showPassword) {
      passWordSettings = ['', Validators.required];
    } else {
      passWordSettings = [''];
    }

    this.userForm = this.formBuilder.group({
      password: passWordSettings,
      confirmPassword: [],
      name: [this.userModel.name],
      email: [this.userModel.email, [Validators.email, Validators.required]],
      phone: [this.userModel.phone, [Validators.required]],
      address: [this.userModel.address, [Validators.required]]
    }, { validators: this.checkPasswords });

    this.userForm.reset(this.userForm.value);
  }
}