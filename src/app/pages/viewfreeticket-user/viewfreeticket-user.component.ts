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
  selector: 'app-viewfreeticket-user',
  templateUrl: './viewfreeticket-user.component.html',
  styleUrls: ['./viewfreeticket-user.component.css']
})
export class ViewfreeticketUserComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger:Subject<any> = new Subject();
  freeticketid:any;
  logininfo:any;
  freeticketusers = [];
  emptyfreeticketuser:boolean = false;
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
      this.freeticketid = res.id;
this.getfreeticket_userdata()
    });
  }

  ngOnInit(): void {
  }

  getfreeticket_userdata(){
    this.isloading = true;
    this.ds.getmethod('freedetails/'+this.freeticketid, this.logininfo['success']['token']).subscribe(res => {
      this.isloading = false;
      if(res['success']['status'] == 'success'){
  let data = res['success'].data;
  if(data == ''){
    this.emptyfreeticketuser = true;
  }else{
    data.forEach(u => {
      this.freeticketusers.push({id:u.id,email:u.email,name:u.name,no_of_tickets:u.no_of_tickets,phone:u.phone})
    });
    this.dtTrigger.next();
  }
 
      }
    });
  }

  editfreeticketuser(data){
    const navigationExtras = {
      queryParams: {
          id: data.id,
          competition_id:this.freeticketid
      }
  };
this.router.navigate(['/add-freeticket'], navigationExtras);
  }

  delete_freeticketuser(data){
    this.ds.deleterecord('free/'+data.id).subscribe(res => {
      if(res['success']['status'] == "success"){
       Swal.fire({
         title: 'Success',
         text: res['success']['message'],
         icon: 'success',
         confirmButtonText: 'OK',
       }).then((result) => {
         if (result.value) {
          //  this.freeticketusers = [];
          //  this.getfreeticket_userdata();
           this.router.navigateByUrl('/free-ticket', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/free-ticket']);
           });
          //  this.router.navigateByUrl('/view-freeticket-users');
         } else if (result.dismiss === Swal.DismissReason.cancel) {
           this.router.navigateByUrl('/view-freeticket-users');
         }
       })
      }
     },error=> {
       console.log(error);
     })
  
  }

      
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
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

