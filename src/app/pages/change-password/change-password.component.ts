import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import Swal from 'sweetalert2'
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import { error } from '@angular/compiler/src/util';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  isSubmitted = false;
  changepasswordform:FormGroup;
  constructor(private toastr: ToastrService,private fb: FormBuilder,private ds: DataserviceService,private router:Router) {
    this.changepasswordform = this.fb.group({
      current:['',Validators.required],
      password:['',[Validators.required,,Validators.pattern(/^(?=.*[A-Z])(?=.*[!@#\$%\^&\*])(?=.{9,})/)]],
      password_confirmation:['',Validators.required]
    });
   }

  ngOnInit(): void {
  }

  get formControls() { return this.changepasswordform.controls; }
  updatepassword(){
this.isSubmitted = true;
if(this.changepasswordform.invalid){
  return;
}else{
  this.ds.postRecords('password',this.changepasswordform.value).subscribe(res => {
   if(res['validation errors']){
     if(res['validation errors']['password']){
      this.toastr.error(res['validation errors']['password'], 'Error', {
        progressBar:true
      });
      return;
     }
   }else if(res['success'] == true){
    Swal.fire({
      title: 'Success',
      text: res['message'],
      icon: 'success',
      confirmButtonText: 'OK',
    }).then((result) => {
      if (result.value) {
        this.router.navigateByUrl('/Home');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // this.router.navigateByUrl('/register');
      }
    })
   }
  },error => {
   if(error['status'] == 422){
     if(error['error']['errors']){
      this.toastr.error(error['error']['errors']['current password'], 'Error', {
        progressBar:true
      });
      return;
     }
   }
  })
}
  }

}
