import { Component, OnInit } from '@angular/core';
import { FormsModule, FormControl,FormArray,FormGroup,Validator,FormBuilder, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import { error } from 'protractor';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider,SocialUser } from "angularx-social-login";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoading:boolean = false;
  isSubmitted =false;
  loginform:FormGroup;
  mySubscription: any;
  account_activate_token:any;
  public sociallogindetails = <any> {};
  fbuser: SocialUser;
  disablelogin:boolean = false;
  disableloginfacebook:boolean= false;
  constructor(private authService: SocialAuthService,private active_route:ActivatedRoute,private fb:FormBuilder,private location: Location,private router: Router,private ds: DataserviceService,private toastr: ToastrService) {
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
    this.account_activate_token = res.token;
    })
    setTimeout(() => {
      if(this.account_activate_token != undefined){
        this.ds.getresetrecord('register/activate/'+this.account_activate_token).subscribe(res => {
          
          if(res['success'] == true){
            this.toastr.success(res['message'], 'Success', {
              progressBar:true
            });
            this.router.navigateByUrl('/login');
          }else{
            this.toastr.error(res['message'], 'Error', {
              progressBar:true
            });
            this.router.navigateByUrl('/login');
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
    this.authService.authState.subscribe((user) => {
      this.fbuser = user;
      //this.loggedIn = (user != null);
      console.log(this.fbuser);
      if(user != null){
        this.sociallogindetails['name']=this.fbuser.name;
        this.sociallogindetails['email']=this.fbuser.email;
        this.sociallogindetails['image']=this.fbuser.photoUrl;
        this.sociallogindetails['provider_id']=this.fbuser.id;
        this.sociallogindetails['provider']=this.fbuser.provider;
        
       // console.log(this.sociallogindetails);

        this.ds.postmethod('socialLogin',this.sociallogindetails).subscribe(token => {

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
                    //this.router.navigate(['/dashboard']);
                    this.router.navigateByUrl('/dashboard', { skipLocationChange: true }).then(() => {
                      this.router.navigate(['/home']);
                  }); 
                    
                }
               else{
                    this.toastr.success(token['success'].message, 'Success', {
                      progressBar:true
                    });
                 
                      this.ds.seesionuser_info(token);
                     // this.router.navigate(['/home']);
                      this.router.navigateByUrl('/login', { skipLocationChange: true }).then(() => {
                        this.router.navigate(['/home']);
                    }); 
                   
                  }
                
            
             
             
            }
          }
        });
      }
    });
  }

  get formControls() { return this.loginform.controls; }

  login(){
    
    this.isSubmitted = true;
    if(this.loginform.invalid){
      return;
    }else{
      this.isLoading = true;
      this.disablelogin = true;
      this.ds.postmethod('login',this.loginform.value).subscribe(token => {
        this.isLoading = false;
        if(token['success'] == false){
          this.disablelogin = false;
          this.toastr.error(token['message'], 'Error', {
            progressBar:true
          });
          return;
        }else{
          if(token['success'].success == true){
          
              if(token['success']['role'] == '1'){
                this.toastr.success('You have Logged in Successfully', 'Success', {
                  progressBar:true
                });
      
                  this.ds.seesionuser_info(token);
                  this.ds.getdata([]);
                  this.router.navigate(['/dashboard']);
              }
             else{
                  this.toastr.success('You have Logged in Successfully', 'Success', {
                    progressBar:true
                  });
               
                    this.ds.seesionuser_info(token);
                    this.ds.getdata([]);
                    this.router.navigate(['/home']);
                 
                }
              
          
           
           
          }
        }

      },error => {
        this.isLoading = false;
        this.disablelogin = false;
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

signInWithFB(): void {
  this.disableloginfacebook = true;
  this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
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
