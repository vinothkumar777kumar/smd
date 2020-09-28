import { Component, OnInit } from '@angular/core';
import { FormsModule, FormControl,FormArray,FormGroup,Validator,FormBuilder, Validators } from '@angular/forms';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import { error } from 'protractor';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog-view',
  templateUrl: './blog-view.component.html',
  styleUrls: ['./blog-view.component.css']
})
export class BlogViewComponent implements OnInit {
blogdetails:any;
isLoading:boolean = false;
  constructor(private fb:FormBuilder,private location: Location,private router: Router,private ds: DataserviceService,private toastr: ToastrService) {
    this.blogdetails = this.ds.getblogdata();
    console.log(this.blogdetails);
if(this.blogdetails == undefined){
  this.router.navigateByUrl('/blog');
}else{
console.log(this.blogdetails);
}
   }

  ngOnInit(): void {
    console.log(document.images,'ck blogimages')
    console.log(document.getElementsByTagName('p'))
  }

}
