import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, FormControl,FormArray,FormGroup,Validator,FormBuilder, Validators } from '@angular/forms';
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
import { truncate } from 'fs';
import { Router } from '@angular/router';
import {BehaviorSubject, of, Subject} from 'rxjs';
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators';
import { DataTableDirective } from 'angular-datatables';
@Component({
  selector: 'app-salediscountlist',
  templateUrl: './salediscountlist.component.html',
  styleUrls: ['./salediscountlist.component.css']
})
export class SalediscountlistComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger:Subject<any> = new Subject();
  salediscountdata = [];
  logininfo:any;
  isloading:boolean = false;
  emptysalediscountdata:boolean =false;
  constructor(private http: HttpClient,private fb:FormBuilder,
    private location: Location,private ds: DataserviceService,
    private toastr: ToastrService,private router:Router) { 
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    }
    this.getsalediscount_data();
  }

  ngOnInit(): void {
  }

  getsalediscount_data(){
    this.isloading = true;
    this.ds.getmethod('discount',this.logininfo['success']['token']).subscribe(res => {
      if(res['success']['status'] == 'success'){
        let data = res['success']['data'];
        if(data == ''){
          this.isloading = false;
          this.emptysalediscountdata = true;
        }else{
          this.isloading = false;
          let unique = {};
        let distinct = [];
          data.forEach(t => {
            if (!unique[t.id]) {
            this.salediscountdata.push({id:t.id,competition:t.competition,description:t.description,
              draw_end_date_time:t.draw_end_date_time,draw_start_date_time:t.draw_start_date_time});
              unique[t.id] = true;
            }
          })
          this.dtTrigger.next();
        }
       
// this.competitionarray =competitionarray;
      }
    },error => {

    });
  }



  delete_salediscount(data){
    this.ds.deleterecord('discount/'+data.id).subscribe(res => {
      if(res['success']['status'] == "success"){
       Swal.fire({
         title: 'Success',
         text: res['success']['message'],
         icon: 'success',
         confirmButtonText: 'OK',
       }).then((result) => {
         if (result.value) {
           this.salediscountdata = [];
           this.getsalediscount_data();
           this.router.navigateByUrl('/sale-discount');
         } else if (result.dismiss === Swal.DismissReason.cancel) {
           this.router.navigateByUrl('/sale-discount');
         }
       })
      }
     },error=> {
       console.log(error);
     })
  
  }

  viewsalediscount(data){
    const navigationExtras = {
      queryParams: {
          id: data.id  
      }
  };
this.router.navigate(['/view-salediscount'], navigationExtras);
  }

}
