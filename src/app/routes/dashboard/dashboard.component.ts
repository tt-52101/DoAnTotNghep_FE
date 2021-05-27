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
      this.visitWebsite = list.visitWebsite;
      this.visitWebsiteToday = list.visitWebsiteToday;
    }
    this.prodService.getAll().subscribe((res) => {
      if (res.code === 200) {
        this.listProd = res.data.data;
        if (res.data.data) {
          this.listProd.sort((a: any, b: any) => (b.visitCount > a.visitCount ? 1 : -1));
          this.prodTopFive = [...this.listProd.slice(0, 5)];
          this.cdf.detectChanges();
        }
      }
    });
    this.dashboardService.getAll().subscribe((res) => {
      if (res) {
        const rs = res.orderReport;
        this.orderCount = rs.orderReceived;
        this.orderCountRecived = rs.orderDelivered;
        this.orderRevoked = rs.orderCancelled;
        this.orderCountMonth = rs.orderReceivedMonth;
        this.orderCountToday = rs.orderReceivedToday;
        this.visitProd = rs.orderNotProcess;
        this.visitProdToday = rs.orderNotProcessToday;
        this.grandTotal = rs.grandTotal;
        this.grandTotalRecived = rs.grandTotalDelivered;
        this.cdf.detectChanges();
      }
    });
  }
}
