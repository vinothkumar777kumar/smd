import { Component, OnInit } from '@angular/core';
import { FormsModule, FormControl,FormArray,FormGroup,Validator,FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import Swal from 'sweetalert2';
import { error } from 'protractor';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  isSubmitted:Boolean = false;
  edituserform:FormGroup;
  userid:any;
  logininfo:any;
  isLoading:boolean = false;
  constructor(private Activate: ActivatedRoute,private fb:FormBuilder,private location: Location,private router: Router,private ds: DataserviceService,private toastr: ToastrService) {
    
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
    this.Activate.queryParams.subscribe(res => {
      this.userid = res.id;
    this.ds.getmethod('useredit?userid='+res.id, this.logininfo['success']['token']).subscribe(res => {
      if(res['status'] == 'success'){
        let data = res['userDetails'];
       
        this.edituserform.controls['id'].setValue(data.id);
        this.edituserform.controls['name'].setValue(data.name);
        this.edituserform.controls['email'].setValue(data.email);
        this.edituserform.controls['address_line_one'].setValue(data.address_line_one);
        this.edituserform.controls['postcode'].setValue(data.postcode);
        this.edituserform.controls['phone'].setValue(data.phone);
        this.edituserform.controls['town'].setValue(data.town);
        this.edituserform.controls['status'].setValue(data.active);
        
         
    

      }
    });
    });
   }

  ngOnInit(): void {
    this.edituserform = this.fb.group({
      id:[''],
      name: ['',Validators.required],
      email: ['',Validators.required],
      address_line_one: ['',Validators.required],
      postcode: ['',Validators.required],
      phone: ['',Validators.required],
      town: ['',Validators.required],
      status: ['',Validators.required],
    })
  }
  get formControls() { return this.edituserform.controls; }

  updateusert(){
this.isSubmitted =true;
if(this.edituserform.invalid){
  return;
}else{
  this.isLoading = true;
  this.ds.postRecords('myaccount',this.edituserform.value).subscribe(res => {
    this.isLoading = false;
        if(res['success'] == true){
          Swal.fire({
            title: 'Success',
            text: res['message'],
            icon: 'success',
            confirmButtonText: 'OK',
          }).then((result) => {
            if (result.value) {
              this.router.navigateByUrl('/users');
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              // this.router.navigateByUrl('/register');
            }
          })
        }
      },error => {
        console.log(error);
        this.isLoading = false;
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
