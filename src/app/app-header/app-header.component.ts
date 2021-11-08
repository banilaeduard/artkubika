import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthentificationService } from '../core/services/authentification.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.less']
})
export class AppHeaderComponent implements OnInit {
  public loggedIn!: Observable<{ loggedIn: boolean, username: string }>;
  public user!: Observable<string>;
  constructor(authService: AuthentificationService, private router: Router) {
    this.loggedIn = authService.getUserInfo$;
  }

  ngOnInit(): void {

  }

  public cartClick(): void {
    this.router.navigate(['/cartitems']);
  }
}
