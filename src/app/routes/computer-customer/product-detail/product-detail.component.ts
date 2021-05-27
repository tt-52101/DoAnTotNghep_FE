import { AfterViewInit, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { environment } from '@env/environment';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { CartCustomerService } from 'src/app/services/computer-customer/cart-customer/cart-customer.service';
import { CategoryMetaService } from 'src/app/services/computer-management/category-meta/category-meta.service';
import { ProductService } from 'src/app/services/computer-management/product/product.service';
import { formatDistance } from 'date-fns';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ProductReviewService } from 'src/app/services/computer-management/product-review/product-review.service';
import { ArrayService } from '@delon/util';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { NzI18nService } from 'ng-zorro-antd/i18n';
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.less'],
})
export class ProductDetailComponent implements OnInit, AfterViewInit, OnDestroy {
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
  inputReview = '';
  userInfo: any = {};
  urlComment = '';
  myThumbnail: any;
  itemQuickView: any = {};
  tooltips = ['Cực tệ', 'Tệ', 'Trung bình', 'Tốt', 'Tuyệt vời'];
  value = 5;
  token: any;
  inputValue = '';
  public Editor = ClassicEditor;
  baseFile = environment.BASE_FILE_URL;
  constructor(
    private arrayService: ArrayService,
    private route: ActivatedRoute,
    private nzI18n: NzI18nService,
    private prodReviewService: ProductReviewService,
    private nzMessage: NzMessageService,
    private cartCusService: CartCustomerService,
    private prodService: ProductService,
    private categoryMetaService: CategoryMetaService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {
    this.userInfo = JSON.parse(localStorage.getItem('user-info') || '{}');
    this.token = this.tokenService.get()?.token;
    this.fetchListCategoryMetaByProd();
    const code = this.route.snapshot.paramMap.get('id');
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
          this.fetchListProdReview();
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
  listProdReview: any[] = [];
  listRs: any[] = [];
  fetchListProdReview(commentId = null) {
    this.listRs = [];
    this.prodReviewService.getById(this.itemQuickView.id).subscribe((res) => {
      if (res.code === 200) {
        const data = res.data;
        this.listProdReview = res.data;
        const arrayTreeResult = data.map((item: any, i: number, arr: any[]) => {
          const checkIsLeft = arr.some((c) => c.parentId === item.id);

          return {
            id: item.id,
            parent_id: item.parentId,
            userName: item.userName,
            code: item.code,
            avatarUrl: item.avatarUrl,
            checked: false,
            content: item.content,
            createdDate: formatDistanceToNow(new Date(item.createdDate) as Date, { locale: this.nzI18n.getDateLocale() }),
            rating: item.rating,
            status: item.status,
            userId: item.userId,
            isLeaf: !checkIsLeft,
          };
        });
        const l = this.arrayService.arrToTreeNode(arrayTreeResult, {
          cb: (item, parent, deep) => {
            if (commentId !== null) {
              if (item.id === commentId) {
                item.checked = true;
              }
            }
            if (deep === 1) {
              item.isRoot = true;
              this.listRs.push(item);
            } else {
              item.isRoot = false;
            }
          },
        });
      }
    });
  }
  submitComment(parentId = null, type: any) {
    const token = this.tokenService.get()?.token;
    if (token) {
      let model: any;
      switch (type) {
        case 1:
          if (this.inputReview === '' || this.inputReview === undefined || this.inputReview === null) {
            this.nzMessage.error('Bạn hãy nhập bình luận nhé <3');
            return;
          }
          model = {
            productId: this.itemQuickView.id,
            productName: this.itemQuickView.name,
            userId: this.userInfo.id,
            avatarUrl: this.userInfo.avatar,
            rating: this.value,
            isRating: true,
            status: true,
            content: this.inputReview,
          };
          break;
        case 2:
          if (this.inputValue === '' || this.inputValue === undefined || this.inputValue === null) {
            this.nzMessage.error('Bạn hãy nhập bình luận nhé <3');
            return;
          }
          model = {
            productId: this.itemQuickView.id,
            productName: this.itemQuickView.name,
            userId: this.userInfo.id,
            avatarUrl: this.userInfo.avatar,
            rating: this.value,
            isRating: false,
            status: true,
            content: this.inputValue,
          };
          break;
        default:
          break;
      }
      if (parentId !== null) {
        Object.assign(model, { parentId: parentId });
      }
      this.prodReviewService.create(model).subscribe(
        (res) => {
          if (res.code === 200) {
            this.nzMessage.success('Đánh giá thành công. Chúc bạn có một ngày vui vẻ ^^');
            this.fetchListProdReview();
            this.inputValue = '';
            this.inputReview = '';
          }
        },
        (err) => {
          this.nzMessage.error('Có lỗi xảy ra ' + err.error.message);
        },
      );
    } else {
      this.nzMessage.error('Bạn cần đăng nhập để đánh giá');
      return;
    }
  }
  openReply(id: any) {
    this.listRs = [];
    const arrayTreeResult = this.listProdReview.map((item: any, i: number, arr: any[]) => {
      const checkIsLeft = arr.some((c) => c.parentId === item.id);

      return {
        id: item.id,
        parent_id: item.parentId,
        userName: item.userName,
        code: item.code,
        avatarUrl: item.avatarUrl,
        checked: false,
        content: item.content,
        createdDate: formatDistanceToNow(new Date(item.createdDate) as Date, { locale: this.nzI18n.getDateLocale() }),
        rating: item.rating,
        status: item.status,
        userId: item.userId,
        isLeaf: !checkIsLeft,
      };
    });
    const l = this.arrayService.arrToTreeNode(arrayTreeResult, {
      cb: (item, parent, deep) => {
        if (id !== null) {
          if (item.id === id) {
            item.checked = true;
          }
        }
        if (deep === 1) {
          item.isRoot = true;
          this.listRs.push(item);
        } else {
          item.isRoot = false;
        }
      },
    });
  }
  handleClose(id: any) {
    this.listRs = [];
    const arrayTreeResult = this.listProdReview.map((item: any, i: number, arr: any[]) => {
      const checkIsLeft = arr.some((c) => c.parentId === item.id);
      return {
        id: item.id,
        parent_id: item.parentId,
        userName: item.userName,
        code: item.code,
        avatarUrl: item.avatarUrl,
        checked: false,
        content: item.content,
        createdDate: formatDistanceToNow(new Date(item.createdDate) as Date, { locale: this.nzI18n.getDateLocale() }),
        rating: item.rating,
        status: item.status,
        userId: item.userId,
        isLeaf: !checkIsLeft,
      };
    });
    const l = this.arrayService.arrToTreeNode(arrayTreeResult, {
      cb: (item, parent, deep) => {
        if (id !== null) {
          if (item.id === id) {
            item.checked = false;
          }
        }
        if (deep === 1) {
          item.isRoot = true;
          this.listRs.push(item);
        } else {
          item.isRoot = false;
        }
      },
    });
  }
  ngAfterViewInit() {}
}
