import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthentificationService } from 'src/app/core/services/authentification.service';

@Component({
  selector: 'app-confirmation-email',
  templateUrl: './confirmation-email.component.html',
  styleUrls: ['./confirmation-email.component.less']
})
export class ConfirmationEmailComponent implements OnInit {
  public token!: string;
  public email!: string;

  constructor(
    private auth: AuthentificationService,
    private route: ActivatedRoute,
    private navRouter: Router) {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.email = params['email'];
    });
  }

  ngOnInit(): void {
    if (this.token && this.email) {
      this.auth.confirmEmail(this.token, this.email)
        .subscribe(t => this.navRouter.navigate(['/login']));
    }
  }
}