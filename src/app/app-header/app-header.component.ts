import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthentificationService } from '../core/services/authentification.service';
import { UserContextService } from '../core/services/user-context.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.less']
})
export class AppHeaderComponent implements OnInit {
  public loggedIn!: Observable<{ loggedIn: boolean, userName: string }>;
  public user!: Observable<string>;
  public isAdmin!: boolean;

  constructor(authService: AuthentificationService,
    private router: Router,
    userContextService: UserContextService) {
    this.loggedIn = authService.getUserInfo$;

    userContextService.CurrentUser$.pipe(
      switchMap(_ => userContextService.isInRole(['admin']))
    )
      .subscribe(t => this.isAdmin = t);
  }

  ngOnInit(): void {

  }

  public cartClick(): void {
    this.router.navigate(['/cartitems']);
  }
}
