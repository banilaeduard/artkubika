import { Component, HostListener, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-framwrapper',
  templateUrl: './framwrapper.component.html',
  styleUrls: ['./framwrapper.component.less']
})
export class FramwrapperComponent implements OnInit {
  @Input() src!: string;

  constructor(route: ActivatedRoute) {
    route.data.subscribe(data => {
      this.src = data.url;
    });
  }

  ngOnInit(): void {

  }

  @HostListener('click', ['$event'])
  openTab(src: any) {
    window.open(this.src, "_blank");
  }
}
