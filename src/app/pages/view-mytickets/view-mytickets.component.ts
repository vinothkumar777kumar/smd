import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, FormControl,FormArray,FormGroup,Validator,FormBuilder, Validators } from '@angular/forms';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
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
  selector: 'app-view-mytickets',
  templateUrl: './view-mytickets.component.html',
  styleUrls: ['./view-mytickets.component.css']
})
export class ViewMyticketsComponent implements OnInit {
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
  ticketsdata:any;
  ticketfdata = [];
  competition_id:any;
  constructor(private fb:FormBuilder,private location: Location,private router: Router,
    private ds: DataserviceService,private toastr: ToastrService,private Activate:ActivatedRoute) {
      this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    }


    this.Activate.queryParams.subscribe(res => {
      this.competition_id = res.id;
      console.log(this.competition_id);
this.myticketdata()
    });
   
   }

  ngOnInit(): void {
   
  }

  myticketdata(){
    this.isloading = true;
    this.emptyactiveticketfdata = false;
    this.ds.getmethod('viewmytickets/'+this.competition_id, this.logininfo['success']['token']).subscribe(res => {
      this.isloading = false;
      if(res['status'] == 'success'){
  let data = res['data'];
  if(data == ''){
    this.emptyactiveticketfdata = true;
  }else{
    data.forEach(m => {
      this.ticketfdata.push({id:m.id,booking_date:m.booking_date,booking_number:m.booking_number})
    });
    this.dtTrigger.next();
    if(this.ticketfdata.length <= 0){
      this.emptyactiveticketfdata = true;
    }
  }
 
      }
    });
  }
  

  
ngOnDestroy() {

  if (this.mySubscription) {
    this.mySubscription.unsubscribe();
    this.dtTrigger.unsubscribe();
  }
 
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
