import { Routes } from '@angular/router';
import { HomeComponent } from 'src/app/pages/home/home.component';
import { LoginComponent } from 'src/app/pages/login/login.component';
import { RegisterComponent } from 'src/app/pages/register/register.component';
import { HowtoplayComponent } from 'src/app/pages/howtoplay/howtoplay.component';
import { BlogComponent } from 'src/app/pages/blog/blog.component';
import { ActivecompetitionComponent } from 'src/app/pages/activecompetition/activecompetition.component';
import { LiveDrawsComponent } from 'src/app/pages/live-draws/live-draws.component';
import { WinnersPodiumComponent } from 'src/app/pages/winners-podium/winners-podium.component';
import { MyAccountComponent } from 'src/app/pages/my-account/my-account.component';
import { CartComponent } from 'src/app/pages/cart/cart.component';
import { MytransactionsComponent } from 'src/app/pages/mytransactions/mytransactions.component';
import { MyticketComponent } from 'src/app/pages/myticket/myticket.component';
import { CompetitionDetailsComponent } from 'src/app/pages/competition-details/competition-details.component';
import { WalletComponent } from 'src/app/pages/wallet/wallet.component';
import { ChangePasswordComponent } from 'src/app/pages/change-password/change-password.component';
import { CompetitionsComponent } from 'src/app/pages/competitions/competitions.component';
import { AdmindashboardComponent } from 'src/app/pages/admindashboard/admindashboard.component';
import { AddCompetitionsComponent } from 'src/app/pages/add-competitions/add-competitions.component';
import { WinnerComponent } from 'src/app/pages/winner/winner.component';
import { CouponComponent } from 'src/app/pages/coupon/coupon.component';
import { AddCouponComponent } from 'src/app/pages/add-coupon/add-coupon.component';
import { AddWinnerComponent } from 'src/app/pages/add-winner/add-winner.component';
import { TestimonialsListComponent } from 'src/app/pages/testimonials-list/testimonials-list.component';
import { AddTestimonialsComponent } from 'src/app/pages/add-testimonials/add-testimonials.component';
import { MyFreeticketsComponent } from 'src/app/pages/my-freetickets/my-freetickets.component';
import { ViewMyticketsComponent } from 'src/app/pages/view-mytickets/view-mytickets.component';
import { ViewMytransactionComponent } from 'src/app/pages/view-mytransaction/view-mytransaction.component';


export const AuthLayoutRoutes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'how_to_play', component: HowtoplayComponent },
    { path: 'blog', component: BlogComponent },
    { path: 'active-competitions', component: ActivecompetitionComponent},
    { path: 'live-draws', component: LiveDrawsComponent},
    { path: 'winners-podium', component: WinnersPodiumComponent},
    { path: 'my-account', component: MyAccountComponent},
    { path: 'cart', component: CartComponent},
    { path: 'wallet', component: WalletComponent},
    { path: 'my-transaction', component: MytransactionsComponent},
    { path: 'my-ticket', component: MyticketComponent},
    { path: 'view-mytickets', component: ViewMyticketsComponent},
    { path: 'competition-details', component: CompetitionDetailsComponent},
    { path: 'change-password', component: ChangePasswordComponent},
    { path: 'competitions', component: CompetitionsComponent},
    { path: 'testimonials-list', component: TestimonialsListComponent},
    { path: 'add-testimonials', component: AddTestimonialsComponent},
    { path: 'my-freetickets', component: MyFreeticketsComponent},
    { path: 'view-mytransaction', component: ViewMytransactionComponent}
    
    
];
