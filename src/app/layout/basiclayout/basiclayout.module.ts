import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from 'src/app/pages/home/home.component';
import { BasicLayoutRoutes } from './basiclayout-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from 'src/app/pages/login/login.component';
import { RegisterComponent } from 'src/app/pages/register/register.component';

import {ProgressBarModule} from "angular-progress-bar"
import { ForgotPasswordComponent } from 'src/app/pages/forgot-password/forgot-password.component';
import { ToastrModule } from 'ngx-toastr';
import { ResetPasswordComponent } from 'src/app/pages/reset-password/reset-password.component';
import { TncComponent } from 'src/app/pages/tnc/tnc.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { CompetitionDetailsComponent } from 'src/app/pages/competition-details/competition-details.component';
import { SoldOutComponent } from 'src/app/pages/sold-out/sold-out.component';
import { PrivacyPolicyComponent } from 'src/app/pages/privacy-policy/privacy-policy.component';
import { LoginWithPhoneComponent } from 'src/app/pages/login-with-phone/login-with-phone.component';
import { CallbackComponent } from 'src/app/pages/callback/callback.component';
import { TestimonialsComponent } from 'src/app/pages/testimonials/testimonials.component';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import { ApiconfigService } from 'src/app/dataservice/apiconfig.service';


@NgModule({
  declarations: [HomeComponent,LoginComponent,RegisterComponent,
    ForgotPasswordComponent,ResetPasswordComponent,TncComponent,CompetitionDetailsComponent,SoldOutComponent,
    PrivacyPolicyComponent,LoginWithPhoneComponent,CallbackComponent,TestimonialsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(BasicLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ProgressBarModule,
    ToastrModule.forRoot(),
    NgxPaginationModule
  ],
  providers:[DataserviceService,ApiconfigService],
  exports: [],
  bootstrap: [CompetitionDetailsComponent]
})
export class BasiclayoutModule { }
