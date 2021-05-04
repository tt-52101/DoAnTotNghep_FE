import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CartService } from '../../computer-management/cart/cart.service';

@Injectable({
  providedIn: 'root',
})
export class CartCustomerService {
  constructor(
    private cartService: CartService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private router: Router,
    private nzMessage: NzMessageService,
  ) {}
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
    const token = this.tokenService.get()?.token;
    if (token) {
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
    } else {
      this.nzMessage.error('Bạn phải đăng nhập để mua hàng');
      this.router.navigateByUrl('/login');
    }
  }
}
