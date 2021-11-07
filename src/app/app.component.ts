import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgScrollbar } from 'ngx-scrollbar/public-api';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  @ViewChild("scrollable") scrollTarget!: NgScrollbar;

  constructor(
    private httpClient: HttpClient,
    private toastr: ToastrService
  ) {

  }

  ngOnInit(): void {
    this.httpClient.get('ping').subscribe(pong => console.log(pong));
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
  }

  ngOnDestroy() {
  }
}
