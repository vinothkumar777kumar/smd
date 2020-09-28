import { Component, OnInit, ViewChild } from '@angular/core';
import {FormGroup,FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {IAngularMyDpOptions, AngularMyDatePickerDirective} from 'angular-mydatepicker';
import pdfMake from 'pdfmake/build/pdfmake';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-coupon-report',
  templateUrl: './coupon-report.component.html',
  styleUrls: ['./coupon-report.component.css']
})
export class CouponReportComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger:Subject<any> = new Subject();
  isSubmitted:boolean =false;
  isLoading:boolean =false;
  isloading:boolean = false;
  freeticketsform:FormGroup;
  bodyData:any;
  dataUrlbase64:any;
  start_date:AngularMyDatePickerDirective;
  end_date:any;
  competitionarray = [];
  competition:any;
  freeticketsdata = [];
  coupondataarray = [];
  emptycoupondata:boolean =false;
  logininfo:any;
  constructor(private Activate: ActivatedRoute,private fb:FormBuilder,private location: Location,
    private router: Router,private ds: DataserviceService,private toastr: ToastrService) {
      this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
      // this.getcompetitons_data();
      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 5,
        processing: true
      }
      this.getcoupon_data();
     
     }

  ngOnInit(): void {
  }

  getcoupon_data(){
    this.isloading = true;
    this.emptycoupondata = false;
    this.ds.getmethod('couponreports',this.logininfo['success']['token']).subscribe(res => {
      this.isloading = false;
      if(res['status'] == 'SUCCESS'){
        let data = res['data'];
        console.log(data);
        if(data == ''){
this.emptycoupondata = true;
        }else{
        data.forEach(c => {
          this.coupondataarray.push({id:c.id,coupon:c.coupon,code:c.code,valid_from:c.valid_from,
            valid_to:c.valid_to});
          
        })
        if(this.coupondataarray.length <= 0){
this.emptycoupondata = false;
        }
        this.dtTrigger.next();
      }
// this.competitionarray =competitionarray;
      }
    },error => {

    });
  }

  viewcoupondata(data){
    const navigationExtras = {
      queryParams: {
        coupon_id: data.id  
      }
  };
  this.router.navigate(['/coupon-report-view'], navigationExtras);
  }

}
