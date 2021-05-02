import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { environment } from '@env/environment';
import { CartCustomerService } from 'src/app/services/computer-customer/cart-customer/cart-customer.service';
import { CustomerService } from 'src/app/services/computer-customer/customer/customer.service';
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
    private router: Router,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private cusService: CustomerService,
  ) {
    this.cartService.currentCart.subscribe((res) => {
      this.total = 0;
      this.listCart = res;
      this.listCart.map((item) => {
        item.subTotal = item.count * (item.price - item.discount);
        this.total = this.total + item.subTotal;
      });
    });
    this.cusService.isLoginCurrent.subscribe((res) => {
      this.isLogin = res;
    });
  }
  isLogin: any;
  listCart: any[] = [];
  total: any = 0;
  baseFile = environment.BASE_FILE_URL;
  ngOnInit(): void {
    const token = this.tokenService.get()?.token;
    if (token) {
      this.isLogin = true;
    } else {
      this.isLogin = false;
    }
    const listCart = JSON.parse(localStorage.getItem('list-cart') || '[]');
    if (listCart !== '' && listCart.length === 0 && listCart !== undefined && listCart !== null) {
      this.listCart = listCart;
      this.listCart.map((item) => {
        item.subTotal = item.count * (item.price - item.discount);
        this.total = this.total + item.subTotal;
      });
    }
  }
  logout() {
    this.tokenService.clear();
    this.cusService.changeLogin(false);
    this.router.navigateByUrl('/home');
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
