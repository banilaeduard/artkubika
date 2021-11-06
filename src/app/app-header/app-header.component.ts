import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthentificationService } from '../authentification.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.less']
})
export class AppHeaderComponent implements OnInit {
  public loggedIn!: Observable<boolean>;
  constructor(authService: AuthentificationService) {
    this.loggedIn = authService.getIsUserLogged$();
   }

  ngOnInit(): void {
    
  }

}
