import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginHeaderComponent } from './login-header/login-header.component';
import { AdminLoginHeaderComponent } from './admin-login-header/admin-login-header.component';




@NgModule({
  declarations: [HeaderComponent,FooterComponent, LoginHeaderComponent,AdminLoginHeaderComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    LoginHeaderComponent,
    AdminLoginHeaderComponent
  ]
})
export class ComponentModule { }
