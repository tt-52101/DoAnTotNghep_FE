import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared';
import { ComputerCustomerRoutingModule } from './computer-customer-routing.module';
import { HomeComponent } from './home/home/home.component';
import { MenuComponent } from './menu/menu.component';
import { SliderComponent } from './slider/slider.component';
import { SupportComponent } from './support/support.component';
import { SubscribeComponent } from './subscribe/subscribe.component';
import { FooterComponent } from './footer/footer.component';
import { LayoutComponent } from './layout/layout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HeaderCusComponent } from './header-cus/header-cus.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { LoginRedirectComponent } from './login-redirect/login-redirect.component';
import { AccountDetailComponent } from './account-detail/account-detail.component';
import { QuickViewComponent } from './quick-view/quick-view.component';
import { NgxImageZoomModule } from 'ngx-image-zoom';

@NgModule({
  declarations: [
    HomeComponent,
    MenuComponent,
    SliderComponent,
    SupportComponent,
    SubscribeComponent,
    FooterComponent,
    LayoutComponent,
    ProductDetailComponent,
    NotFoundComponent,
    HeaderCusComponent,
    LoginComponent,
    RegisterComponent,
    LoginRedirectComponent,
    AccountDetailComponent,
    QuickViewComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, NgxImageZoomModule, NgxCaptchaModule, SharedModule, ComputerCustomerRoutingModule],
})
export class ComputerCustomerModule {}
