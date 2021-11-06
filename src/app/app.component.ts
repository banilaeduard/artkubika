import { Component, ViewChild } from '@angular/core';
import { NgScrollbar } from 'ngx-scrollbar/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  @ViewChild("scrollable") scrollTarget!: NgScrollbar;

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
  }

  ngOnDestroy() {
  }
}
