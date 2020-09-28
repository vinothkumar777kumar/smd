import { Component, OnInit } from '@angular/core';
import { FormsModule, FormControl,FormArray,FormGroup,Validator,FormBuilder, Validators } from '@angular/forms';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import { error } from 'protractor';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';

@Component({
  selector: 'app-winners-podium',
  templateUrl: './winners-podium.component.html',
  styleUrls: ['./winners-podium.component.css']
})
export class WinnersPodiumComponent implements OnInit {
  isloading:boolean =false;
  winnerarraydata = [];
  logininfo:any;
  winner_image_url:any;
  emptywinnerdata:boolean = false;
  isLoading:boolean = false;
  testimo_image_url:any;
  competition_image_url:any;
  src:any;
  constructor(private fb:FormBuilder,private location: Location,private router: Router,private ds: DataserviceService,private toastr: ToastrService) { 
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
    this.testimo_image_url = this.ds.gettestmoamgeurl();
    this.competition_image_url = this.ds.getiamgeAPI();
    this.winnerdata();
  }

  ngOnInit(): void {
  }

  winnerdata(){
    this.isloading = true;
    this.ds.apigetmethod('winnerspodium').subscribe(res => {
      this.isloading = false;
      if(res['success']['status'] == 'success'){
        let data = res['success']['data'];
        if(data == ''){
          this.emptywinnerdata = true;
              this.isloading = false;
        }else{
          let couponarray = [];
          data.forEach((t,i) => {  
          
            this.winnerarraydata.push({id:t.id,image:this.competition_image_url+t.image,title:t.title,description:t.description,
              competition:t.competition,name:t.name,video_url:t.video_url});
            
          })

          if(this.winnerarraydata.length <= 0){
            this.isloading = false;
            // this.showtestimonials = false;
          }else{
            // this.showtestimonials = true;
          }
        }
        this.ds.scrollToTop(2000);
              }
    },error => {
      // console.log(error);
      this.emptywinnerdata = true;
      this.isloading = false;
    })
  }

  viewlivedraw(text,video_url){
    if(text == 'livevideo'){
      this.src = video_url.video_url;
    }else{
      this.src = 'assets/vedio/smdvedio.mp4';
    }
jQuery('#vediomodel').modal('show');
  }


}
