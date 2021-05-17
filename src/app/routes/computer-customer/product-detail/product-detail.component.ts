import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { environment } from '@env/environment';
import { CartCustomerService } from 'src/app/services/computer-customer/cart-customer/cart-customer.service';
import { CategoryMetaService } from 'src/app/services/computer-management/category-meta/category-meta.service';
import { ProductService } from 'src/app/services/computer-management/product/product.service';
import { formatDistance } from 'date-fns';
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.less'],
})
export class ProductDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  data = {
    author: 'Han Solo',
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    content:
      'We supply a series of design principles, practical patterns and high quality design resources' +
      '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
    children: [
      {
        author: 'Han Solo',
        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        content:
          'We supply a series of design principles, practical patterns and high quality design resources' +
          '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
        children: [
          {
            author: 'Han Solo',
            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            content:
              'We supply a series of design principles, practical patterns and high quality design resources' +
              '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
          },
          {
            author: 'Han Solo',
            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            content:
              'We supply a series of design principles, practical patterns and high quality design resources' +
              '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
          },
        ],
      },
    ],
  };
  likes = 0;
  dislikes = 0;
  time = formatDistance(new Date(), new Date());

  like(): void {
    this.likes = 1;
    this.dislikes = 0;
  }

  dislike(): void {
    this.likes = 0;
    this.dislikes = 1;
  }
  urlComment = '';
  myThumbnail: any;
  itemQuickView: any = {};
  tooltips = ['Cực tệ', 'Tệ', 'Trung bình', 'Tốt', 'Tuyệt vời'];
  value = 3;
  baseFile = environment.BASE_FILE_URL;
  constructor(
    private route: ActivatedRoute,
    private cartCusService: CartCustomerService,
    private prodService: ProductService,
    private categoryMetaService: CategoryMetaService,
  ) {
    this.fetchListCategoryMetaByProd();
    const code = this.route.snapshot.paramMap.get('id');
    console.log(code);
    this.urlComment = 'http://localhost:4200/product-detail/' + code;
    this.fetchProductByCode(code ? code : '');
  }
  listCateMeta: any[] = [];
  fetchListCategoryMetaByProd() {
    this.categoryMetaService.getAll().subscribe((res) => {
      this.listCateMeta = res.data.data;
    });
  }
  pageSize = 4;
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
  fetchProductByCode(code: string) {
    if (code) {
      this.prodService.getByCode(code).subscribe(
        (res) => {
          this.itemQuickView = res.data;
          this.myThumbnail = this.baseFile + this.itemQuickView.pictures[0];
          this.itemQuickView.listPicturesActive = this.getListProdActive(this.itemQuickView.pictures);
          this.itemQuickView.listPicturesRs = this.getListProdRs(this.itemQuickView.pictures);
          this.itemQuickView.listCategoryMetaProducts.map((item: any) => {
            this.listCateMeta.map((cate) => {
              if (cate.id === item.categoryMetaId) {
                item.categoryMetaName = cate.key;
              }
            });
          });
        },
        (err) => {
          console.log(err);
        },
      );
    }
  }
  ngOnDestroy(): void {}
  changePicture(item: any) {
    this.myThumbnail = this.baseFile + item;
  }
  addToCart(item: any) {
    this.cartCusService.addToCart(item);
  }
  createFbSdk() {
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
  ngOnInit(): void {
    this.createFbSdk();
  }
  ngAfterViewInit() {}
}
