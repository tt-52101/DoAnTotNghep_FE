import { Component, OnInit } from '@angular/core';
import { StartupService } from '@core';
import { SettingsService } from '@delon/theme';
import { environment } from '@env/environment';
import { ProductService } from 'src/app/services/computer-management/product/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
})
export class HomeComponent implements OnInit {
  tittle = 'Trang chủ';
  pageSize = 4;
  listProduct: any[] = [];
  listProductActive: any[] = [];
  listProdResult: any[] = [];
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
  constructor(private productService: ProductService, private settingService: SettingsService, private startupService: StartupService) {}
  topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
  ngOnInit(): void {
    const app = {
      name: 'Trang chủ',
      description: 'Trang chủ',
      year: 2021,
    };
    this.settingService.setApp(app);
    this.startupService.load();
    this.productService.getAll().subscribe((res) => {
      this.listProduct = res.data.data;
      this.listProductActive = this.listProduct.slice(0, this.pageSize);
      for (let index = 2; index <= this.listProduct.length; index++) {
        const element = this.listProduct.slice((index - 1) * this.pageSize, index * this.pageSize);
        if (element.length === 0) {
          return;
        }
        this.listProdResult.push(element);
        console.log(this.listProdResult);
      }
    });
  }
}
