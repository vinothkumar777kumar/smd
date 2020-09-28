import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, FormControl,FormArray,FormGroup,Validator,FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import { error } from 'protractor';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import {BehaviorSubject, of, Subject} from 'rxjs';
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger:Subject<any> = new Subject();
  logininfo:any;
  userdata:any;
  emptyusetrdata:boolean = false;
  isloading:boolean = false;
  userdatadetails = {
    name:null,
    email:null,
    phone:null,
    address_line_one:null,
    town:null,
    postcode:null
  };
  constructor(private fb:FormBuilder,private location: Location,private router: Router,private ds: DataserviceService,private toastr: ToastrService) {
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
    if(!this.logininfo || this.logininfo['success']['role'] != 1){
      this.router.navigateByUrl('/login');
    }
    this.isloading = true;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    }
    this.ds.getmethod('users',this.logininfo['success']['token']).subscribe(res => {
     
      if(res['success']['status'] == 'success'){
        if(res['success']['data'] == ''){
          this.isloading = false;
          this.emptyusetrdata = true;
        }else{
          this.isloading = false;
          this.userdata = res['success']['data'];
          this.dtTrigger.next();
        }
      }
    },error => {

    });
   }

  ngOnInit(): void {
    console.log(this.userdata);
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

  showuserdetails(data){
    // console.log(data);
    // this.userdatadetails.name = data.name;
    this.userdatadetails = data;
jQuery('#userdetailmodel').modal('show');
  }

  edituserdetails(data){
    const navigationExtras = {
      queryParams: {
          id: data.id  
      }
  };
this.router.navigate(['/edit-user'], navigationExtras);
  }

  deleteuserdetails(data){
      this.ds.deletegetmethod('userdelete/'+data.id).subscribe(res => {
        if(res['status'] == "success"){
         Swal.fire({
           title: 'Success',
           text: res['message'],
           icon: 'success',
           confirmButtonText: 'OK',
         }).then((result) => {
           if (result.value) {
            //  this.couponarraydata = [];
            //  this.getcoupondata();
            //  this.router.navigateByUrl('/coupon');
                
        this.router.navigateByUrl('/users', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/users']);
        });
           } else if (result.dismiss === Swal.DismissReason.cancel) {
             this.router.navigateByUrl('/users');
           }
         })
        }
       },error=> {
         console.log(error);
       })
    
    
  }

}
