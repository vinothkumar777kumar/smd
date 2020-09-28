import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartComponent } from 'src/app/pages/cart/cart.component';
import { RouterModule } from '@angular/router';
import { AuthLayoutRoutes } from './authlayout-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyAccountComponent } from 'src/app/pages/my-account/my-account.component';
import { MyticketComponent } from 'src/app/pages/myticket/myticket.component';
import { MytransactionsComponent } from 'src/app/pages/mytransactions/mytransactions.component';
import { WalletComponent } from 'src/app/pages/wallet/wallet.component';
import { AddressSelectComponent } from 'src/app/pages/address-select/address-select.component';
import { ChangePasswordComponent } from 'src/app/pages/change-password/change-password.component';
import { DataTablesModule } from 'angular-datatables';
import { AddTestimonialsComponent } from 'src/app/pages/add-testimonials/add-testimonials.component';
import { TestimonialsListComponent } from 'src/app/pages/testimonials-list/testimonials-list.component';
import { MyFreeticketsComponent } from 'src/app/pages/my-freetickets/my-freetickets.component';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import { ApiconfigService } from 'src/app/dataservice/apiconfig.service';
import { ViewMyticketsComponent } from 'src/app/pages/view-mytickets/view-mytickets.component';
import { ViewMytransactionComponent } from 'src/app/pages/view-mytransaction/view-mytransaction.component';
  





@NgModule({
  declarations: [MyAccountComponent,CartComponent,MyticketComponent,WalletComponent,MytransactionsComponent,
    AddressSelectComponent,ChangePasswordComponent,AddTestimonialsComponent,TestimonialsListComponent,
    MyFreeticketsComponent,ViewMyticketsComponent,ViewMytransactionComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(AuthLayoutRoutes),
    FormsModule,ReactiveFormsModule,
    DataTablesModule
  ],
  providers:[DataserviceService,ApiconfigService]
})
export class AuthlayoutModule { }
