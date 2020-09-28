import { Component, OnInit } from '@angular/core';
import { FormsModule, FormControl,FormArray,FormGroup,Validator,FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import { error } from 'protractor';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  isSubmitted =false;
  forgotpasswordform:FormGroup;
  disableforgotpswd:boolean = false;
  constructor(private fb:FormBuilder,private router: Router,private ds: DataserviceService,private toastr: ToastrService) {
    this.forgotpasswordform = this.fb.group({
      email: new FormControl('',Validators.required)
    })
   }

  ngOnInit(): void {
  }
  get formControls() { return this.forgotpasswordform.controls; }

  fotgotpassword(){
this.isSubmitted = true;
if(this.forgotpasswordform.invalid){
  return;
}else{
  this.disableforgotpswd = true;
  this.ds.postmethod('forgot',this.forgotpasswordform.value).subscribe(res => {
   if(res['message']){
    this.toastr.success(res['message'], 'Success', {
      progressBar:true
    });
   }
  },error => {
    this.disableforgotpswd = false;
    console.log('error',error)
   if(error['status'] == 422){
     if(error['error']['errors']){
      this.toastr.error(error['error']['errors'].email, 'Error', {
        progressBar:true
      });
     }
   }else if(error['status'] == 404){
    if(error['error']){
      this.toastr.error(error['error'].message, 'Error', {
        progressBar:true
      });
     }
   }else if(error['status'] == 0){
    this.toastr.error('net::ERR_INTERNET_DISCONNECTED', 'Error', {
      progressBar:true
    });
    return;
   }
  })
}
  }

}
