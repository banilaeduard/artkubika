import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AuthentificationService } from '../core/services/authentification.service';
import { OverlaymenuComponent } from '../core/overlaymenu/overlaymenu.component';
import { filter, fromEvent, Observable, Subscription, take, tap } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.less']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  @ViewChild('userMenu') userMenu!: OverlaymenuComponent;
  @ViewChild('template') template!: TemplateRef<any>;
  private currentTarget!: HTMLElement;
  private toggle!: boolean;

  public user!: string;
  public closeCond!: Observable<any>;
  public sub!: Subscription;

  constructor(public authService: AuthentificationService) {
    this.closeCond = fromEvent<MouseEvent>(document, 'click')
      .pipe(
        filter(event =>
          this.currentTarget != event.target
        ),
        tap(_ => this.toggle = false),
        take(1)
      );
  }

  ngOnInit(): void {
    this.sub = this.authService.getUserInfo$.subscribe(user => this.user = user.username);
  }

  ngOnDestroy(): void {
    this.sub && this.sub.unsubscribe();
    this.userMenu.close();
  }

  open(ev: MouseEvent) {
    this.toggle = !this.toggle;
    if (this.toggle) {
      this.currentTarget = ev.target as HTMLElement;
      const targetPos = this.currentTarget.getBoundingClientRect();
      this.userMenu.open(targetPos.x + targetPos.width, 56);
    } else {
      this.userMenu.close();
      this.toggle = false;
    }
  }
}