import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import * as bootstrap from "bootstrap";
import Swal from 'sweetalert2'
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import { error } from '@angular/compiler/src/util';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  isSubmitted = false;
  isLoading:boolean = false;
  registrationform: FormGroup;
  timeLeft: number = 30;
  interval;
  public btndisabled : boolean;
  public timerhidden : boolean;
  public mismatch : boolean;
  
  public otptext : string;
  public verification_code: string;
  public onetimepopup : number;
  public currentotp : string;
  disableregister:boolean = false;
  constructor(private toastr: ToastrService,private fb: FormBuilder,private ds: DataserviceService,private router:Router) { 
    
    // this.toastr.error('Hello world!', 'Toastr fun!',{
    //   progressBar:true
    // });
  }

  ngOnInit(): void {
    this.btndisabled =true;
    this.timerhidden = false;
    this.onetimepopup = 0;
    this.otptext='';
    this.verification_code ='';
    this.currentotp = '';
    this.mismatch=false;
    this.registrationform = this.fb.group({
      name:['',Validators.required],
      email:['',Validators.required],
      password:['',[Validators.required,,Validators.pattern(/^(?=.*[A-Z])(?=.*[!@#\$%\^&\*])(?=.{9,})/)]],
      phone:['',Validators.required],
      verification_code:['']
    });
  }

  get formControls() { return this.registrationform.controls; }

  fn_resendotp(){
    this.timerhidden=false;
    this.startTimer(); 
  }
  

  startTimer() {
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
      }       
      if(this.timeLeft==0){
         
        this.btndisabled=false;
        this.pauseTimer();
        this.timerhidden=true;
        
      }
    },1000)
    
  }

  pauseTimer() {
    clearInterval(this.interval);
    this.timeLeft=30;
  }

  sentotp(event:any){
    let pno = event.target.value;
    
    if(pno!='' && pno.length >9 && this.onetimepopup==0 ){
      Swal.fire({
        title: 'Phone Number Verifcation',
        text: 'Do you want to verify the Phone Number!',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Yes, right now',
        cancelButtonText: 'No, do it later'
      }).then((result) => {
        if (result.value) {
  
          this.ds.getresetrecord('sendOtp/'+pno).subscribe(res => {
            
            if(res['validation errors']){
              if(res['validation errors']['email']){
                  this.toastr.error(res['validation errors']['email'], 'Error', {
          progressBar:true
        });
      }else if(res['validation errors']['password']){
              this.toastr.error(res['validation errors']['password'], 'Error', {
                progressBar:true
              });
            }else if(res['validation errors']['phone']){
              this.toastr.error(res['validation errors']['phone'], 'Error', {
                progressBar:true
              });
            }
            }else{
              if(res['status'] == 'success'){

                  jQuery.noConflict();
                  this.startTimer();
                  jQuery('#otpmodel').modal('show');                  
                  this.currentotp = res['data']; 
                 //this.currentotp = '1234'; 

              } else{
                this.toastr.error("Oops Something Wrong", 'Error', {
                  progressBar:true
                });
              }
            }
            

          });
          
         

         
      
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          
        }
      });
      this.onetimepopup=1;
     
    }
   
  }

  fn_verifiy_otp(){ 

    if(this.currentotp==this.otptext){
       
      this.btndisabled=false;
      this.pauseTimer();
      this.timerhidden=true;
      jQuery.noConflict();
      jQuery('#otpmodel').modal('toggle');

      Swal.fire({
        title: 'Success',
        text: 'Verified Successfully.',
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      });

      this.verification_code=this.otptext;

    } else{

      this.mismatch=true;
      this.btndisabled=true;
      this.otptext = "";

    }
    

  }



  register(){
    
    this.isSubmitted = true;
    if(this.registrationform.invalid){
      return;
    }else{
      this.isLoading= true;
      this.disableregister = true;
      this.ds.postmethod('register',this.registrationform.value).subscribe(res => {
        this.isLoading= false;
        if(res['validation errors']){
          this.disableregister = false;
          if(res['validation errors']['email']){
              this.toastr.error(res['validation errors']['email'], 'Error', {
      progressBar:true
    });
  }else if(res['validation errors']['password']){
          this.toastr.error(res['validation errors']['password'], 'Error', {
            progressBar:true
          });
        }else if(res['validation errors']['phone']){
          this.toastr.error(res['validation errors']['phone'], 'Error', {
            progressBar:true
          });
        }
        }else{
          if(res['status'] == 'success'){
            this.toastr.info('We have sent an email to '+this.registrationform.value.email+' with a link for activating your account.', "You've got mail!", {
              progressBar:true
            }); 
            let user_data = {
              email: this.registrationform.value.email,
              phone: this.registrationform.value.phone
            }
            this.ds.storeuseremail(user_data);
            //this.router.navigateByUrl('/verify-phone-number');
            Swal.fire({
              title: 'Success',
              text: 'Register Successfully.',
              icon: 'success',
              showCancelButton: true,
              confirmButtonText: 'Login',
            }).then((result) => {
              if (result.value) {
                let user_data = {
                  email: this.registrationform.value.email,
                  phone: this.registrationform.value.phone
                }
                this.ds.storeuseremail(user_data);
                this.router.navigateByUrl('/home');
              } else if (result.dismiss === Swal.DismissReason.cancel) {
                this.router.navigateByUrl('/register');
              }
            })
            
          }
        }
      },error => {
        this.isLoading= false;
       if(error['status'] == 0){
        this.disableregister = false;
        this.toastr.error('net::ERR_INTERNET_DISCONNECTED', 'Error', {
          progressBar:true
        });
        return;
       }else if(error['validation errors']){
        this.disableregister = false;
         console.log(error['validation errors'].email);
       }
      })
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

}
