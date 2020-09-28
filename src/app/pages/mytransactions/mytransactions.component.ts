import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, FormControl,FormArray,FormGroup,Validator,FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import { error } from 'protractor';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import {BehaviorSubject, of, Subject} from 'rxjs';
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-mytransactions',
  templateUrl: './mytransactions.component.html',
  styleUrls: ['./mytransactions.component.css']
})
export class MytransactionsComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger:Subject<any> = new Subject();
  isloading:boolean = false;
  emptytransactionarray:boolean = false;
  logininfo:any;
  transactionarray = [];
  constructor(private fb:FormBuilder,private location: Location,private router: Router,private ds: DataserviceService,private toastr: ToastrService) { 
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
   
    this.gettransaction_data();
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    }
  }

  gettransaction_data(){
    this.isloading =true;
    this.emptytransactionarray = false;
    this.ds.getmethod('transaction',this.logininfo['success']['token']).subscribe(res => {
      this.isloading = false;
      if(res['success']['status'] == 'success'){
        let data = res['success']['data'];
        let couponarray = [];
        data.forEach(t => {     
          this.transactionarray.push({id:t.id,name:t.name,competition:t.competition,booking_date:t.booking_date,
              
              sale_price:t.sale_price,total_price:t.total_price,no_of_tickets:t.no_of_tickets});
        })
        this.dtTrigger.next();
        if(this.transactionarray.length <= 0){
          this.emptytransactionarray =true;
        }
        console.log(this.transactionarray);
        // this.couponarraydata = couponarray;
              }
    },error => {
      this.isloading = false;
      this.emptytransactionarray = true;
      console.log(error);
    })
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  viewtickets_data(data){
    // this.ds.getdata(data);
  console.log(data);
      const navigationExtras = {
        queryParams: {
            id: data.id 
        }
    };
    this.router.navigate(['/view-mytransaction'],navigationExtras);
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
