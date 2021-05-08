import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { environment } from '@env/environment';
import { reCaptchaKey } from '@util';
import { NzMessageService } from 'ng-zorro-antd/message';
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
  isVisible = false;
  reCaptchaKey = reCaptchaKey;
  isLoading = false;
  passwordVisible = false;
  sub1: Subscription;
  sub2: Subscription;
  sub3: Subscription;
  listCart: any[] = [];
  total: any = 0;
  constructor(
    private cartService: CartService,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private customerService: CustomerService,
    private userService: UserService,
    private nzMessage: NzMessageService,
    private cartcustomerService: CartCustomerService,
    private router: Router,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private cusService: UserService,
  ) {
    const token = this.tokenService.get()?.token;
    if (token) {
      this.isLogin = true;
      this.getListCart();
      this.fetchUser();
    } else {
      this.isLogin = false;
    }
    this.sub1 = this.cartService.currentCart.subscribe((res) => {
      this.total = 0;
      this.listCart = res;
      this.listCart.map((item) => {
        item.subTotal = item.count * (item.price - item.discount);
        this.total = this.total + item.subTotal;
      });
    });
    this.formLogin = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      recaptcha: [null, [Validators.required]],
      rememberMe: [true],
    });
    this.sub2 = this.userService.isChangeCurrent.subscribe((res) => {
      if (res === true) {
        this.fetchUser();
      }
    });

    this.sub3 = this.customerService.isLoginCurrent.subscribe((res) => {
      this.isLogin = res;
      if (this.isLogin === false) {
        this.listCart = [];
        this.total = 0;
      } else {
        setTimeout(() => {
          this.fetchUser();
          this.getListCart();
        }, 3000);
      }
    });
  }
  ngOnDestroy(): void {
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
    this.sub3.unsubscribe();
  }
  formLogin: FormGroup;
  isLogin: any;

  userName = '';
  baseFile = environment.BASE_FILE_URL;
  ngOnInit(): void {
    this.cdRef.detectChanges();
  }
  showModal(): void {
    this.isVisible = true;
  }
  getListCart() {
    this.cartService.getById().subscribe((res) => {
      if (res.code === 200) {
        const listProducts = JSON.parse(res.data.listProducts);
        if (listProducts) {
          const listCart = listProducts;
          if (listCart !== '' && listCart.length !== 0 && listCart !== undefined && listCart !== null) {
            this.listCart = listCart;
            localStorage.setItem('list-cart', JSON.stringify(listCart));
            this.listCart.map((item) => {
              item.subTotal = item.count * (item.price - item.discount);
              this.total = this.total + item.subTotal;
            });
          }
        }
      }
    });
  }
  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
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
  submitForm(): void {
    this.isLoading = true;
    for (const i in this.formLogin.controls) {
      this.formLogin.controls[i].markAsDirty();
      this.formLogin.controls[i].updateValueAndValidity();
    }
    if (this.formLogin.errors) {
      this.nzMessage.error('Kiểm tra thông tin các trường đã nhập');
      return;
    }
    const recaptchaValue = this.formLogin.controls.recaptcha.value;
    if (recaptchaValue === null || recaptchaValue === undefined || recaptchaValue === '') {
      this.nzMessage.error('Kiểm tra thông tin các trường đã nhập');
      return;
    }
    let loginModel = {
      username: this.formLogin.controls.username.value,
      password: this.formLogin.controls.password.value,
      rememberMe: this.formLogin.controls.rememberMe.value,
    };
    this.customerService.login(loginModel).subscribe(
      (res) => {
        this.isLoading = false;
        if (res.code !== 200) {
          this.nzMessage.error('Đăng nhập thất bại');
          return;
        }
        if (res.data === null || res.data === undefined) {
          this.nzMessage.error('Đăng nhập thất bại, sai tên tài khoản hoặc mật khẩu');
          return;
        }
        if (res.data.userModel === null) {
          this.nzMessage.error('Đăng nhập thất bại, sai tên tài khoản hoặc mật khẩu');
          return;
        }
        if (res.data.userModel.isLock === true) {
          this.nzMessage.error('Đăng nhập thất bại, tài khoản của bạn đã bị khóa');
          return;
        }
        this.nzMessage.success('Đăng nhập thành công');
        // this.customerService.changeLogin(true);
        // this.cusService.changeUser(true);
        this.isLogin = true;
        this.tokenService.set({
          id: res.data.userId,
          token: res.data.tokenString,
          email: res.data.userModel.email,
          avatarUrl: res.data.userModel.avatarUrl,
          timeExpride: res.data.timeExpride,
          time: res.data.timeExpride,
          name: res.data.userModel.name,
          appId: res.data.applicationId,
          rights: res.data.listRight,
          roles: res.data.listRole,
          // isSysAdmin,
        });
        this.fetchUser();
        this.getListCart();
        this.isVisible = false;
        if (res.data.userModel.isAdmin === true) {
          this.router.navigateByUrl('/admin');
        } else {
          this.router.navigateByUrl('/home');
        }
      },
      (error) => {
        this.isLoading = false;
        this.nzMessage.error('Đăng nhập thất bại, sai tên tài khoản hoặc mật khẩu');
        this.router.navigateByUrl('/home');
      },
    );
  }
  logout() {
    this.tokenService.clear();
    this.customerService.changeLogin(false);
    this.router.navigateByUrl('/home');
  }
  changeCount(event: any, prod: any) {
    const rs = this.cartcustomerService.change(event, prod, this.listCart);
    console.log(rs);
    this.listCart = rs.listCart;
    this.total = rs.total;
  }
  removeItem(item: any) {
    this.listCart = this.cartcustomerService.removeItem(item, this.listCart);
  }
}
