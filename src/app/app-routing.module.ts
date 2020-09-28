import { NgModule } from '@angular/core';
import { Routes, RouterModule,RouterLink } from '@angular/router';
import { BasiclayoutComponent } from './layout/basiclayout/basiclayout.component';

import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AuthlayoutComponent } from './layout/authlayout/authlayout.component';
import { AdminlayoutComponent } from './layout/adminlayout/adminlayout.component';
import { ThankyouPageComponent } from './pages/thankyou-page/thankyou-page.component';
import { DataserviceService } from './dataservice/dataservice.service';
import { ApiconfigService } from './dataservice/apiconfig.service';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {path:'',component:BasiclayoutComponent,children:[
    {
      path: '',
      loadChildren: './layout/basiclayout/basiclayout.module#BasiclayoutModule'
    }
  ]},
  {
    path: '',component: AuthlayoutComponent,children: [
      {
        path: '',
        loadChildren: './layout/authlayout/authlayout.module#AuthlayoutModule'
      },
    ]
  },
  {
    path: '',component: AdminlayoutComponent,children: [
      {
        path: '',
        loadChildren: './layout/adminlayout/adminlayout.module#AdminlayoutModule'
      },
    ]
  },
  {path:'thankyou',component:ThankyouPageComponent}
];

@NgModule({
  imports: [CommonModule,BrowserModule,RouterModule.forRoot(routes,{useHash:true})],
  providers:[DataserviceService,ApiconfigService],
  exports: [RouterModule,RouterLink]
})
export class AppRoutingModule { }
