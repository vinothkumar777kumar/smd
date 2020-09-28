import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import { error } from 'protractor';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import Swal from 'sweetalert2'
import * as $ from 'jquery';
import {BehaviorSubject, of, Subject} from 'rxjs';
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators';
import { DataTableDirective } from 'angular-datatables';
import * as moment from 'moment'; 
@Component({
  selector: 'app-my-freetickets',
  templateUrl: './my-freetickets.component.html',
  styleUrls: ['./my-freetickets.component.css']
})
export class MyFreeticketsComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger:Subject<any> = new Subject();
  userdata:any = [];
  competitionarray:any = [];
  myfreeticketarray = [];
  myaccountdata:any;
  logininfo:any;
  filtertickets:any;
  isloading:boolean = false;
  mySubscription:any;
  emptymyfreeticketfdata:boolean =true;
  constructor(private location: Location,private router: Router,private ds: DataserviceService,private toastr: ToastrService) {
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
    this.getmyfreetickets();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    }
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    
    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
      }
    });
   }

  ngOnInit(): void {
  }

  getmyfreetickets(){
    this.isloading =true;
    this.emptymyfreeticketfdata = false;
  //  let id = data.target.value;
   this.ds.getmethod('userfreeticket',this.logininfo['success']['token']).subscribe(res => {
     console.log(res);
     this.isloading =false;
    if(res['success'].status == 'success'){
let filterticket = [];
      let data  = res['success'].data;
      let competitions;
      data.forEach(mf => {
        let avilbl_free_ticket = 0;
        avilbl_free_ticket = Number(mf.free_tickets) - Number(mf.used_free_tickets);
this.myfreeticketarray.push({competition:mf.competition,total_tickets:mf.free_tickets,used_freetickets:avilbl_free_ticket,
  id:mf.competition_id});
      })
      console.log(this.myfreeticketarray);
      this.dtTrigger.next();
      if(this.myfreeticketarray.length <= 0){
        this.emptymyfreeticketfdata =true;
        this.isloading = false;
      }else{
        this.emptymyfreeticketfdata = false;
      }
  
  }
  },error => {
    this.isloading =false;
    this.emptymyfreeticketfdata =true;
  });
}

}
