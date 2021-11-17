import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  public imageObject: Array<any> = [
    {
      image: 'assets/kubika.jpg',
      thumbImage: 'assets/kubika.jpg',
      title: 'Some random shit'
    },
    {
      image: 'assets/kubika.jpg',
      thumbImage: 'assets/kubika.jpg',
      title: 'Some random shit'
    }, {
      image: 'assets/kubika.jpg',
      thumbImage: 'assets/kubika.jpg',
      title: 'Some random shit'
    }, {
      image: 'assets/kubika.jpg',
      thumbImage: 'assets/kubika.jpg',
      title: 'Some random shit'
    }, {
      image: 'assets/kubika.jpg',
      thumbImage: 'assets/kubika.jpg',
      title: 'Some random shit'
    }, {
      image: 'assets/kubika.jpg',
      thumbImage: 'assets/kubika.jpg',
      title: 'Some random shit'
    }, {
      image: 'assets/kubika.jpg',
      thumbImage: 'assets/kubika.jpg',
      title: 'Some random shit'
    }, {
      image: 'assets/kubika.jpg',
      thumbImage: 'assets/kubika.jpg',
      title: 'Some random shit'
    }, {
      image: 'assets/kubika.jpg',
      thumbImage: 'assets/kubika.jpg',
      title: 'Some random shit'
    }, {
      image: 'assets/kubika.jpg',
      thumbImage: 'assets/kubika.jpg',
      title: 'Some random shit'
    }, {
      image: 'assets/kubika.jpg',
      thumbImage: 'assets/kubika.jpg',
      title: 'Some random shit'
    }
  ]

  public tst: Array<{ path: string }>;

  constructor() {
    this.tst = this.imageObject.map(item => { return { path: item.image } });
  }

  ngOnInit(): void {
  }
}
