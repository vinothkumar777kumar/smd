import { Component, OnInit } from '@angular/core';
import { FormsModule, FormControl,FormArray,FormGroup,Validator,FormBuilder, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import { error } from 'protractor';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { resolve } from 'dns';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit {

  isSubmitted =false;
  loginform:FormGroup;
  mySubscription: any;
  account_activate_token:any;
  constructor(private active_route:ActivatedRoute,private fb:FormBuilder,private location: Location,private router: Router,private ds: DataserviceService,private toastr: ToastrService) { 
    this.loginform = this.fb.group({
      email: new FormControl('',Validators.required),
      password: new FormControl('',Validators.required)
    })

    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    
    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
      }
    });
    this.active_route.queryParams.subscribe(res => {
    this.account_activate_token = res.code;
    })
    setTimeout(() => {
      if(this.account_activate_token != undefined){
        this.ds.getresetrecord('login/facebook/callback'+this.account_activate_token).subscribe(res => {
          if(res['status'] == "success"){
            this.ds.seesionuser_info(res);
          let data = res['data'];
            if(data.user_type == 2){
              this.toastr.success(res['status'], 'Success', {
                progressBar:true
              });
    
              this.router.navigateByUrl('/my-account');
            }else if(data.user_type == 1){
              this.toastr.success(res['status'], 'Success', {
                progressBar:true
              });
                this.router.navigate(['/dashboard']);
            }
            
          }else if(res['success'].success == true){
            this.ds.seesionuser_info(res);
            if(res['success']['role'] == '1'){
              this.toastr.success(res['success'].message, 'Success', {
                progressBar:true
              });
    
                this.router.navigate(['/dashboard']);
            }
           else if(res['success']['role'] == '2'){
                this.toastr.success(res['success'].message, 'Success', {
                  progressBar:true
                });
                  this.router.navigate(['/my-account']);
               
              }
          }
          
        },error => {
          if(error.status == 404){
            this.toastr.error(error['error'].message, 'Error', {
              progressBar:true
            });
            this.router.navigateByUrl('/login');
          }
        });
      }
    },0)
  }

  ngOnInit(): void {
  }

  get formControls() { return this.loginform.controls; }

  login(){
    this.isSubmitted = true;
    if(this.loginform.invalid){
      return;
    }else{
      this.ds.postmethod('login',this.loginform.value).subscribe(token => {
        if(token['success'] == false){
          this.toastr.error(token['message'], 'Error', {
            progressBar:true
          });
          return;
        }else{
          if(token['success'].success == true){
          
              if(token['success']['role'] == '1'){
                this.toastr.success(token['success'].message, 'Success', {
                  progressBar:true
                });
      
                  this.ds.seesionuser_info(token);
                  this.router.navigate(['/dashboard']);
              }
             else{
                  this.toastr.success(token['success'].message, 'Success', {
                    progressBar:true
                  });
               
                    this.ds.seesionuser_info(token);
                    this.router.navigate(['/home']);
                 
                }
              
          
           
           
          }
        }

      },error => {
        console.log(error,'loginerror');
        if(error['status'] == 401){
          this.toastr.error('Invalid email and password.', 'Error', {
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

loginwithfacebook(){
  this.ds.getresetrecord('login/facebook').subscribe(token => {
    if(token['success'] == false){
      this.toastr.error(token['message'], 'Error', {
        progressBar:true
      });
      return;
    }else{
      if(token['success'].success == true){
      
          if(token['success']['role'] == '1'){
            this.toastr.success(token['success'].message, 'Success', {
              progressBar:true
            });
  
              this.ds.seesionuser_info(token);
              this.router.navigate(['/dashboard']);
          }
         else{
              this.toastr.success(token['success'].message, 'Success', {
                progressBar:true
              });
           
                this.ds.seesionuser_info(token);
                this.router.navigate(['/home']);
             
            }
          
      
       
       
      }
    }

  },error => {
    console.log(error,'loginerror');
    if(error['status'] == 401){
      this.toastr.error('Invalid email and password.', 'Error', {
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




ngOnDestroy() {
  if (this.mySubscription) {
    this.mySubscription.unsubscribe();
  }
}

}
