// import { Component, OnInit } from '@angular/core';
// import { BaseCartItem, CartService } from 'ng-shopping-cart';

// @Component({
//   selector: 'app-cart-list-items',
//   templateUrl: './cart-list-items.component.html',
//   styleUrls: ['./cart-list-items.component.less']
// })
// export class CartListItemsComponent implements OnInit {
//   public headers = {
//     empty: 'No items. Add some to the cart',
//     name: 'Description',
//     quantity: 'Amount',
//     price: 'Cost',
//     total: 'Total x item',
//   }
//   public footers = {
//     tax: 'Tax rate',
//     shipping: 'Shipping cost',
//     total: 'Total cost'
//   }

//   public items: Array<any> = [
//     { name: 'caca', quant: 1 },
//     { name: 'test', quant: 1 },
//     { name: 'hehe', quant: 2 },
//     { name: 'cine esti bai baiatule', quant: 1 },
//     { name: 'hue hue hue', quant: 1 },
//     { name: 'caca', quant: 3 },
//     { name: 'test', quant: 1 },
//     { name: 'hehe', quant: 1 },
//     { name: 'cine esti bai baiatule', quant: 1 },
//     { name: 'hue hue hue', quant: 1 },
//     { name: 'caca', quant: 1 },
//     { name: 'test', quant: 1 },
//     { name: 'hehe', quant: 1 },
//     { name: 'cine esti bai baiatule', quant: 1 },
//     { name: 'hue hue hue', quant: 1 },
//     { name: 'caca', quant: 1 },
//     { name: 'test', quant: 1 },
//     { name: 'hehe', quant: 1 },
//     { name: 'cine esti bai baiatule', quant: 1 },
//     { name: 'hue hue hue', quant: 1 }
//   ]

//   constructor(private cartService: CartService<BaseCartItem>) {
//     this.items.forEach((item, index) => {
//       let _it = new BaseCartItem();
//       _it.id = index;
//       _it.name = item.name;
//       _it.quantity = item.quant;
//       cartService.addItem(_it);
//     });
//   }

//   ngOnInit(): void {
//   }

// }
