import { Component, OnInit } from '@angular/core';
import { FormsModule, FormControl,FormArray,FormGroup,Validator,FormBuilder, Validators } from '@angular/forms';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import { error } from 'protractor';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.css']
})
export class TestimonialsComponent implements OnInit {
  isloading:boolean =false;
blogarraydata = [];
logininfo:any;
blog_image_url:any;
emptytestimonialsdata:boolean = false;
isLoading:boolean = false;
testimonialsarray = [];
testimonialstorearray = [];
testimo_image_url:any;
  constructor(private fb:FormBuilder,private location: Location,private router: Router,private ds: DataserviceService,private toastr: ToastrService) { 
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
    this.testimo_image_url = this.ds.gettestmoamgeurl();
    this.testimonialsdata();
  }

  ngOnInit(): void {
  }

  testimonialsdata(){
    this.isloading = true;
    this.ds.apigetmethod('testimonials').subscribe(res => {
      this.isloading = false;
      if(res['success']['status'] == 'success'){
        let data = res['success']['data'];
        if(data == ''){
          this.emptytestimonialsdata = true;
              this.isloading = false;
        }else{
          let couponarray = [];
          data.forEach((t,i) => {  
          
            this.testimonialstorearray.push({id:t.id,image:this.testimo_image_url+t.image,title:t.title,description:t.description,
              competition:t.competition,name:t.name,status:t.status});
            
          })
          let tma = this.testimonialstorearray.filter(t => t.status == 1);
          tma.forEach((ft,i) => {
  this.testimonialsarray.push({id:ft.id,image:ft.image,title:ft.title,description:ft.description,
    competition:ft.competition,name:ft.name,status:ft.status}); 

          })

          if(this.testimonialsarray.length <= 0){
            this.isloading = false;
            this.emptytestimonialsdata = true;
          }else{
            // this.showtestimonials = true;
          }
        }
        this.ds.scrollToTop(2000);
              }
    },error => {
      // console.log(error);
      this.emptytestimonialsdata = true;
      this.isloading = false;
    })
  }

}
