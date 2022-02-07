import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AuthentificationService } from '../core/services/authentification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.less']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  public user!: string;
  public sub!: Subscription;

  constructor(public authService: AuthentificationService) {
  }

  ngOnInit(): void {
    this.sub = this.authService.getUserInfo$.subscribe(user => this.user = user.userName);
  }

  ngOnDestroy(): void {
    this.sub && this.sub.unsubscribe();
  }
}