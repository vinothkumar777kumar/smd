import { Component, OnInit } from '@angular/core';
import { FormsModule, FormControl,FormArray,FormGroup,Validator,FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import { error } from 'protractor';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import {IAngularMyDpOptions, IMyDateModel, IMyCalendarViewChanged, IMyRangeDateSelection, AngularMyDatePickerDirective} from 'angular-mydatepicker';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import * as moment from 'moment'; 

@Component({
  selector: 'app-admin-addtestimonialslist',
  templateUrl: './admin-addtestimonialslist.component.html',
  styleUrls: ['./admin-addtestimonialslist.component.css']
})
export class AdminAddtestimonialslistComponent implements OnInit {
  isLoading:boolean =false;
  title = "Add Testimonials";
  action_btn = "Save";
  isSubmitted:boolean = false;
  testimonialsform:FormGroup;
  file :any = [];
  public date = new Date();
  logininfo:any;
  blogid:any;
  testmo_image_url:any;
  testimo_image:any;
  blog_image_name:any;
  showtestimoeditimage:boolean = true;
  showtestimoimage:boolean = false;
  competitionarray:any;
  dropdownSettings: any = {};
  dropdownSettings1: any = {};
  userdata:any;
  testimo_id:any;
  testimonials_image_name:any;
  constructor(private Activate: ActivatedRoute,private fb:FormBuilder,private location: Location,private router: Router,private ds: DataserviceService,private toastr: ToastrService) {
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
    this.testmo_image_url = this.ds.gettestmoamgeurl();

    this.getcompetitons_data();
    this.getuserdata();
    this.testimonialsform = this.fb.group({
      id:[''],
      image:['',Validators.required],
      competition:['0'],
      user_id:['',Validators.required],
      status:['1'],
      title:['',Validators.required],
      description:['',[Validators.required,Validators.minLength(5),Validators.maxLength(200)]],
    })
    this.Activate.queryParams.subscribe(res => {
      this.testimo_id = res.id;
      if(this.testimo_id){
        this.title = "Edit Testimonials";
        this.action_btn ="Update";
      }else{
        this.title = 'Add Testimonials';
        this.action_btn ="Save";
      }
    this.ds.getmethod('testimonial/'+res.id, this.logininfo['success']['token']).subscribe(async res => {
      if(res['success']['status'] == 'success'){
        let data = res['success']['data'];
        if(data == ''){

        }else{
          this.testimonialsform.controls['id'].setValue(data.id);
          if(data.image){
            this.testimonials_image_name = data.image;
          }else{
            this.testimonials_image_name = 'logo.png';
          }
          this.blog_image_name = data.image;
          if(data.image != ''){
            this.testimo_image = this.testmo_image_url+data.image;
            this.showtestimoimage = true;
            this.showtestimoeditimage = false;
          }else{
            this.showtestimoimage = false;
            this.showtestimoeditimage = true;
          }
          var f = new File([""], this.blog_image_name);
          console.log(f);
          let image = await this.urlToObject(this.testimonials_image_name);
      
          this.testimonialsform.get('image').clearValidators();
          this.testimonialsform.get('image').updateValueAndValidity();
          this.testimonialsform.controls['competition'].setValue(data.competition_id);
          this.testimonialsform.controls['user_id'].setValue(data.user_id);
          this.testimonialsform.controls['status'].setValue(data.status);
            this.testimonialsform.controls['title'].setValue(data.title);
            this.testimonialsform.controls['description'].setValue(data.description);
          
            
         
        }
      
      }
    });
    });
   }

  ngOnInit(): void {
  }

  
  get formControls() { return this.testimonialsform.controls; }

  getcompetitons_data(){
    this.ds.apigetmethod('competitions').subscribe(res => {
      if(res['success']['status'] == 'success'){
        let data = res['success']['data'];
        let cd = [];
        data.forEach(u => {
          if(u.sold == 'false' && moment().format('DD-MM-YYYY') >= u.draw_start_date_time){
          cd.push({id:u.id,image:u.image,competition:u.competition,description:u.description,
            draw_start_date_time:u.draw_start_date_time,draw_end_date_time:u.draw_end_date_time,draw_month:u.draw_month,
            draw_year:u.draw_year});
          }
        })
        console.log(this.competitionarray);
this.competitionarray =cd;
      }
    },error => {

    });

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'competition',
      enableCheckAll:true,
      // selectAllText: 'Select All',
      // unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  getuserdata(){
    this.ds.getmethod('users',this.logininfo['success']['token']).subscribe(res => {
      if(res['success']['status'] == 'success'){
        let userarray = [];
        let data = res['success']['data'];  
        data.forEach(u => {
          userarray.push({id:u.id,name:u.name,phone:u.phone,postcode:u.postcode,status:u.status,town:u.town,user_type:u.user_type,email:u.email})
        })
        // console.log(userarray);
this.userdata =userarray;
      }
    },error => {

    });
    this.dropdownSettings1 = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      enableCheckAll:true,
      // selectAllText: 'Select All',
      // unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    
    
  }

  fileProgress(fileInput: any) {
    console.log(fileInput)
    let fileData = fileInput.target.files[0];
    this.file=fileData;
    // let arr = fileData.split('/'); 
    console.log(this.file);
  }

  async addtestimonials(){
    this.isSubmitted = true;
    // console.log(this.testimonialsform.value);
    // return;
    if(this.testimonialsform.invalid){
      console.log(this.testimonialsform.value);
      return;
    }else{
      this.isLoading =true;
      if(this.testimonialsform.value.id){
        const myFormData = new FormData();
        myFormData.append('user_id',  this.testimonialsform.value.user_id);
        myFormData.append('competition_id',  this.testimonialsform.value.competition);
        
        let image = await this.urlToObject(this.testimonials_image_name);
// console.log(image,this.testimonials_image_name,'imageuurltoobe');
// console.log(this.file),'filetoobject';
        if (this.file == '') {
          myFormData.append('image', image, this.testimonials_image_name);
        } else {
          myFormData.append('image', this.file, this.file.name);
        }
        myFormData.append('title',  this.testimonialsform.value.title);
        myFormData.append('description',  this.testimonialsform.value.description);
        myFormData.append('status', this.testimonialsform.value.status);
        this.ds.postRecords('testimonial/'+this.testimonialsform.value.id,myFormData,true).subscribe(res => {
          this.isLoading = false;
          if(res['success']['status'] == 'success'){
            Swal.fire({
              title: 'Updated',
              text: res['success']['message'],
              icon: 'success',
              confirmButtonText: 'OK',
            }).then((result) => {
              if (result.value) {
                this.router.navigateByUrl('/testimonialstable');
              } else if (result.dismiss === Swal.DismissReason.cancel) {
                // this.router.navigateByUrl('/register');
              }
            })
          }
    },error => {
      this.isLoading =false;
      console.log(error);
    });
      }else{
        const myFormData = new FormData();
        console.log(this.file == []);
        myFormData.append('user_id',  this.testimonialsform.value.user_id);
        myFormData.append('competition_id',  this.testimonialsform.value.competition);
        if(this.file == ''){
          myFormData.append('image', '');
        }else{
          myFormData.append('image', this.file,this.file.name);
        }
        myFormData.append('title',  this.testimonialsform.value.title);
        myFormData.append('description',  this.testimonialsform.value.description);
        myFormData.append('status', this.testimonialsform.value.status);
        this.ds.postRecords('testimonial',myFormData,true).subscribe(res => {
          this.isLoading = false;
          if(res['status'] == 'SUCCESS'){
            Swal.fire({
              title: 'Success',
              text: res['message'],
              icon: 'success',
              confirmButtonText: 'OK',
            }).then((result) => {
              if (result.value) {
                this.router.navigateByUrl('/testimonialstable');
              } else if (result.dismiss === Swal.DismissReason.cancel) {
                // this.router.navigateByUrl('/register');
              }
            })
          }
    },error => {
      this.isLoading =false;
      console.log(error);
    });
      }
 
    }
  }

  urlToObject = async (imageName) => {
    // alert(this.testmo_image_url + imageName);
    const response = await fetch((this.testmo_image_url + imageName));
    console.log(response)
    if(response.ok) {
      const blob = await response.blob();
      // console.log(blob,'blob image');
      // const file = new File([blob], imageName, {type: blob.type});
      return blob;
    } else {
      const blob = await response.blob(); //tempory change image my
      return blob;
      // return null;
    }
  }

  deleteblogImage(){
    this.showtestimoimage = false;
    this.showtestimoeditimage = true;
    this.testimo_image = '';
    this.ds.postRecords('testimonialimage/' + this.testimo_id,this.logininfo['success']['token']).subscribe(res => {
      if (res['success'].status == 'success') {
        Swal.fire({
          title: 'Deleted',
          text: res['success'].message,
          icon: 'success',
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.value) {

          } else if (result.dismiss === Swal.DismissReason.cancel) {
            this.router.navigateByUrl('/addtestimonials');
          }
        })

      }
    }, error => {
      console.log(error);
    })
  }

}
