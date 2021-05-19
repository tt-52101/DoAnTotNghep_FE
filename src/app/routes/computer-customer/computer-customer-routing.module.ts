import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountDetailComponent } from './account-detail/account-detail.component';
import { CartDetailComponent } from './cart-detail/cart-detail.component';
import { CheckOutComponent } from './check-out/check-out.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { HomeComponent } from './home/home/home.component';
import { LoginRedirectComponent } from './login-redirect/login-redirect.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { RegisterComponent } from './register/register.component';
import { SearchDetailComponent } from './search-detail/search-detail.component';

const routes: Routes = [
  {
    path: '',
    // component: LayoutProComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'register', component: RegisterComponent, data: { title: 'Đăng kí tài khoản' } },
      { path: 'login', component: LoginRedirectComponent, data: { title: 'Đăng nhập' } },
      { path: 'account-detail', component: AccountDetailComponent, data: { title: 'Chi tiết tài khoản' } },
      { path: 'checkout', component: CheckOutComponent, data: { title: 'Thanh toán' } },
      { path: 'cart-detail', component: CartDetailComponent, data: { title: 'Thông tin giỏ hàng' } },
      { path: 'search-detail', component: SearchDetailComponent, data: { title: 'Tìm kiếm sản phẩm' } },
      { path: 'product-detail/:id', component: ProductDetailComponent, data: { title: 'Chi tiết sản phẩm' } },
      { path: 'confirm/:id', component: ConfirmComponent, data: { title: 'Đặt hàng thành công' } },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComputerCustomerRoutingModule {}
