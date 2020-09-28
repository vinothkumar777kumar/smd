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
import { WalletComponent } from 'src/app/pages/wallet/wallet.component';
import { UsersComponent } from 'src/app/pages/users/users.component';
import { AdmindashboardComponent } from 'src/app/pages/admindashboard/admindashboard.component';
import { AddCompetitionsComponent } from 'src/app/pages/add-competitions/add-competitions.component';
import { WinnerComponent } from 'src/app/pages/winner/winner.component';
import { CouponComponent } from 'src/app/pages/coupon/coupon.component';
import { AddCouponComponent } from 'src/app/pages/add-coupon/add-coupon.component';
import { AddWinnerComponent } from 'src/app/pages/add-winner/add-winner.component';
import { FreeTicketComponent } from 'src/app/pages/free-ticket/free-ticket.component';
import { AddFreeticketsComponent } from 'src/app/pages/add-freetickets/add-freetickets.component';
import { SaleDiscountComponent } from 'src/app/pages/sale-discount/sale-discount.component';
import { RolloverComponent } from 'src/app/pages/rollover/rollover.component';
import { DailySaleReportComponent } from 'src/app/pages/daily-sale-report/daily-sale-report.component';
import { SalediscountlistComponent } from 'src/app/pages/salediscountlist/salediscountlist.component';
import { ViewfreeticketUserComponent } from 'src/app/pages/viewfreeticket-user/viewfreeticket-user.component';
import { ViewsalediscountComponent } from 'src/app/pages/viewsalediscount/viewsalediscount.component';
import { EditsalediscountComponent } from 'src/app/pages/editsalediscount/editsalediscount.component';
import { DrawAnnounceComponent } from 'src/app/pages/draw-announce/draw-announce.component';

import { DrawResultsComponent } from 'src/app/pages/draw-results/draw-results.component';
import { LiveActiveCompetitionComponent } from 'src/app/pages/live-active-competition/live-active-competition.component';
import { LiveChartDataComponent } from 'src/app/pages/live-chart-data/live-chart-data.component';
import { BlogListComponent } from 'src/app/pages/blog-list/blog-list.component';
import { AddBlogComponent } from 'src/app/pages/add-blog/add-blog.component';
import { EditCompetitionComponent } from 'src/app/pages/edit-competition/edit-competition.component';
import { FreeTicketReportComponent } from 'src/app/pages/free-ticket-report/free-ticket-report.component';
import { ViewFreeticketusersComponent } from 'src/app/pages/view-freeticketusers/view-freeticketusers.component';
import { ViewSalediscountreportComponent } from 'src/app/pages/view-salediscountreport/view-salediscountreport.component';
import { ViewTicketStatusComponent } from 'src/app/pages/view-ticket-status/view-ticket-status.component';
import { CouponReportComponent } from 'src/app/pages/coupon-report/coupon-report.component';
import { CouponReportViewComponent } from 'src/app/pages/coupon-report-view/coupon-report-view.component';
import { AdminTestimonialslistComponent } from 'src/app/pages/admin-testimonialslist/admin-testimonialslist.component';
import { AdminAddtestimonialslistComponent } from 'src/app/pages/admin-addtestimonialslist/admin-addtestimonialslist.component';
import { QuestionsComponent } from 'src/app/pages/questions/questions.component';
import { AddQuestionsComponent } from 'src/app/pages/add-questions/add-questions.component';
import { RolloverNotificationComponent } from 'src/app/pages/rollover-notification/rollover-notification.component';
import { CompetitionReportComponent } from 'src/app/pages/competition-report/competition-report.component';
import { ViewUserReportComponent } from 'src/app/pages/view-user-report/view-user-report.component';
import { ViewTicketReportComponent } from 'src/app/pages/view-ticket-report/view-ticket-report.component';
import { ViewUserdetailReportComponent } from 'src/app/pages/view-userdetail-report/view-userdetail-report.component';
import { EditUserComponent } from 'src/app/pages/edit-user/edit-user.component';
import { RelaunchCouponComponent } from 'src/app/pages/relaunch-coupon/relaunch-coupon.component';



export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: AdmindashboardComponent },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'how_to_play', component: HowtoplayComponent },
    { path: 'active-competitions', component: ActivecompetitionComponent},
    { path: 'live-draws', component: LiveDrawsComponent},
    { path: 'winners-podium', component: WinnersPodiumComponent},
    { path: 'my-account', component: MyAccountComponent},
    { path: 'cart', component: CartComponent},
    { path: 'wallet', component: WalletComponent},
    { path: 'my-transaction', component: MytransactionsComponent},
    { path: 'my-ticket', component: MyticketComponent},
    { path: 'users', component: UsersComponent},
    { path: 'add-competition', component: AddCompetitionsComponent},
    { path: 'winner', component: WinnerComponent},
    { path: 'coupon', component: CouponComponent},
    { path: 'add-winner', component: AddWinnerComponent},
    { path: 'add-coupon', component: AddCouponComponent},
    { path: 'free-ticket', component: FreeTicketComponent},
    { path: 'add-freeticket', component: AddFreeticketsComponent},
    { path: 'sale-discount', component: SaleDiscountComponent},
    { path: 'rollover', component: RolloverComponent},
    { path: 'daily-sale-report', component: DailySaleReportComponent},
    { path: 'sale-discount-list', component: SalediscountlistComponent},
    { path: 'view-freeticket-users', component: ViewfreeticketUserComponent},
    { path: 'view-salediscount', component: ViewsalediscountComponent},
    { path: 'editsale-discount', component: EditsalediscountComponent},
    { path: 'draw-announce', component: DrawAnnounceComponent},
    { path: 'draw-results', component: DrawResultsComponent},
    { path: 'live-active-competition', component: LiveActiveCompetitionComponent},
    { path: 'live-chart-data', component: LiveChartDataComponent},
    { path: 'blog-list', component: BlogListComponent},
    { path: 'add-blog', component: AddBlogComponent},
    {path:'edit-competition',component: EditCompetitionComponent},
    {path:'freetickets-report',component: FreeTicketReportComponent},
    {path:'view-freeticketusers',component: ViewFreeticketusersComponent},
    {path:'view-salediscountreport',component: ViewSalediscountreportComponent},
    {path:'view-ticket-status',component: ViewTicketStatusComponent},
    {path:'coupon-report',component: CouponReportComponent},
    {path:'coupon-report-view',component: CouponReportViewComponent},
    { path: 'testimonialstable', component: AdminTestimonialslistComponent},
    { path: 'addtestimonials', component: AdminAddtestimonialslistComponent},
    { path: 'questionslist', component: QuestionsComponent},
    { path: 'add-question', component: AddQuestionsComponent},
    { path: 'rollover-competition', component: RolloverNotificationComponent},
    { path: 'sales-report', component: CompetitionReportComponent},
    { path: 'view-userwise-report', component: ViewUserReportComponent},
    { path: 'view-ticketwise-report', component: ViewTicketReportComponent},
    { path: 'view-userdetails-report', component: ViewUserdetailReportComponent},
    { path: 'edit-user', component: EditUserComponent},
    { path: 'relaunch-coupon', component: RelaunchCouponComponent},

    
    
];
