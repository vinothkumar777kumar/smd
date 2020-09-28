import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, FormControl,FormArray,FormGroup,Validator,FormBuilder, Validators } from '@angular/forms';
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
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger:Subject<any> = new Subject();
  isloading:boolean =false;
  emptyblogdata:boolean = false;
  blogarraydata = [];
  logininfo:any;
  blog_image_url:any;
  constructor(private fb:FormBuilder,private location: Location,private router: Router,private ds: DataserviceService,private toastr: ToastrService) {
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    }
    this.blog_image_url = this.ds.getblogamgeurl();
    this.blogdata();
   }

  ngOnInit(): void {
  }

  blogdata(){
    this.isloading = true;
    this.ds.getmethod('blog',this.logininfo['success']['token']).subscribe(res => {
      this.isloading = false;
      if(res['success']['status'] == 'success'){
        let data = res['success']['data'];
        if(data == ''){
          this.emptyblogdata = true;
        }else{
          let couponarray = [];
          data.forEach(b => {     
            this.blogarraydata.push({id:b.id,image:this.blog_image_url+b.image,title:b.title,description:b.description,
                published_at:b.published_at});
          })
          this.dtTrigger.next();
        }
      
              }
    },error => {
      console.log(error);
    })
  }

  edit_blog(data){
    const navigationExtras = {
      queryParams: {
          id: data.id  
      }
  };
this.router.navigate(['/add-blog'], navigationExtras);
  }

  view_blog(bd){
    this.ds.blogdatastore(bd);
    this.router.navigate(['/blog-view']);
  }

  delete_blog(data){
    this.ds.deleterecord('blog/'+data.id).subscribe(res => {
      if(res['success']['status'] == "success"){
       Swal.fire({
         title: 'Success',
         text: res['success']['message'],
         icon: 'success',
         confirmButtonText: 'OK',
       }).then((result) => {
         if (result.value) {
           this.blogarraydata = [];
           this.blogdata();
           this.router.navigateByUrl('/blog-list');
         } else if (result.dismiss === Swal.DismissReason.cancel) {
           this.router.navigateByUrl('/blog-list');
         }
       })
      }
     },error=> {
       console.log(error);
     })
  }

}
