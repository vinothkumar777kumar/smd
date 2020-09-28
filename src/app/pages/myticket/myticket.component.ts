import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, FormControl,FormArray,FormGroup,Validator,FormBuilder, Validators } from '@angular/forms';
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
  selector: 'app-myticket',
  templateUrl: './myticket.component.html',
  styleUrls: ['./myticket.component.css']
})
export class MyticketComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger:Subject<any> = new Subject();
  userdata:any = [];
  competitionarray:any = [];
  activeticketfdata = [];
  myaccountdata:any;
  logininfo:any;
  filtertickets:any;
  isloading:boolean = false;
  mySubscription:any;
  emptyactiveticketfdata:boolean =true;
  constructor(private fb:FormBuilder,private location: Location,private router: Router,private ds: DataserviceService,private toastr: ToastrService) { 
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
  this.get_myaccountdata();
  this.getmytickets();
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



  get_myaccountdata(){
    this.ds.getmethod('myaccount',this.logininfo['success']['token']).subscribe(res => {
      if(res['status'] == 'success'){
      this.myaccountdata = res['data'];
      }
    },error => {
     if(error['error']){
      this.toastr.error(error['error'].message, 'Error', {
        progressBar:true
      });
      return;
     }
     
    })
  }

  getmytickets(){
    // this.dtTrigger.next();
    this.activeticketfdata = [];
    this.isloading =true;
    this.emptyactiveticketfdata = false;
  //  let id = data.target.value;
   this.ds.getmethod('myticket',this.logininfo['success']['token']).subscribe(res => {
     console.log(res);
     this.isloading =false;
    if(res['status'] == 'success'){
let filterticket = [];
      let data  = res['data'];
      console.log(this.myaccountdata);
      let competitions;
      data.forEach(t => {
this.activeticketfdata.push({booking_date:t.booking_date,booking_number:t.booking_number,competition:t.competition,
  competition_id:t.competition_id,name:t.name,start_date:t.start_date,status:t.status,tickets:t.tickets});
      })
      this.dtTrigger.next();
      if(this.activeticketfdata.length <= 0){
        this.emptyactiveticketfdata =true;
        this.isloading = false;
      }else{
        this.emptyactiveticketfdata = false;
      }
     
      
      // this.filtertickets = filterticket;
//       data.forEach(t => {
// this.ticketarray.push(t);
//       });
//       let unique = {};
//       let distinct = [];
//       this.ticketarray.forEach((x) => {
//      if (!unique[x.alphabet]) {
//        distinct.push({ 'id': x.id, 'alphabet': x.alphabet });
//        unique[x.alphabet] = true;
//      }
//     });
//     this.alphabeet = distinct;

//     this.ticket_data = res['success']['data']; 
//     }

//     this.ticketarray.forEach((l,i) => {
//        console.log(l);
//         if(l.alphabet == 'A'){
//            this.selectedticketarray.push(l)
//         }
        // })
  }
  });
}

view_tickets(data){
  // this.ds.getdata(data);
console.log(data);
    const navigationExtras = {
      queryParams: {
          id: data.competition_id 
      }
  };
  this.router.navigate(['/view-mytickets'],navigationExtras);
}

ngOnDestroy() {
  if (this.mySubscription) {
    this.mySubscription.unsubscribe();
  }
  // this.dtTrigger.unsubscribe();
}



rerender(): void {
  this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    // Destroy the table first
    dtInstance.destroy();
    // Call the dtTrigger to rerender again
    this.dtTrigger.next();
  });
}


}
