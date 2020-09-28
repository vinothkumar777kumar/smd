import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import { error } from 'protractor';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import {BehaviorSubject, of, Subject} from 'rxjs';
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-testimonials-list',
  templateUrl: './testimonials-list.component.html',
  styleUrls: ['./testimonials-list.component.css']
})
export class TestimonialsListComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger:Subject<any> = new Subject();
  isloading:boolean =false;
  emptytestimonialsdata:boolean = false;
  testimonialsarray = [];
  logininfo:any;
  testimo_image_url:any;
  constructor(private location: Location,private router: Router,private ds: DataserviceService,private toastr: ToastrService) {
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    }
    this.testimo_image_url = this.ds.gettestmoamgeurl();
    console.log(this.testimo_image_url);
    this.testimonialsdata();
   }

  ngOnInit(): void {
  }

  testimonialsdata(){
    this.isloading = true;
    this.ds.getmethod('testimonial',this.logininfo['success']['token']).subscribe(res => {
      this.isloading = false;
      if(res['success']['status'] == 'success'){
        let data = res['success']['data'];
        if(data == ''){
          this.emptytestimonialsdata = true;
              this.isloading = false;
        }else{
          let couponarray = [];
          data.forEach(t => {     
            this.testimonialsarray.push({id:t.id,image:this.testimo_image_url+t.image,title:t.title,description:t.description,
              competition:t.competition,name:t.name,status:t.status});
          })
          this.dtTrigger.next();
        }
      
              }
    },error => {
      console.log(error);
      this.emptytestimonialsdata = true;
      this.isloading = false;
    })
  }

  
  edit_testimonials(data){
    const navigationExtras = {
      queryParams: {
          id: data.id  
      }
  };
this.router.navigate(['/add-testimonials'], navigationExtras);
  }

  delete_testimonials(data){
    this.ds.deleterecord('testimonial/'+data.id).subscribe(res => {
      if(res['success']['status'] == "success"){
       Swal.fire({
         title: 'Success',
         text: res['success']['message'],
         icon: 'success',
         confirmButtonText: 'OK',
       }).then((result) => {
         if (result.value) {
           this.testimonialsarray = [];
           this.testimonialsdata();
           this.router.navigateByUrl('/testimonials-list');
         } else if (result.dismiss === Swal.DismissReason.cancel) {
           this.router.navigateByUrl('/testimonials-list');
         }
       })
      }
     },error=> {
       console.log(error);
     })
  }
}
