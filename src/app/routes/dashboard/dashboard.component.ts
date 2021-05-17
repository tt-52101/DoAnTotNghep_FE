import { HttpClient } from '@angular/common/http';
import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { environment } from '@env/environment';
import { dashboardRouter } from '@util';
import { DashboardService } from 'src/app/services/api/dashboard.service';
import { ProductService } from 'src/app/services/computer-management/product/product.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  visitWebsite = 0;
  visitProd = 0;
  orderCount = 0;
  orderCountToday = 0;
  orderCountMonth = 0;
  orderRevoked = 0;
  grandTotal = 0;
  baseFile = environment.BASE_FILE_URL;
  grandTotalRecived = 0;
  orderCountRecived = 0;
  visitWebsiteToday = 0;
  visitProdToday = 0;
  listProd: any[] = [];
  prodTopFive: any[] = [];
  constructor(private dashboardService: DashboardService, private prodService: ProductService, private cdf: ChangeDetectorRef) {
    const list = JSON.parse(localStorage.getItem('visit-count') || '[]');
    if (list) {
      this.visitWebsite = list.length;
      list.map((item: any) => {
        const d1 = new Date();
        const d2 = new Date(item.createdDate);
        if (d1.getDay() === d2.getDay() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear()) {
          this.visitWebsiteToday++;
        }
      });
    }
    this.prodService.getAll().subscribe((res) => {
      if (res.code === 200) {
        this.listProd = res.data.data;
        // this.listProd.map((item: any) => {
        //   if (item.status === 0) {
        //     this.visitProd++;
        //   }
        //   const d1 = new Date();
        //   const d2 = new Date(item.createdDate);
        //   if (
        //     d1.getDay() === d2.getDay() &&
        //     d1.getMonth() === d2.getMonth() &&
        //     d1.getFullYear() === d2.getFullYear() &&
        //     item.status === 0
        //   ) {
        //     this.visitProdToday++;
        //   }
        // });
        if (res.data.data) {
          this.listProd.sort((a: any, b: any) => (b.visitCount > a.visitCount ? 1 : -1));
          this.prodTopFive = [...this.listProd.slice(0, 5)];
        }
      }
    });
    this.dashboardService.getAll().subscribe((res) => {
      if (res) {
        res.orders.map((item: any) => {
          if (item.status === 0) {
            this.visitProd++;
          }
          this.orderCount++;
          this.grandTotal += item.grandTotal;
          const d1 = new Date();
          const d2 = new Date(item.createdDate);
          if (d1.getDay() === d2.getDay() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear()) {
            this.orderCountToday++;
          }
          if (
            d1.getDay() === d2.getDay() &&
            item.status === 0 &&
            d1.getMonth() === d2.getMonth() &&
            d1.getFullYear() === d2.getFullYear()
          ) {
            this.visitProdToday++;
          }
          if (d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear()) {
            this.orderCountMonth++;
          }
          if (item.status === 3) {
            this.grandTotalRecived += item.grandTotal;
            this.orderCountRecived++;
          }
          if (item.status === -1) {
            this.orderRevoked++;
          }
        });
        this.cdf.detectChanges();
      }
    });
  }
}
