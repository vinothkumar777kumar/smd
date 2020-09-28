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
import {BehaviorSubject, of, Subject} from 'rxjs';
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-viewsalediscount',
  templateUrl: './viewsalediscount.component.html',
  styleUrls: ['./viewsalediscount.component.css']
})
export class ViewsalediscountComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger:Subject<any> = new Subject();
  competition_id:any;
  logininfo:any;
  salediscountdata = [];
  emptyviewsalediscountdata:boolean = false;
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
      this.competition_id = res.id;
this.getsalediscount_data();
    });
   }

  ngOnInit(): void {
  }

  getsalediscount_data(){
    this.isloading = true;
    console.log(this.competition_id,'aftegetcompety');
    this.ds.getmethod('saledetails/'+this.competition_id, this.logininfo['success']['token']).subscribe(res => {
      this.isloading = false;
      if(res['success']['status'] == 'success'){
        let data = res['success'].data;
        if(data == ''){
          this.emptyviewsalediscountdata = true;
        }else{
          data.forEach(s => {
            let disc_type = '';
            if(s.discount == 1){
disc_type = 'Amount';
            }else{
              disc_type = 'Percentage';
            }
            this.salediscountdata.push({id:s.id,sale_date:s.sale_date,value:s.value,discount_type:disc_type,competition:s.competition})
          });
          this.dtTrigger.next();
        }
      }
    });
  }

  editsalediscount(data){
    const navigationExtras = {
      queryParams: {
          id: data.id,
          competition_id:this.competition_id  
      }
  };
  this.router.navigate(['/sale-discount'], navigationExtras);
// this.router.navigate(['/editsale-discount'], navigationExtras);
  }

  
  deletesale_discount(data){
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
           const navigationExtras = {
            queryParams: {
                id: this.competition_id 
            }
        };
      this.router.navigate(['/view-salediscount'], navigationExtras);
         } else if (result.dismiss === Swal.DismissReason.cancel) {
           this.router.navigateByUrl('/view-salediscount');
         }
       })
      }
     },error=> {
       console.log(error);
     })
  
  }

  gettoprevies(){
    const navigationExtras = {
      queryParams: {
          id: this.competition_id 
      }
  };
this.router.navigate(['/sale-discount-list'], navigationExtras);
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
