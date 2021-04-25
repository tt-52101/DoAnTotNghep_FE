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
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HeaderCusComponent } from './header-cus/header-cus.component';

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
  ],
  imports: [CommonModule, SharedModule, ComputerCustomerRoutingModule],
})
export class ComputerCustomerModule {}
