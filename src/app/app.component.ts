import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar/public-api';
import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs/operators';
import { AuthentificationService } from './core/services/authentification.service';
import { PreviousUrlService } from './core/services/previous-url.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  @ViewChild("scrollable") scrollTarget!: NgScrollbar;

  private previousUrl: string = "/";
  private currentUrl!: string;

  constructor(
    private toastr: ToastrService,
    private authService: AuthentificationService,
    private router: Router,
    private previousUrlService: PreviousUrlService
  ) {
    this.authService.syncUserWithStorage();
  }

  ngOnInit(): void {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe(event => {
      this.previousUrl = this.currentUrl;
      this.currentUrl = (event as NavigationEnd).url;
      this.previousUrlService.setPreviousUrl(
        this.previousUrl,
        this.router.getCurrentNavigation()?.extras.state?.previousState,
        this.router.getCurrentNavigation()?.extras.state?.shouldNavigatePrev
      );
    });
  }

  public onActivate($event: any): void {
    this.scrollTarget.scrollTo({
      duration: 0,
      easing: {
        x1: 0.42,
        y1: 0,
        x2: 0.58,
        y2: 1
      }
    });
    this.toastr.clear();
    this.authService.syncUserWithStorage();
  }

  ngOnDestroy() {
  }
}
