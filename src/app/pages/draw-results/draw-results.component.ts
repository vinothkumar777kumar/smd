import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import { error } from 'protractor';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import Swal from 'sweetalert2'
import * as $ from 'jquery';
import * as moment from 'moment';
import {IAngularMyDpOptions, IMyDateModel, IMyCalendarViewChanged, IMyRangeDateSelection, AngularMyDatePickerDirective} from 'angular-mydatepicker';
import {BehaviorSubject, of, Subject} from 'rxjs';
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-draw-results',
  templateUrl: './draw-results.component.html',
  styleUrls: ['./draw-results.component.css']
})
export class DrawResultsComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger:Subject<any> = new Subject();
  drawresultarray = [];
  logininfo:any;
  emptydrawresult:boolean = false;
  isloading:boolean = false;
  constructor(private location: Location,private router: Router,private ds: DataserviceService,private toastr: ToastrService) { 
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    }
    this.getdrawresult_data();
  }

  ngOnInit(): void {
  }

  getdrawresult_data(){
    this.isloading = true;
    this.ds.getmethod('result',this.logininfo['success']['token']).subscribe(res => {
      this.isloading = false;
      if(res['success']['status'] == 'success'){
        let data = res['success']['data'];
        if(data == ''){
          this.emptydrawresult = true;
        }else{
          data.forEach(d => {
            this.drawresultarray.push({id:d.id,competition:d.competition,result_date:d.result_date,result_time:d.result_time});
            
          })
          this.dtTrigger.next();
        }
        
// this.competitionarray =competitionarray;
      }
    },error => {

    });
  }

  editdraw_result(data){
    const navigationExtras = {
      queryParams: {
          id: data.id  
      }
  };
this.router.navigate(['/draw-announce'], navigationExtras);
  }

  delete_drawresult(data){
    this.ds.deleterecord('result/'+data.id).subscribe(res => {
      if(res['success']['status'] == "success"){
       Swal.fire({
         title: 'Success',
         text: res['success']['message'],
         icon: 'success',
         confirmButtonText: 'OK',
       }).then((result) => {
         if (result.value) {
           this.drawresultarray = [];
           this.getdrawresult_data();
           this.router.navigateByUrl('/draw-results');
         } else if (result.dismiss === Swal.DismissReason.cancel) {
           this.router.navigateByUrl('/draw-results');
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
