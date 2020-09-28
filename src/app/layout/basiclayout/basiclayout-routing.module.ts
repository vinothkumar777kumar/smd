import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from 'src/app/pages/home/home.component';
import { LoginComponent } from 'src/app/pages/login/login.component';
import { RegisterComponent } from 'src/app/pages/register/register.component';
import { HowtoplayComponent } from 'src/app/pages/howtoplay/howtoplay.component';
import { BlogComponent } from 'src/app/pages/blog/blog.component';
import { ActivecompetitionComponent } from 'src/app/pages/activecompetition/activecompetition.component';
import { LiveDrawsComponent } from 'src/app/pages/live-draws/live-draws.component';
import { WinnersPodiumComponent } from 'src/app/pages/winners-podium/winners-podium.component';
import { CompetitionDetailsComponent } from 'src/app/pages/competition-details/competition-details.component';
import { CartComponent } from 'src/app/pages/cart/cart.component';
import { AddressSelectComponent } from 'src/app/pages/address-select/address-select.component';
import { CheckoutComponent } from 'src/app/pages/checkout/checkout.component';
import { PostCheckoutComponent } from 'src/app/pages/post-checkout/post-checkout.component';
import { ForgotPasswordComponent } from 'src/app/pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from 'src/app/pages/reset-password/reset-password.component';
import { TncComponent } from 'src/app/pages/tnc/tnc.component';
import { LiveDrawDetailsComponent } from 'src/app/pages/live-draw-details/live-draw-details.component';
import { BlogViewComponent } from 'src/app/pages/blog-view/blog-view.component';
import { SoldOutComponent } from 'src/app/pages/sold-out/sold-out.component';
import { PrivacyPolicyComponent } from 'src/app/pages/privacy-policy/privacy-policy.component';
import { LoginWithPhoneComponent } from 'src/app/pages/login-with-phone/login-with-phone.component';
import { CallbackComponent } from 'src/app/pages/callback/callback.component';
import { TestimonialsComponent } from 'src/app/pages/testimonials/testimonials.component';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import { ApiconfigService } from 'src/app/dataservice/apiconfig.service';
import { NgModule } from '@angular/core';

export const BasicLayoutRoutes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'how_to_play', component: HowtoplayComponent },
    { path: 'blog', component: BlogComponent },
    { path: 'active-competitions', component: ActivecompetitionComponent},
    { path: 'live-draws', component: LiveDrawsComponent},
    { path: 'winners-podium', component: WinnersPodiumComponent},
    { path: 'competition-details', component: CompetitionDetailsComponent},
    {path:'cart',component:CartComponent},
    { path: 'address-select', component: AddressSelectComponent},
    { path: 'checkout', component: CheckoutComponent},
    { path: 'post-checkout', component: PostCheckoutComponent},
    { path: 'forgot-password', component: ForgotPasswordComponent},
    { path: 'resetpassword', component: ResetPasswordComponent},
    { path: 'tnc', component: TncComponent},
    { path: 'live-draw-details', component: LiveDrawDetailsComponent},
    { path: 'blog-view', component: BlogViewComponent},
    { path: 'sold-out', component: SoldOutComponent},
    { path: 'privacy-policy', component: PrivacyPolicyComponent},
    { path: 'verify-phone-number', component: LoginWithPhoneComponent},
    { path: 'login/facebook/callback', component: CallbackComponent},
    { path: 'viewtestimonials', component: TestimonialsComponent},
    
];

