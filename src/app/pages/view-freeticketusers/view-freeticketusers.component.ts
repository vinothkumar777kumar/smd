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
  selector: 'app-view-freeticketusers',
  templateUrl: './view-freeticketusers.component.html',
  styleUrls: ['./view-freeticketusers.component.css']
})
export class ViewFreeticketusersComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger:Subject<any> = new Subject();
  freeticketid:any;
  logininfo:any;
  freeticketusers = [];
  emptyfreeticketuser:boolean = false;
  isloading:boolean = false;
  competition_id:any;
  constructor(private http: HttpClient,private location: Location,private router: Router,private ds: DataserviceService,
    private toastr: ToastrService,private Activate:ActivatedRoute) {
      this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
    this.Activate.queryParams.subscribe(res => {
      this.competition_id = res.competition_id;
this.getfreeticket_userdata()
    });
   }

  ngOnInit(): void {
  }

  getfreeticket_userdata(){
    this.isloading = true;
    this.emptyfreeticketuser = false;
    this.ds.getmethod('freeticketusers/'+this.competition_id, this.logininfo['success']['token']).subscribe(res => {
      this.isloading = false;
      if(res['status'] == 'SUCCESS'){
  let data = res['data'];
  if(data == ''){
    this.emptyfreeticketuser = true;
  }else{
    data.forEach(u => {
      this.freeticketusers.push({id:u.id,email:u.email,name:u.name,no_of_tickets:u.no_of_tickets,phone:u.phone})
    });
    this.dtTrigger.next();
    if(this.freeticketusers.length <= 0){
      this.emptyfreeticketuser = true;
    }
  }
 
      }
    });
  }

}
