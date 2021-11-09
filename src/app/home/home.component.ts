import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  public deviceInfo!: DeviceInfo;
  public imageObject: Array<any> = [
    {
      image: 'assets/kubika.jpg',
      thumbImage: 'assets/kubika.jpg',
      title: 'Some random shit'
    }, {
      image: 'assets/art-kubika-logo.png',
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
    }, {
      image: 'assets/kubika.jpg',
      thumbImage: 'assets/kubika.jpg',
      title: 'Some random shit'
    }
  ]

  public tst: Array<{ path: string }>;

  constructor(private deviceDetectorService: DeviceDetectorService) {
    this.tst = this.imageObject.map(item => { return { path: item.image } });
  }

  ngOnInit(): void {
    this.deviceInfo = this.deviceDetectorService.getDeviceInfo();
    console.log(this.deviceInfo);
  }
}
