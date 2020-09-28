import { Component, OnInit, ViewChild } from '@angular/core';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import * as $ from 'jquery';
import Swal from 'sweetalert2'
import {MovingDirection} from 'angular-archwizard';
import { error } from 'protractor';
import {IAngularMyDpOptions, IMyDateModel, IMyCalendarViewChanged, IMyRangeDateSelection, AngularMyDatePickerDirective} from 'angular-mydatepicker';
import * as moment from 'moment'; 
import { Router, ActivatedRoute } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { DataTableDirective } from 'angular-datatables';
import {BehaviorSubject, of, Subject} from 'rxjs';
@Component({
  selector: 'app-coupon-report-view',
  templateUrl: './coupon-report-view.component.html',
  styleUrls: ['./coupon-report-view.component.css']
})
export class CouponReportViewComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger:Subject<any> = new Subject();
  coupontid:any;
  logininfo:any;
  couponusers = [];
  emptycouponuser:boolean = false;
  isloading:boolean = false;
  constructor(private http: HttpClient,private location: Location,private router: Router,private ds: DataserviceService,
    private toastr: ToastrService,private Activate:ActivatedRoute) {
      this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 5,
        processing: true
      }
    this.Activate.queryParams.subscribe(res => {
      this.coupontid = res.coupon_id;
this.getcoupon_userdata()
    });
    }

  ngOnInit(): void {
  }

  getcoupon_userdata(){
    this.isloading = true;
    this.ds.getmethod('couponusers/'+this.coupontid, this.logininfo['success']['token']).subscribe(res => {
      this.isloading = false;
      if(res['status'] == 'SUCCESS'){
  let data = res['data'];
  if(data == ''){
    this.emptycouponuser = true;
  }else{
    data.forEach(cu => {
      this.couponusers.push({id:cu.id,name:cu.name,competition:cu.competition,booking_date:cu.booking_date,
        no_of_tickets:cu.no_of_tickets,sale_price:cu.sale_price,total_price:cu.total_price})
    });
    this.dtTrigger.next();
  }
 
      }
    });
  }

}
