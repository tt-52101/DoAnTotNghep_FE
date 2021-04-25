import { Injectable } from '@angular/core';
import { CartService } from '../../computer-management/cart/cart.service';

@Injectable({
  providedIn: 'root',
})
export class CartCustomerService {
  constructor(private cartService: CartService) {}
  removeItem(item: any, listCart: any[]) {
    const index = listCart.indexOf(item);
    listCart.splice(index, 1);
    localStorage.setItem('list-cart', JSON.stringify(listCart));
    this.cartService.changeCart(listCart);
    return listCart;
  }
  change(event: any, prod: any, listCart: any[]) {
    let total = 0;
    listCart.map((item) => {
      if (item.id === prod.id) {
        item.count = event;
      }
    });
    listCart.map((item) => {
      item.subTotal = item.count * (item.price - item.discount);
      total = total + item.subTotal;
    });
    localStorage.setItem('list-cart', JSON.stringify(listCart));
    const modelReturn = {
      total: total,
      listCart: listCart,
    };
    return modelReturn;
  }
  addToCart(item: any) {
    let listCart = JSON.parse(localStorage.getItem('list-cart') || '{}');
    if (listCart.length > 0) {
      let flag = 0;
      listCart.forEach((c: any) => {
        if (c.id === item.id) {
          c.count++;
          flag = 1;
        }
      });
      if (flag === 0) {
        item.count = 1;
        listCart.push(item);
      }
    } else {
      item.count = 1;
      listCart.push(item);
    }
    localStorage.setItem('list-cart', JSON.stringify(listCart));
    this.cartService.changeCart(listCart);
  }
}
