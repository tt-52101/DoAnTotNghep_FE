import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { environment } from '@env/environment';
import { Subscription } from 'rxjs';
import { CartCustomerService } from 'src/app/services/computer-customer/cart-customer/cart-customer.service';
import { CustomerService } from 'src/app/services/computer-customer/customer/customer.service';
import { CartService } from 'src/app/services/computer-management/cart/cart.service';
import { UserService } from 'src/app/services/computer-management/user/user.service';

@Component({
  selector: 'app-header-cus',
  templateUrl: './header-cus.component.html',
  styleUrls: ['./header-cus.component.less'],
})
export class HeaderCusComponent implements OnInit, OnDestroy {
  constructor(
    private cartService: CartService,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private userService: UserService,
    private cartCusService: CartCustomerService,
    private router: Router,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private cusService: CustomerService,
  ) {
    this.fetchUser();
    this.subscription = this.userService.isChangeCurrent.subscribe((res) => {
      if (res === true) {
        this.fetchUser();
      }
    });
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
  userName = '';
  private subscription: Subscription;
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
  user: any;
  avatar = '';
  fetchUser() {
    const userModel = JSON.parse(localStorage.getItem('_token') || '{}');
    if (userModel) {
      this.userService.getById(userModel.id).subscribe(
        (res) => {
          if (res.code === 200) {
            const data = res.data;
            this.user = res.data;
            this.userName = res.data.name;
            if (data.avatar) {
              this.avatar = environment.BASE_FILE_URL + data.avatar;
            }
          }
        },
        (err) => {},
      );
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
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
