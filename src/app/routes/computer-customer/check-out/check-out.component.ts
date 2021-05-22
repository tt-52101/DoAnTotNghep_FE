import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { environment } from '@env/environment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CartCustomerService } from 'src/app/services/computer-customer/cart-customer/cart-customer.service';
import { CustomerService } from 'src/app/services/computer-customer/customer/customer.service';
import { BaseAddressService } from 'src/app/services/computer-management/base-address/base-address.service';
import { CartService } from 'src/app/services/computer-management/cart/cart.service';
import { OrderService } from 'src/app/services/computer-management/order/order.service';
import { ProductService } from 'src/app/services/computer-management/product/product.service';
@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.less'],
})
export class CheckOutComponent implements OnInit {
  isVisible = false;
  listVoucherByUser: any[] = [];
  voucher = 0;
  userModel;
  constructor(
    private cartService: CartService,
    private addressService: BaseAddressService,
    private fb: FormBuilder,
    private router: Router,
    private nzMessage: NzMessageService,
    private cusService: CustomerService,
    private orderService: OrderService,
    private cartcustomerService: CartCustomerService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private productService: ProductService,
  ) {
    this.form = this.fb.group({
      email: [null, [Validators.required]],
      name: [null, [Validators.required]],
      phoneNumber: [null, [Validators.required]],
      phoneNumberPrefix: ['+84'],
      district: [null, [Validators.required]],
      commune: [null, [Validators.required]],
      city: [null, [Validators.required]],
      addressDetail: [null, [Validators.required]],
    });
    this.userModel = JSON.parse(localStorage.getItem('_token') || '{}');
    const token = this.tokenService.get()?.token;
    if (token) {
      this.getListCity();
      this.getListCart();
    } else {
    }
  }
  voucherApplied;
  isLoading = false;
  description = '';
  voucherCode = '';
  listCity: Array<{ value: string; label: string }> = [];
  listDistrict: Array<{ value: string; label: string }> = [];
  listCommune: Array<{ value: string; label: string }> = [];
  listCart: any[] = [];
  total = 0;
  form: FormGroup;
  radioValue: any = 1;
  shipping = 0;
  paymentType = 1;
  shippingValue = 25000;
  baseFile = environment.BASE_FILE_URL;
  ngOnInit(): void {
    this.fetchListVoucherByUser();
  }
  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
  fetchListVoucherByUser() {
    this.cusService.getById(this.userModel.id).subscribe((res) => {
      if (res.code === 200) {
        this.listVoucherByUser = res.data.vouchers;

        if (this.listVoucherByUser) {
          this.listVoucherByUser.map((item) => {
            let startTime = new Date(item.startTime);
            let expiredTime = new Date(item.expiredTime);
            if (startTime > new Date() || expiredTime < new Date()) {
              item.isSelected = 2;
            } else {
              item.isSelected = 1;
            }
            item.percent = (item.used / item.quantity) * 100;
            if (item.startTime && item.expiredTime) {
              item.timeValid =
                new Date(item.startTime).getDate() +
                '.' +
                new Date(item.startTime).getMonth() +
                ' - ' +
                new Date(item.expiredTime).getDate() +
                '.' +
                new Date(item.expiredTime).getMonth();
            }
            if (item.discount) {
              if (item.type === 1) {
                item.discountView = item.discount;
                item.typeName = '%';
              } else {
                item.discountView = item.discount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                item.typeName = 'VNĐ';
              }
            }
          });
          console.log(this.listVoucherByUser);
        }
      }
    });
  }
  changeShipping(event: any) {
    switch (this.radioValue) {
      case 1:
        this.shipping = 0;
        break;
      case 2:
        this.shipping = this.shippingValue;
        break;
      default:
        break;
    }
  }
  onFocus() {
    this.isVisible = true;
  }
  save() {
    this.isLoading = true;
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
    if (this.form.invalid) {
      this.nzMessage.error('Kiểm tra thông tin các trường đã nhập');
      return;
    }
    if (this.voucherApplied) {
      const indexOf = this.listVoucherByUser.indexOf(this.voucherApplied);
      this.listVoucherByUser.splice(indexOf, 1);
    }
    const data = {
      status: 0,
      subTotal: this.total,
      shipping: this.shipping,
      discount: this.voucher,
      total: this.total + this.shipping,
      listProducts: JSON.stringify(this.listCart),
      name: this.form.controls.name.value,
      description: this.description,
      phoneNumber: this.form.controls.phoneNumber.value,
      email: this.form.controls.email.value,
      cityId: this.form.controls.city.value,
      districtId: this.form.controls.district.value,
      communeId: this.form.controls.commune.value,
      phuongThucThanhToan: this.paymentType,
      vouchers: this.listVoucherByUser,
      addressDetail: this.form.controls.addressDetail.value,
    };
    this.orderService.create(data).subscribe((res) => {
      console.log(res);
      if (res.code === 200) {
        this.nzMessage.success('Đặt hàng thành công');
        this.router.navigateByUrl('/confirm/' + res.data);
      }
    });
  }
  applyVoucher(item: any) {
    this.voucherApplied = item;
    this.voucherCode = this.voucherApplied.code;
    if (this.voucherApplied.type === 1) {
      this.voucher = (this.shipping + this.total) * (this.voucherApplied.discount / 100);
    } else {
      this.voucher = this.voucherApplied.discount;
    }
    this.isVisible = false;
  }
  getListCart() {
    this.total = 0;
    this.cartService.getById().subscribe((res) => {
      if (res.code === 200) {
        const listProducts = JSON.parse(res.data.listProducts);
        if (listProducts) {
          const listCart = listProducts;
          if (listCart !== '' && listCart.length !== 0 && listCart !== undefined && listCart !== null) {
            if (listCart) {
              // listCart.map((item: any) => {
              //   item.categoryString = item.categoryName.toString();
              // });
            }
            this.listCart = listCart;
            // localStorage.setItem('list-cart', JSON.stringify(listCart));
            this.listCart.map((item) => {
              item.subTotal = item.count * (item.price - item.discount);
              this.total = this.total + item.subTotal;
            });
          }
        }
      }
    });
  }
  getListCity() {
    this.addressService.getCity().subscribe((res) => {
      if (res.code === 200) {
        if (res.data) {
          this.listCity = res.data.map((item: any) => {
            return {
              value: item.matp,
              label: item.name,
            };
          });
        }
      }
    });
  }
  changeCity(event: any) {
    this.form.controls.district.setValue(null);
    this.form.controls.commune.setValue(null);
    this.addressService.getDistrict(event).subscribe((res) => {
      if (res.code === 200) {
        if (res.data) {
          this.listDistrict = res.data.map((item: any) => {
            return {
              value: item.maqh,
              label: item.name,
            };
          });
        }
      }
    });
  }
  changeDistrict(event: any) {
    this.form.controls.commune.setValue(null);
    if (event !== null) {
      this.addressService.getCommune(event).subscribe((res) => {
        if (res.code === 200) {
          if (res.data) {
            this.listCommune = res.data.map((item: any) => {
              return {
                value: item.xaid,
                label: item.name,
              };
            });
          }
        }
      });
    }
  }
  viewDetail(code: any) {
    const url = '/product-detail/' + code;
    window.location.href = url;
    // this.router.navigate(['/product-detail/' + code]);
  }
  removeItem(item: any) {
    this.listCart = this.cartcustomerService.removeItem(item, this.listCart);
    if (this.listCart.length > 0) {
      this.total = 0;
      this.listCart.map((item) => {
        item.subTotal = item.count * (item.price - item.discount);
        this.total = this.total + item.subTotal;
      });
    } else {
      this.total = 0;
    }
  }
  changeCount(event: any, prod: any) {
    const rs = this.cartcustomerService.change(event, prod, this.listCart);
    console.log(rs);
    this.listCart = rs.listCart;
    this.total = rs.total;
  }
}
