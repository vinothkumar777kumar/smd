import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AdmindashboardComponent } from 'src/app/pages/admindashboard/admindashboard.component';
import { AdminLayoutRoutes } from './adminlayout-routing.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersComponent } from 'src/app/pages/users/users.component';
import { ToastrModule } from 'ngx-toastr';
import { ArchwizardModule } from 'angular-archwizard';
import { AddCouponComponent } from 'src/app/pages/add-coupon/add-coupon.component';
import { CouponComponent } from 'src/app/pages/coupon/coupon.component';
import { WinnerComponent } from 'src/app/pages/winner/winner.component';
import { CompetitionsComponent } from 'src/app/pages/competitions/competitions.component';
import { AddWinnerComponent } from 'src/app/pages/add-winner/add-winner.component';
import { AddCompetitionsComponent } from 'src/app/pages/add-competitions/add-competitions.component';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { FreeTicketComponent } from 'src/app/pages/free-ticket/free-ticket.component';
import { AddFreeticketsComponent } from 'src/app/pages/add-freetickets/add-freetickets.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SaleDiscountComponent } from 'src/app/pages/sale-discount/sale-discount.component';
import { DailySaleReportComponent } from 'src/app/pages/daily-sale-report/daily-sale-report.component';
import { RolloverComponent } from 'src/app/pages/rollover/rollover.component';
import { ChartsModule } from 'ng2-charts';
import { DatepipePipe } from 'src/app/pages/datepipe.pipe';
import { UiSwitchModule } from 'ngx-toggle-switch';
import { SalediscountlistComponent } from 'src/app/pages/salediscountlist/salediscountlist.component';
import { ViewfreeticketUserComponent } from 'src/app/pages/viewfreeticket-user/viewfreeticket-user.component';
import { ViewsalediscountComponent } from 'src/app/pages/viewsalediscount/viewsalediscount.component';
import { EditsalediscountComponent } from 'src/app/pages/editsalediscount/editsalediscount.component';
import { DrawAnnounceComponent } from 'src/app/pages/draw-announce/draw-announce.component';
import { LiveDrawDetailsComponent } from 'src/app/pages/live-draw-details/live-draw-details.component';
import { DrawResultsComponent } from 'src/app/pages/draw-results/draw-results.component';
import { FusionChartsModule } from "angular-fusioncharts";
import * as FusionCharts from "fusioncharts";
import * as charts from "fusioncharts/fusioncharts.charts";
import * as FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import { LiveActiveCompetitionComponent } from 'src/app/pages/live-active-competition/live-active-competition.component';
import { LiveChartDataComponent } from 'src/app/pages/live-chart-data/live-chart-data.component';
import { BlogListComponent } from 'src/app/pages/blog-list/blog-list.component';
import { AddBlogComponent } from 'src/app/pages/add-blog/add-blog.component';
import { SortableDirective } from './sortable.directive';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CompetitionDirective } from './competition.directive';
import { DataTablesModule } from 'angular-datatables';
import { EditCompetitionComponent } from 'src/app/pages/edit-competition/edit-competition.component';
import { BlogViewComponent } from 'src/app/pages/blog-view/blog-view.component';
import { FreeTicketReportComponent } from 'src/app/pages/free-ticket-report/free-ticket-report.component';
// import { CKEditorModule } from 'ckeditor4-angular';
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
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CompetitionReportComponent } from 'src/app/pages/competition-report/competition-report.component';
import { ViewTicketReportComponent } from 'src/app/pages/view-ticket-report/view-ticket-report.component';
import { ViewUserReportComponent } from 'src/app/pages/view-user-report/view-user-report.component';
import { ViewUserdetailReportComponent } from 'src/app/pages/view-userdetail-report/view-userdetail-report.component';
import { EditUserComponent } from 'src/app/pages/edit-user/edit-user.component';
import { RelaunchCouponComponent } from 'src/app/pages/relaunch-coupon/relaunch-coupon.component';


// Pass the fusioncharts library and chart modules
FusionChartsModule.fcRoot(FusionCharts, charts, FusionTheme);

@NgModule({
  declarations: [AdmindashboardComponent,UsersComponent,AddCouponComponent,CouponComponent,WinnerComponent,
    CompetitionsComponent,AddWinnerComponent,AddCompetitionsComponent,FreeTicketComponent,AddFreeticketsComponent,SaleDiscountComponent,
    DailySaleReportComponent,RolloverComponent,DatepipePipe,SalediscountlistComponent,ViewfreeticketUserComponent,
    ViewsalediscountComponent,EditsalediscountComponent,DrawAnnounceComponent,LiveDrawDetailsComponent,DrawResultsComponent,
    LiveActiveCompetitionComponent,LiveChartDataComponent,BlogListComponent,AddBlogComponent,SortableDirective, CompetitionDirective,
    EditCompetitionComponent,BlogViewComponent,FreeTicketReportComponent,ViewFreeticketusersComponent,ViewSalediscountreportComponent,
    ViewTicketStatusComponent,AdminTestimonialslistComponent,AdminAddtestimonialslistComponent,
    CouponReportComponent,CouponReportViewComponent,QuestionsComponent,AddQuestionsComponent,RolloverNotificationComponent,CompetitionReportComponent,
    ViewTicketReportComponent,ViewUserReportComponent,ViewUserdetailReportComponent,EditUserComponent,RelaunchCouponComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,ReactiveFormsModule,
    ToastrModule.forRoot(),
    ArchwizardModule,
    AngularMyDatePickerModule,
    NgMultiSelectDropDownModule,
    ChartsModule,
    UiSwitchModule,
    FusionChartsModule,
    NgbModule,
    DataTablesModule,
    CKEditorModule
  ],
  exports:[CompetitionsComponent],
  bootstrap:[CompetitionsComponent]
})
export class AdminlayoutModule { }
