import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountDetailComponent } from './account-detail/account-detail.component';
import { HomeComponent } from './home/home/home.component';
import { LoginRedirectComponent } from './login-redirect/login-redirect.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {
    path: '',
    // component: LayoutProComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'login', component: LoginRedirectComponent },
      { path: 'account-detail', component: AccountDetailComponent },
      { path: 'product-detail/:id', component: ProductDetailComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComputerCustomerRoutingModule {}
