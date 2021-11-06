import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UserModel } from '../models/UserModel';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.less']
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  @Input()
  public userModel!: UserModel;

  constructor() { this.userModel = { username: 'Japca'} as UserModel; }
  ngOnDestroy(): void {
    console.log(this.userModel);
  }

  ngOnInit(): void {
  }

  
}