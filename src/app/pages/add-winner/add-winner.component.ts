import { Component, OnInit } from '@angular/core';
import { FormsModule, FormControl,FormArray,FormGroup,Validator,FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import { error } from 'protractor';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-winner',
  templateUrl: './add-winner.component.html',
  styleUrls: ['./add-winner.component.css']
})
export class AddWinnerComponent implements OnInit {
  title = 'Add Winner';
  isSubmitted =false;
  users:any;
  addwinnerform:FormGroup;
  logininfo:any;
  userdata:any = [];
  competitionsdata:any = [];
  file :any = [];
  format:any;
  url:any;
  Imagefile:any = [];
  winnerid:any;
  random_select_winner:any;
  randomwinner = [];
  constructor(private Activate: ActivatedRoute,private fb:FormBuilder,private location: Location,private router: Router,private ds: DataserviceService,private toastr: ToastrService) {
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
 this.getuserdata();
 this.getcompetitiondata();
    this.addwinnerform = this.fb.group({
      id:[''],
      user_id: ['',Validators.required],
      competition_id: ['',Validators.required],
      town:[''],
      profile_image: ['',Validators.required],
      response: ['',Validators.required],
      ticket_number: ['',Validators.required],
      video_thumbnail: ['',Validators.required],
      video_url: ['',Validators.required],
      testimonials: ['',Validators.required],
      draw_start:['',Validators.required],
      draw_end:['',Validators.required]
    })
    this.Activate.queryParams.subscribe(res => {
      this.winnerid = res.id;
      if(this.winnerid){
        this.title = "Edit Winner";
      }else{
        this.title = "Add Winner";
      }
    this.ds.getmethod('winner/'+res.id, this.logininfo['success']['token']).subscribe(res => {
      if(res['success']['status'] == 'success'){
      //  this.addwinnerform.setValue(res['success']['data']); 
      }
    });
  });
  this.Activate.queryParams.subscribe(res => {
  this.ds.getmethod('random?competition_id='+res.id,this.logininfo['success']['token']).subscribe(res => {
    if(res['success'].status == 'success'){
      this.random_select_winner = res['success']['data'];
      let data = res['success']['data'];
 data.forEach(rw => {
this.randomwinner.push({alphabet:rw.alphabet,booking_number:rw.booking_number,
  competition_id:rw.competition_id,id:rw.id,status:rw.status,ticket_number:rw.ticket_number,user_id:rw.user_id,
  bookingnumber:rw.booking_number,name:rw.name,competition:rw.competition,draw_end:rw.draw_end,draw_start:rw.draw_start});
 })
 if(this.randomwinner.length == 0){
  this.toastr.error('No Data Found', 'Error', {
    progressBar:true
  });
  return;
 }

      this.addwinnerform.controls['user_id'].setValue(this.randomwinner[0].name);
   this.addwinnerform.controls['competition_id'].setValue(this.randomwinner[0].competition);
   this.addwinnerform.controls['ticket_number'].setValue(this.randomwinner[0].booking_number);
   this.addwinnerform.controls['town'].setValue(this.randomwinner[0].town);
  //  this.addwinnerform.controls['draw_end'].setValue(this.randomwinner[0].draw_end);
    // $('#booking_number').val(data[0].booking_number)
    
    }else if(res['success'].status == 'failed'){
      this.toastr.error(res['success'].message, 'Error', {
        progressBar:true
      });
      return;
    }
        },error => {
          console.log(error); 
        })
      });
   }

  ngOnInit(): void {
  }

  fileProgress(fileInput: any) {
    let fileData = fileInput.target.files[0];
    this.Imagefile=fileData;
    // let arr = fileData.split('/'); 
    // console.log(arr);
  }

