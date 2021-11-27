import { Component, OnInit, ViewChild } from '@angular/core';
import { NgScrollbar } from 'ngx-scrollbar/public-api';
import { ToastrService } from 'ngx-toastr';
import { AuthentificationService } from './core/services/authentification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  @ViewChild("scrollable") scrollTarget!: NgScrollbar;

  constructor(
    private toastr: ToastrService,
    private authService: AuthentificationService
  ) {
    this.authService.syncUserWithStorage();
  }

  ngOnInit(): void {
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
