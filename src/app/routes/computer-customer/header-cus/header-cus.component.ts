import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from '@env/environment';
import { CartCustomerService } from 'src/app/services/computer-customer/cart-customer/cart-customer.service';
import { CartService } from 'src/app/services/computer-management/cart/cart.service';

@Component({
  selector: 'app-header-cus',
  templateUrl: './header-cus.component.html',
  styleUrls: ['./header-cus.component.less'],
})
export class HeaderCusComponent implements OnInit {
  constructor(
    private cartService: CartService,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private cartCusService: CartCustomerService,
  ) {
    this.cartService.currentCart.subscribe((res) => {
      this.total = 0;
      this.listCart = res;
      this.listCart.map((item) => {
        item.subTotal = item.count * (item.price - item.discount);
        this.total = this.total + item.subTotal;
      });
    });
  }
  listCart: any[] = [];
  total: any = 0;
  baseFile = environment.BASE_FILE_URL;
  ngOnInit(): void {
    const listCart = JSON.parse(localStorage.getItem('list-cart') || '{}');
    if (listCart !== {} && listCart !== undefined && listCart !== null) {
      this.listCart = listCart;
      this.listCart.map((item) => {
        item.subTotal = item.count * (item.price - item.discount);
        this.total = this.total + item.subTotal;
      });
    }
  }
  changeCount(event: any, prod: any) {
    const rs = this.cartCusService.change(event, prod, this.listCart);
    console.log(rs);
    this.listCart = rs.listCart;
    this.total = rs.total;
  }
  removeItem(item: any) {
    this.listCart = this.cartCusService.removeItem(item, this.listCart);
  }
}
