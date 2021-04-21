import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/computer-management/product/product.service';

@Component({
  selector: 'app-product-section',
  templateUrl: './product-section.component.html',
  styleUrls: ['./product-section.component.less'],
})
export class ProductSectionComponent implements OnInit {
  constructor(private productService: ProductService) {}
  listProduct: any[] = [];
  ngOnInit(): void {
    this.productService.getAll().subscribe((res) => {
      this.listProduct = res.data;
    });
  }
}
