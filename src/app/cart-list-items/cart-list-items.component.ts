import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart-list-items',
  templateUrl: './cart-list-items.component.html',
  styleUrls: ['./cart-list-items.component.less']
})
export class CartListItemsComponent implements OnInit {
  public items: Array<any> = [
    { name: 'caca', quant: 1 },
    { name: 'test', quant: 1 },
    { name: 'hehe', quant: 2 },
    { name: 'cine esti bai baiatule', quant: 1 },
    { name: 'hue hue hue', quant: 1 },
    { name: 'caca', quant: 3 },
    { name: 'test', quant: 1 },
    { name: 'hehe', quant: 1 },
    { name: 'cine esti bai baiatule', quant: 1 },
    { name: 'hue hue hue', quant: 1 },
    { name: 'caca', quant: 1 },
    { name: 'test', quant: 1 },
    { name: 'hehe', quant: 1 },
    { name: 'cine esti bai baiatule', quant: 1 },
    { name: 'hue hue hue', quant: 1 },
    { name: 'caca', quant: 1 },
    { name: 'test', quant: 1 },
    { name: 'hehe', quant: 1 },
    { name: 'cine esti bai baiatule', quant: 1 },
    { name: 'hue hue hue', quant: 1 }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
