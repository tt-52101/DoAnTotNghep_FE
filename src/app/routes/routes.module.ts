import { NgModule, Type } from '@angular/core';

import { SharedModule } from '@shared';
// single pages
import { CallbackComponent } from './callback/callback.component';
// dashboard pages
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserLockComponent } from './passport/lock/lock.component';
// passport pages
import { UserLoginComponent } from './passport/login/login.component';
import { UserRegisterResultComponent } from './passport/register-result/register-result.component';
import { UserRegisterComponent } from './passport/register/register.component';
import { RouteRoutingModule } from './routes-routing.module';
import { NzBackTopModule } from 'ng-zorro-antd/back-top';
import { AgGridModule } from 'ag-grid-angular';

import { BtnCellRenderComponent } from '@shared';
import { StatusCellRenderComponent } from '@shared';
import { StatusDeleteCellRenderComponent } from '@shared';
import { StatusImportCellRenderComponent } from '@shared';
import { StatusNameCellRenderComponent } from '@shared';
import { AgGridComponent } from './ag-grid/demo/ag-grid.component';
import { IsLockCellRenderComponent } from '../shared/ag-grid/cell-render/is-lock-cell-render/is-lock-cell-render.component';
import { IsAdminCellRenderComponent } from '../shared/ag-grid/cell-render/is-admin-cell-render/is-admin-cell-render.component';

const COMPONENTS: Type<void>[] = [
  DashboardComponent,
  // passport pages
  UserLoginComponent,
  UserRegisterComponent,
  UserRegisterResultComponent,
  UserLockComponent,
  // single pages
  CallbackComponent,
  // Ag-grid
  AgGridComponent,
  StatusCellRenderComponent,
  StatusNameCellRenderComponent,
  IsLockCellRenderComponent,
  StatusDeleteCellRenderComponent,
  StatusImportCellRenderComponent,
  BtnCellRenderComponent,
  IsAdminCellRenderComponent,
];
const COMPONENTS_NOROUNT: Type<void>[] = [];

@NgModule({
  imports: [SharedModule, NzBackTopModule, RouteRoutingModule, AgGridModule.withComponents([])],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class RoutesModule {}
