import { Component, OnInit } from '@angular/core';
import { FormsModule, FormControl,FormArray,FormGroup,Validator,FormBuilder, Validators } from '@angular/forms';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import { error } from 'protractor';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  isloading:boolean =false;
blogarraydata = [];
logininfo:any;
blog_image_url:any;
emptyblogdata:boolean = false;
isLoading:boolean = false;
  constructor(private fb:FormBuilder,private location: Location,private router: Router,private ds: DataserviceService,private toastr: ToastrService) {
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
    this.blog_image_url = this.ds.getblogamgeurl();
    this.blogdata();
   
   }

  ngOnInit(): void {
  }

  blogdata(){
    this.isLoading = true;
    this.ds.apigetmethod('blogs').subscribe(res => {
      this.isLoading = false;
      if(res['success']['status'] == 'success'){
        let data = res['success']['data'];
        if(data == ''){
          alert('test');
          this.emptyblogdata = true;
        }else{
          let couponarray = [];
          data.forEach(b => {     
            this.blogarraydata.push({id:b.id,image:this.blog_image_url+b.image,title:b.title,description:b.description,
                published_at:b.published_at});
          })
        }
      
              }
    },error => {
      this.isLoading = false;
      console.log(error);
    })
  }

  view_blog(data){
   this.ds.blogdatastore(data);
this.router.navigate(['/blog-view']);
  }

}
