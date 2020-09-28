import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import Swal from 'sweetalert2'
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  isSubmitted = false;
  resetpasswordform:FormGroup;
  constructor(private active_route:ActivatedRoute,private toastr: ToastrService,private fb: FormBuilder,private ds: DataserviceService,private router:Router,private location: Location) { 
    this.resetpasswordform = this.fb.group({
      token:['',Validators.required],
      email:['',Validators.required],
      password:['',Validators.required],
      password_confirmation:['',Validators.required]
    })
    this.active_route.queryParams.subscribe(res => {
      this.ds.getresetrecord('find/'+res['token']).subscribe(res => {
        if(res['message']){
          this.toastr.error(res['message'], 'Error', {
            progressBar:true
          });
          this.router.navigateByUrl('/forgot-password');
        }else{
          this.resetpasswordform.controls['token'].setValue(res['token']);
          this.resetpasswordform.controls['email'].setValue(res['email']);
        }
        
      },error => {
        if(error.status == 404){
          this.toastr.error(error['error'].message, 'Error', {
            progressBar:true
          });
          this.router.navigateByUrl('/forgot-password');
        }
      });
    });
  }

  ngOnInit(): void {
  }

  get formControls() { return this.resetpasswordform.controls; }

  resetpassword(){
    console.log(this.resetpasswordform.value);
    this.isSubmitted = true;
    if(this.resetpasswordform.invalid){
      return;
    }else{
      this.ds.resetpostRecords('reset',this.resetpasswordform).subscribe(res => {
        if(res['success'] == true){
        Swal.fire({
          title:'Success',
          text:res['message'],
          icon: 'success',
          showConfirmButton:true,
          confirmButtonText:'Ok'
        }).then((result) => {
          if (result.value) {
            this.router.navigateByUrl("/login", { skipLocationChange: true }).then(() => {
              console.log([decodeURI(this.location.path())]);
              this.router.navigate([decodeURI(this.location.path())])
              this.router.navigateByUrl('/login');
            });
          }
        })
      }
      },error => {
        if(error.status == 422){
          this.toastr.error(error['error'].message, 'Error', {
            progressBar:true
          });
          this.router.navigateByUrl('/reset-password');
        }
      })
    }
  }

}
