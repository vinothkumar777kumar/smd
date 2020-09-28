import { Component, OnInit } from '@angular/core';
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
  selector: 'app-view-ticket-status',
  templateUrl: './view-ticket-status.component.html',
  styleUrls: ['./view-ticket-status.component.css']
})
export class ViewTicketStatusComponent implements OnInit {
  isloading:boolean = false;
  emptyticketstatus:boolean = false;
  logininfo:any;
  competition_id:any;
  ticketstatusarray = [];
  constructor(private http: HttpClient,private location: Location,private router: Router,private ds: DataserviceService,
    private toastr: ToastrService,private Activate:ActivatedRoute) {
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
    this.Activate.queryParams.subscribe(res => {
      this.competition_id = res.id;
this.getticketstatus_data()
    });
   }

  ngOnInit(): void {
  }

  getticketstatus_data(){
    this.isloading = true;
    this.emptyticketstatus = false;
    this.ds.getmethod('status/'+this.competition_id,this.logininfo['success']['token']).subscribe( status => {
      let data = status['success'];
      if(data == ''){
this.emptyticketstatus = true;
this.isloading = false;
      }else{
        this.ticketstatusarray.push(data)
        this.emptyticketstatus = false;
        this.isloading = false;
      }
  console.log(this.ticketstatusarray);
       });
  }

}
