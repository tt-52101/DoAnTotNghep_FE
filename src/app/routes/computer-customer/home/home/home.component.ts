import { Component, OnInit } from '@angular/core';
import { StartupService } from '@core';
import { SettingsService } from '@delon/theme';
import { environment } from '@env/environment';
import { LAPTOP_ID } from '@util';
import { CartCustomerService } from 'src/app/services/computer-customer/cart-customer/cart-customer.service';
import { CartService } from 'src/app/services/computer-management/cart/cart.service';
import { CategoryMetaService } from 'src/app/services/computer-management/category-meta/category-meta.service';
import { ProductService } from 'src/app/services/computer-management/product/product.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
})
export class HomeComponent implements OnInit {
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

  listLenovoActive: any[] = [];
  listLenovoResult: any[] = [];
  listDellActive: any[] = [];
  listDellResult: any[] = [];
  itemQuickView: any;
  listHpActive: any[] = [];
  listHpResult: any[] = [];
  pictureActive: any;
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
    private startupService: StartupService,
    private categoryMetaService: CategoryMetaService,
    private cartCusService: CartCustomerService,
  ) {}
  topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
  ngOnInit(): void {
    this.fetchListProduct();
    this.fetchListCategoryMetaByProd();
  }
  updateVisitCount(prodCode: any, item: any) {
    this.isVisible = true;
    this.itemQuickView = item;
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
    this.pictureActive = this.baseFile + item;
  }
  addToCart(item: any) {
    this.cartCusService.addToCart(item);
  }
  listLaptopRs: any[] = [];
  listCateMeta: any[] = [];
  fetchListCategoryMetaByProd() {
    this.categoryMetaService.getAll().subscribe((res) => {
      console.log(res);
      this.listCateMeta = res.data.data;
    });
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
        });
      }
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
}
