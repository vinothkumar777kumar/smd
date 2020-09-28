import { Component, OnInit } from '@angular/core';
import { FormsModule, FormControl,FormArray,FormGroup,Validator,FormBuilder, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import { error } from 'protractor';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-login-with-phone',
  templateUrl: './login-with-phone.component.html',
  styleUrls: ['./login-with-phone.component.css']
})
export class LoginWithPhoneComponent implements OnInit {
  isSubmitted =false;
  verifyphoneform:FormGroup;
  mySubscription: any;
  useremail:any;
  showalert:boolean = false;
  constructor(private active_route:ActivatedRoute,private fb:FormBuilder,private location: Location,private router: Router,private ds: DataserviceService,private toastr: ToastrService) {
    this.useremail = this.ds.getuseremail();
    if(this.useremail == undefined){
      this.router.navigateByUrl('/register');
    }
   
   }

  ngOnInit(): void {
    this.verifyphoneform = this.fb.group({
      otp: new FormControl('',Validators.required)
    })
  
  }

  get formControls() { return this.verifyphoneform.controls; }

  verify(){
    this.isSubmitted = true;
    if(this.verifyphoneform.invalid){
      return;
    }else{
      this.ds.getresetrecord('verifyOtp/'+this.useremail.phone+'/'+this.verifyphoneform.value.otp).subscribe(res => {
        this.showalert = true;
        $('#alerttext').text(res['message']);
        this.toastr.info('We have sent an email to '+this.useremail.email+' with a link for activating your account.', "You've got mail!", {
          progressBar:true
        });  
       

      },error => {
        console.log(error,'verifyerror');
        if(error['status'] == 401){
          this.toastr.error('Something went to wrong.', 'Error', {
            progressBar:true
          });
          return;
        }else if(error['status'] == 0){
          this.toastr.error('net::ERR_INTERNET_DISCONNECTED', 'Error', {
            progressBar:true
          });
          return;
         }
      })
    
  }

}

skip(){
  this.toastr.info('We have sent an email to '+this.useremail.email+' with a link for activating your account.', "You've got mail!", {
    progressBar:true
  });
}

}
