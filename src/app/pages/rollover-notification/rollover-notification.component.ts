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
  selector: 'app-rollover-notification',
  templateUrl: './rollover-notification.component.html',
  styleUrls: ['./rollover-notification.component.css']
})
export class RolloverNotificationComponent implements OnInit {
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
  emptyrolloverdata:boolean =true;
  rolloverarray = [];
  rollovercompetitionlength:number = 0;
  constructor(private fb:FormBuilder,private location: Location,private router: Router,private ds: DataserviceService,private toastr: ToastrService) { 
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
    this.getrolloverdata();
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

  getrolloverdata(){
    this.isloading = true;
    this.emptyrolloverdata = false;
    this.ds.getmethod('rollovernotification',this.logininfo['success']['token']).subscribe(res => {
      console.log(res);
      this.isloading =false;
     if(res['status'] == 'SUCCESS'){
 let filterticket = [];
       let data  = res['data'];
       data.forEach(r => {
 this.rolloverarray.push({competition:r.competition,
   id:r.competition_id,start_date:r.start_date});
       })
       this.dtTrigger.next();
       if(this.rolloverarray.length <= 0){
         this.emptyrolloverdata =true;
         this.isloading = false;
       }else{
         this.emptyrolloverdata = false;
       }
   }
   },error => {
    this.isloading = false;
   });
 }

 rollover(data) {
  console.log(data);
  let selectcompetition_data = data;
  // let end_date = selectcompetition_data.draw_end_date_time;
  // let sdate = end_date.split('-');
  // let sd = sdate[2] + '-' + sdate[1] + '-' + sdate[0];
  // var dates = new Date(sd);
  // console.log(dates.getDate())
  // dates.setDate(dates.getDate() + 6);
  Swal.fire({
    title: 'Info',
    text: "Do you change rollover ?",
    icon: 'info',
    confirmButtonText: 'Go',
    cancelButtonText: 'Drop',
    showCancelButton: true,
  }).then((result) => {
    if (result.value) {
      console.log(selectcompetition_data);
      // let data = {
      //   "competition_id": selectcompetition_data.id,
      //   "rollover_start_date": moment(selectcompetition_data.draw_end_date_time).format('YYYY-DD-MM'),
      //   "rollover_end_date": moment(dates).format('YYYY-MM-DD'),
      // };
      this.ds.postRecords('rollover/' + selectcompetition_data.id, this.logininfo['success']['token']).subscribe(res => {
        if (res['success'].status == 'success') {
          Swal.fire({
            title: 'Success',
            text: res['success'].message,
            icon: 'success',
            confirmButtonText: 'OK',
          }).then((result) => {
            if (result.value) {
              this.router.navigateByUrl('/rollover-competition', { skipLocationChange: true }).then(() => {
                this.router.navigate(['/rollover-competition']);
              });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              // this.router.navigateByUrl('/register');
            }
          })
        }
      }, error => {
        console.log(error);
      })
    } else if (result.dismiss === Swal.DismissReason.cancel) {

    }
  })
}

}