  getuserdata(){
    this.ds.getmethod('users',this.logininfo['success']['token']).subscribe(res => {
      if(res['success']['status'] == 'success'){
        let userarray = [];
        let data = res['success']['data'];
        data.forEach(u => {
          this.userdata.push({id:u.id,name:u.name,phone:u.phone,postcode:u.postcode,status:u.status,town:u.town,user_type:u.user_type,email:u.email})
        })
// this.userdata =userarray;
      }
    },error => {

    });
  }
  getcompetitiondata(){
    this.ds.apigetmethod('competition').subscribe(res => {
      if(res['success']['status'] == 'success'){
        let competitionarray = [];
        let data = res['success']['data'];
        data.forEach(u => {
          competitionarray.push({id:u.id,image:u.image,competition:u.competition,description:u.description,
            draw_start_date_time:u.draw_start_date_time,draw_end_date_time:u.draw_end_date_time,draw_month:u.draw_month,
            draw_year:u.draw_year});
        })
this.competitionsdata =competitionarray;
      }
    },error => {

    });
  }

  addwinner(){
    
    this.isSubmitted =false;
    let data = {
      user_id:this.randomwinner[0].user_id,
competition_id:this.randomwinner[0].competition_id,
profile_image:"bdgfdcg",
response:"jhiub  jg jhgh ",
ticket_number:this.randomwinner[0].ticket_number,
video_thumbnail:"jgjhhv",
video_url:"http://cgdgf.civmn",
testimonials:"0",
ticket_id:this.randomwinner[0].id
    }
      
  this.ds.postRecords('winner',data).subscribe(res => {
    if(res['status'] == 'SUCCESS'){
      Swal.fire({
        title: 'Success',
        text: res['message'],
        icon: 'success',
        confirmButtonText: 'OK',
      }).then((result) => {
        if (result.value) {
          this.router.navigateByUrl('/winner');
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // this.router.navigateByUrl('/register');
        }
      })
    }
  },error => {
    console.log(error);
  })
  //   if(this.addwinnerform.invalid){
  //     return;
  //   }else{
  //     if(this.addwinnerform.controls['id'].value){
  //       const myFormData = new FormData();
  //       myFormData.append('id', this.addwinnerform.value.user_id);
  //       myFormData.append('user_id', this.addwinnerform.value.user_id);
  //       myFormData.append('competition_id',  this.addwinnerform.value.competition_id);
  //       myFormData.append('profile_image',  this.Imagefile,this.Imagefile.name);
  //       myFormData.append('response',  this.addwinnerform.value.response);
  //       myFormData.append('ticket_number',  this.addwinnerform.value.ticket_number);
  //       myFormData.append('video_thumbnail',  this.addwinnerform.value.video_thumbnail);
  //       myFormData.append('video_url',  this.file);
  //       myFormData.append('testimonials',  this.addwinnerform.value.is_active);

  //     }else{
  //     const myFormData = new FormData();
  //     myFormData.append('user_id', this.addwinnerform.value.user_id);
  //     myFormData.append('competition_id',  this.addwinnerform.value.competition_id);
  //     myFormData.append('profile_image',  this.Imagefile,this.Imagefile.name);
  //     myFormData.append('response',  this.addwinnerform.value.response);
  //     myFormData.append('ticket_number',  this.addwinnerform.value.ticket_number);
  //     myFormData.append('video_thumbnail',  this.addwinnerform.value.video_thumbnail);
  //     myFormData.append('video_url',  this.file);
  //     myFormData.append('testimonials',  this.addwinnerform.value.is_active);
     
  //     this.ds.postRecords('winner',this.addwinnerform.value).subscribe(res => {
  //       if(res['status'] == 'SUCCESS'){
  //         Swal.fire({
  //           title: 'Success',
  //           text: res['message'],
  //           icon: 'success',
  //           confirmButtonText: 'OK',
  //         }).then((result) => {
  //           if (result.value) {
  //             this.router.navigateByUrl('/winner');
  //           } else if (result.dismiss === Swal.DismissReason.cancel) {
  //             // this.router.navigateByUrl('/register');
  //           }
  //         })
  //       }
  //     },error => {
  //       console.log(error);
  //     })
  //   }
  // }
  }

  onSelectFile(event) {
    const file = event.target.files && event.target.files[0];
    this.file = event.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      if(file.type.indexOf('image')> -1){
        this.format = 'image';
      } else if(file.type.indexOf('video')> -1){
        this.format = 'video';
      }
      reader.onload = (event) => {
        this.url = (<FileReader>event.target).result;
      }
    }
  }

}
