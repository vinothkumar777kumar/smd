import { Component, OnInit } from '@angular/core';
import { FormsModule, FormControl,FormArray,FormGroup,Validator,FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import { error } from 'protractor';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {
  isSubmitted =false;
  myaccountform: FormGroup;
  logininfo:any;
  file :any = [];
  constructor(private fb:FormBuilder,private router: Router,private ds: DataserviceService,private toastr: ToastrService) {
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
    if(!this.logininfo){
      this.router.navigateByUrl('/login')
    }
    this.ds.getmethod('myaccount',this.logininfo['success']['token']).subscribe(res => {
      if(res['status'] == 'success'){
        this.myaccountform.controls['id'].setValue(res['data'].id);
        this.myaccountform.controls['email'].setValue(res['data'].email);
        this.myaccountform.controls['name'].setValue(res['data'].name)
        this.myaccountform.controls['phone'].setValue(res['data'].phone)
        this.myaccountform.controls['address_line_one'].setValue(res['data'].address_line_one)
        this.myaccountform.controls['address_line_two'].setValue(res['data'].address_line_two)
        this.myaccountform.controls['town'].setValue(res['data'].town)
        this.myaccountform.controls['postcode'].setValue(res['data'].postcode);
        this.myaccountform.controls['user_type'].setValue(res['data'].user_type)
        this.myaccountform.controls['status'].setValue(res['data'].status)
        this.myaccountform.controls['email_verified_at'].setValue(res['data'].email_verified_at)
        this.myaccountform.controls['created_at'].setValue(res['data'].created_at)
        this.myaccountform.controls['updated_at'].setValue(res['data'].updated_at)
      // this.myaccountform.setValue(res['data']);
      }
    },error => {
     if(error['error']){
      this.toastr.error(error['error'].message, 'Error', {
        progressBar:true
      });
      return;
     }
     
    })
    this.myaccountform = this.fb.group({
      id: new FormControl(),
      // profile_image: new FormControl(),
      email: new FormControl('',Validators.required),
      name: new FormControl('',Validators.required),
      phone: new FormControl('',Validators.required),
      address_line_one: new FormControl('',Validators.required),
      address_line_two: new FormControl(''),
      town: new FormControl('',Validators.required),
      postcode: new FormControl('',Validators.required),
      user_type: new FormControl(),
      status: new FormControl(),
      email_verified_at:new FormControl(),
      created_at: new FormControl(),
      updated_at: new FormControl()
    })
   }

  ngOnInit(): void {
  }

  get formControls() { return this.myaccountform.controls; }

  updateaccount(){
    this.isSubmitted = true;
    if(this.myaccountform.invalid){
      return;
    }else{
      let file = '' , filename = '';
      file = this.file
        filename = this.file.name;

  // console.log(this.file);
      const myFormData = new FormData();
      myFormData.append('id', this.myaccountform.value.id);
      myFormData.append('email',  this.myaccountform.value.email);
      myFormData.append('name',  this.myaccountform.value.name);
      myFormData.append('phone',  this.myaccountform.value.phone);
      myFormData.append('postcode',  this.myaccountform.value.postcode);
      myFormData.append('address_line_one',  this.myaccountform.value.address_line_one);
      myFormData.append('address_line_two',  this.myaccountform.value.address_line_two);
      myFormData.append('town',  this.myaccountform.value.town);
      myFormData.append('user_type',  this.myaccountform.value.user_type);
      myFormData.append('status',  this.myaccountform.value.status);
      myFormData.append('email_verified_at',  this.myaccountform.value.email_verified_at);
      myFormData.append('created_at',  this.myaccountform.value.created_at);
      myFormData.append('updated_at',  this.myaccountform.value.updateaccount);
      this.ds.postRecords('myaccount',myFormData,true).subscribe(res => {
        if(res['success'] == true){
          Swal.fire({
            title: 'Updated',
            text: res['message'],
            icon: 'success',
            confirmButtonText: 'OK',
          }).then((result) => {
            if (result.value) {
              this.router.navigateByUrl('/my-account');
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              // this.router.navigateByUrl('/register');
            }
          })
        }
      },error => {
        if(error['status'] == 401){
          if(error['error']){
            this.toastr.error(error['error'].message, 'Error', {
              progressBar:true
            });
            return;
          }
        }
        console.log(error);
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

  fileProgress(fileInput: any) {
    console.log(fileInput)
    let fileData = fileInput.target.files[0];
    this.file=fileData;
    // let arr = fileData.split('/'); 
    console.log(this.file);
  }


}
