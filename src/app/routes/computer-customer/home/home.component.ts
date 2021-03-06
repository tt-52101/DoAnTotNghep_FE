import { AfterViewChecked, AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StartupService } from '@core';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { SettingsService } from '@delon/theme';
import { environment } from '@env/environment';
import { GM_GEAR, LAPTOP_ID, PC_GM } from '@util';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CartCustomerService } from 'src/app/services/computer-customer/cart-customer/cart-customer.service';
import { CustomerService } from 'src/app/services/computer-customer/customer/customer.service';
import { CartService } from 'src/app/services/computer-management/cart/cart.service';
import { CategoryMetaService } from 'src/app/services/computer-management/category-meta/category-meta.service';
import { ProductService } from 'src/app/services/computer-management/product/product.service';
declare var window: any;
declare var FB: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  tittle = 'Trang chủ';
  pageSize = 4;
  isVisible = false;
  listProduct: any[] = [];
  listProductActive: any[] = [];
  listProdResult: any[] = [];
  listCart: Array<any> = [];
  listAcerActive: any[] = [];
  listAcerResult: any[] = [];

  listAsusActive: any[] = [];
  listAsusResult: any[] = [];

  listMsiActive: any[] = [];
  listMsiResult: any[] = [];

  listPcActive: any[] = [];
  listPcResult: any[] = [];

  listGmActive: any[] = [];
  listGmResult: any[] = [];

  prodCountActive: any[] = [];
  prodCountResult: any[] = [];

  listLenovoActive: any[] = [];
  listLenovoResult: any[] = [];
  listDellActive: any[] = [];
  listDellResult: any[] = [];
  itemQuickView: any;
  listHpActive: any[] = [];
  listHpResult: any[] = [];
  myThumbnail: any;
  moduleName = 'Trang chủ';
  baseFile = environment.BASE_FILE_URL;
  array = [
    {
      img: '../../../../../assets/tmp/img/slider/1.jpg',
    },
    {
      img: '../../../../../assets/tmp/img/slider/2.jpg',
    },
    {
      img: '../../../../../assets/tmp/img/slider/3.jpg',
    },
  ];
  constructor(
    private productService: ProductService,
    private settingService: SettingsService,
    private router: Router,
    private msgService: NzMessageService,
    private customerService: CustomerService,
    private startupService: StartupService,
    private categoryMetaService: CategoryMetaService,
    private cartCusService: CartCustomerService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {
    const token = this.tokenService.get()?.token;
    if (token) {
    } else {
      this.customerService.changeLogin(false);
    }
  }
  topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
  ngOnInit(): void {
    this.fetchListProduct();
    this.fetchListCategoryMetaByProd();
  }
  updateVisitCount(prodCode: any, item: any) {
    this.ngAfterViewInit();
    this.isVisible = true;
    this.itemQuickView = item;
    this.myThumbnail = this.baseFile + item.pictures[0];
    console.log(this.myThumbnail);
    this.itemQuickView.listCategoryMetaProducts.map((item: any) => {
      this.listCateMeta.map((cate) => {
        if (cate.id === item.categoryMetaId) {
          item.categoryMetaName = cate.key;
        }
      });
    });
    this.itemQuickView.listPicturesActive = this.getListProdActive(this.itemQuickView.pictures);
    this.itemQuickView.listPicturesRs = this.getListProdRs(this.itemQuickView.pictures);
    if (prodCode) {
      const model = {
        prodCode: prodCode,
      };
      this.productService.updateVisitCount(model).subscribe((res) => {
        this.itemQuickView.visitCount = res.data;
      });
    }
  }
  changePicture(item: any) {
    this.myThumbnail = this.baseFile + item;
    console.log(this.myThumbnail);
  }
  addToCart(item: any) {
    this.cartCusService.addToCart(item);
  }
  listLaptopRs: any[] = [];
  listPcRs: any[] = [];
  listGmRs: any[] = [];
  listCateMeta: any[] = [];
  fetchListCategoryMetaByProd() {
    this.categoryMetaService.getAll().subscribe((res) => {
      console.log(res);
      this.listCateMeta = res.data.data;
    });
  }
  getVoucher() {
    const token = this.tokenService.get()?.token;
    if (token) {
      this.router.navigateByUrl('/voucher');
    } else {
      this.msgService.error('Bạn cần đăng nhập để xem mã giảm giá');
    }
  }
  search(ts: any) {
    this.router.navigateByUrl('/search-detail?textSearch=' + ts);
  }
  fetchListProduct() {
    this.listLaptopRs = [];
    this.productService.getAll().subscribe((res) => {
      this.listProduct = res.data.data;
      for (let index = 0; index < this.listProduct.length; index++) {
        this.listProduct[index].listCategory.map((item: any) => {
          if (item == LAPTOP_ID) {
            this.listLaptopRs.push(this.listProduct[index]);
          }

          if (item == GM_GEAR) {
            this.listGmRs.push(this.listProduct[index]);
          }

          if (item == PC_GM) {
            this.listPcRs.push(this.listProduct[index]);
          }
        });
      }
      console.log(this.listLaptopRs);
      this.prodCountActive = this.getListProdActive(this.listProduct.sort((a, b) => (b.visitCount > a.visitCount ? 1 : -1)));
      this.prodCountResult = this.getListProdRs(this.listProduct.sort((a, b) => (b.visitCount > a.visitCount ? 1 : -1)));

      this.listAcerActive = this.getListProdActive(this.listLaptopRs.filter((x) => x.supplierName === 'ACER'));
      this.listAcerResult = this.getListProdRs(this.listLaptopRs.filter((x) => x.supplierName === 'ACER'));

      this.listPcActive = this.getListProdActive(this.listPcRs);
      this.listPcResult = this.getListProdRs(this.listPcRs);

      this.listGmActive = this.getListProdActive(this.listGmRs);
      this.listGmResult = this.getListProdRs(this.listGmRs);

      this.listAcerActive = this.getListProdActive(this.listLaptopRs.filter((x) => x.supplierName === 'ACER'));
      this.listAcerResult = this.getListProdRs(this.listLaptopRs.filter((x) => x.supplierName === 'ACER'));

      this.listAsusActive = this.getListProdActive(this.listLaptopRs.filter((x) => x.supplierName === 'ASUS'));
      this.listAsusResult = this.getListProdRs(this.listLaptopRs.filter((x) => x.supplierName === 'ASUS'));

      this.listMsiActive = this.getListProdActive(this.listLaptopRs.filter((x) => x.supplierName === 'MSI'));
      this.listMsiResult = this.getListProdRs(this.listLaptopRs.filter((x) => x.supplierName === 'MSI'));

      this.listDellActive = this.getListProdActive(this.listLaptopRs.filter((x) => x.supplierName === 'DELL'));
      this.listDellResult = this.getListProdRs(this.listLaptopRs.filter((x) => x.supplierName === 'DELL'));

      this.listLenovoActive = this.getListProdActive(this.listLaptopRs.filter((x) => x.supplierName === 'LENOVO'));
      this.listLenovoResult = this.getListProdRs(this.listLaptopRs.filter((x) => x.supplierName === 'LENOVO'));

      this.listHpActive = this.getListProdActive(this.listLaptopRs.filter((x) => x.supplierName === 'HP'));
      this.listHpResult = this.getListProdRs(this.listLaptopRs.filter((x) => x.supplierName === 'HP'));
    });
  }
  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
  getListProdActive(list: any[]) {
    return list.slice(0, this.pageSize);
  }
  getListProdRs(list: any[]) {
    let listRs: any = [];
    for (let index = 2; index <= list.length; index++) {
      const model = list.slice((index - 1) * this.pageSize, index * this.pageSize);
      if (model.length !== 0) {
        listRs.push(model);
      }
    }
    return listRs;
  }
  viewDetail(code: any) {
    const url = '/product-detail/' + code;
    window.location = url;
    // this.router.navigate(['/product-detail/' + code]);
  }
  ngAfterViewInit() {
    (function (d, s, id, idBefore) {
      let js,
        fjs = d.getElementsByTagName(s)[3];
      // for (let index = 0; index < fjs.length; index++) {
      //   console.log(index + ' ' + fjs[index].outerHTML);
      // }
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.setAttribute('src', 'https://connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v10.0&appId=253504385800401&autoLogAppEvents=1');
      // js.src = '//connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v10.0&appId=253504385800401&autoLogAppEvents=1';
      // Notice the "!" at the end of line
      fjs.nodeName; // <- error!

      if (fjs === null) {
        alert('oops');
      } else {
        // since you've done the nullable check
        // TS won't complain from this point on
        fjs.parentNode?.insertBefore(js, fjs); // <- no error
      }
    })(document, 'script', 'facebook-js-sdk', 'facebook-jssdk');
  }
}
