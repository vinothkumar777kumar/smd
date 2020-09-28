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
import * as moment from 'moment'; 

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.css']
})
export class CouponComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger:Subject<any> = new Subject();
  logininfo:any;
coupon:any;
coupondata:any;
couponarraydata:any;
emptycoupondata:boolean = false;
isloading:boolean = false;
  constructor(private fb:FormBuilder,private location: Location,private router: Router,private ds: DataserviceService,private toastr: ToastrService) {
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    }
  this.getcoupondata();
   }

  ngOnInit(): void {
  }

  getcoupondata(){
    this.isloading = true;
    this.ds.getmethod('coupon',this.logininfo['success']['token']).subscribe(res => {
      this.isloading = false;
      if(res['success']['status'] == 'success'){
        let data = res['success']['data'];
        if(data == ''){
          this.emptycoupondata = true;
        }else{
          let couponarray = [];
          data.forEach(e => {     
            let cd = moment().format('YYYY-MM-DD');
          let sd = moment(e.valid_from,'DD-MM-YYYY').format('YYYY-MM-DD'); 
          // if(moment(sd).isSameOrAfter(cd) == true){
            couponarray.push({id:e.id,coupon:e.coupon,code:e.code,valid_from:e.valid_from,
                valid_to:e.valid_to,coupon_type:e.coupon_type,
                coupon_value:e.coupon_value,min_cart_amount:e.min_cart_amount,max_redeem_amount:e.max_redeem_amount,
                is_active:e.is_active});
            // }
          })
          
          this.couponarraydata = couponarray;
          this.dtTrigger.next();
        }
      
              }
    },error => {
      console.log(error);
    })
  }

  



  edit_coupon(data){
    const navigationExtras = {
      queryParams: {
          id: data.id  
      }
  };
this.router.navigate(['/add-coupon'], navigationExtras);

  }

  relaunch(data){
    const navigationExtras = {
      queryParams: {
          id: data.id  
      }
  };
this.router.navigate(['/relaunch-coupon'], navigationExtras);
  }

  delete_coupon(data){
    this.ds.deleterecord('coupon/'+data.id).subscribe(res => {
      if(res['success']['status'] == "success"){
       Swal.fire({
         title: 'Success',
         text: res['success']['message'],
         icon: 'success',
         confirmButtonText: 'OK',
       }).then((result) => {
         if (result.value) {
          //  this.couponarraydata = [];
          //  this.getcoupondata();
          //  this.router.navigateByUrl('/coupon');
              
      this.router.navigateByUrl('/coupon', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/coupon']);
      });
         } else if (result.dismiss === Swal.DismissReason.cancel) {
           this.router.navigateByUrl('/coupon');
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
