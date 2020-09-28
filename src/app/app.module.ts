import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComponentModule } from './component/component.module';
import { BasiclayoutModule } from './layout/basiclayout/basiclayout.module';
import { BasiclayoutComponent } from './layout/basiclayout/basiclayout.component';
import { HowtoplayComponent } from './pages/howtoplay/howtoplay.component';
import { BlogComponent } from './pages/blog/blog.component';
import { ActivecompetitionComponent } from './pages/activecompetition/activecompetition.component';
import { LiveDrawsComponent } from './pages/live-draws/live-draws.component';
import { WinnersPodiumComponent } from './pages/winners-podium/winners-podium.component';
import { AuthlayoutComponent } from './layout/authlayout/authlayout.component';
import { AuthlayoutModule } from './layout/authlayout/authlayout.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PostCheckoutComponent } from './pages/post-checkout/post-checkout.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AdminlayoutComponent } from './layout/adminlayout/adminlayout.component';
import { AdminlayoutModule } from './layout/adminlayout/adminlayout.module';
import { ThankyouPageComponent } from './pages/thankyou-page/thankyou-page.component';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';

import {
  GoogleLoginProvider,
  FacebookLoginProvider,
  AmazonLoginProvider,
} from 'angularx-social-login';
import { DataserviceService } from './dataservice/dataservice.service';
import { ApiconfigService } from './dataservice/apiconfig.service';



@NgModule({
  declarations: [
    AppComponent,
    BasiclayoutComponent,
    HowtoplayComponent,
    BlogComponent,
    ActivecompetitionComponent,
    LiveDrawsComponent,
    WinnersPodiumComponent,
    AuthlayoutComponent,
    PostCheckoutComponent,
    AdminlayoutComponent,
    ThankyouPageComponent
    

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BasiclayoutModule,
    ComponentModule,
    AuthlayoutModule,
    NgbModule ,
    BrowserAnimationsModule,
    HttpClientModule,
    AdminlayoutModule,
    SocialLoginModule
    
  ],
  providers: [Location,{provide:LocationStrategy,useClass:PathLocationStrategy},DataserviceService,ApiconfigService, {
    provide: 'SocialAuthServiceConfig',
    useValue: {
      autoLogin: false,
      providers: [
        
        {
          id: FacebookLoginProvider.PROVIDER_ID,
          provider: new FacebookLoginProvider('613265845962607'),
        },
      ],
    } as SocialAuthServiceConfig,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
