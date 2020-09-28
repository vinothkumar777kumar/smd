import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, FormControl,FormArray,FormGroup,Validator,FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import { error } from 'protractor';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import Swal from 'sweetalert2'
import * as $ from 'jquery';
import {BehaviorSubject, of, Subject} from 'rxjs';
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-winner',
  templateUrl: './winner.component.html',
  styleUrls: ['./winner.component.css']
})
export class WinnerComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger:Subject<any> = new Subject();
  winnerdata:any = [];
  logininfo:any;
  winnermodal:boolean =false;
  userdata:any = [];
  competitionarray:any = [];
  openmodal:boolean = true;
  user_image_url:any;
  emptywinnerdata:boolean = false;
  isloading:boolean = false;
  constructor(private fb:FormBuilder,private location: Location,private router: Router,private ds: DataserviceService,private toastr: ToastrService) { 
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    }
    this.user_image_url = this.ds.getuseriamgeurl();
    this.getuserdata();
    this.getcompetitons_data();
this.winnermethod();
  }

  ngOnInit(): void {
    
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

  getcompetitons_data(){
    this.ds.apigetmethod('competitions').subscribe(res => {
      if(res['success']['status'] == 'success'){
        let competitionarray = [];
        let data = res['success']['data'];
        data.forEach(u => {
          if(u.sold == "true"){
          this.competitionarray.push({id:u.id,image:u.image,competition:u.competition,description:u.description,
            draw_start_date_time:u.draw_start_date_time,draw_end_date_time:u.draw_end_date_time,draw_month:u.draw_month,
            draw_year:u.draw_year});
          }
        })
// this.competitionarray =competitionarray;
      }
    },error => {

    });
  }



  winnermethod(){
    this.isloading = true;
    console.log(this.user_image_url)
    this.ds.getmethod('winner',this.logininfo['success']['token']).subscribe(res => {
      this.isloading = false;
      if(res['success']['status'] == 'success'){
        let data = res['success']['data'];
        if(data == ''){
          this.emptywinnerdata = true;
        }else{
          data.forEach(e => {
            
              this.winnerdata.push({id:e.id,profile_image:this.user_image_url+e.image,name:e.name,user_id:e.user_id,
                competitionname:e.competition,competition_id:e.competition_id,ticket_number:e.booking_number,
                response:e.response,video_thumbnail:e.video_thumbnail,video_url:e.video_url,testimonials:e.testimonials,
                sold:e.sold})
              
          })
          this.dtTrigger.next();
        }
       
        // this.winnerdata = winnerarray;
              }
    },error => {
      console.log(error);
    })
  }



  edit_winner(data){
    const navigationExtras = {
      queryParams: {
          id: data.id  
      }
  };
this.router.navigate(['/add-winner'], navigationExtras);
  }

  delete_winner(data){
    this.ds.deleterecord('winner/'+data.id).subscribe(res => {
     if(res['success']['status'] == "success"){
      Swal.fire({
        title: 'Success',
        text: res['success']['message'],
        icon: 'success',
        confirmButtonText: 'OK',
      }).then((result) => {
        if (result.value) {
          this.winnermethod();
          this.router.navigateByUrl('/winner');
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          this.router.navigateByUrl('/winner');
        }
      })
     }
    },error=> {
      console.log(error);
    })
  }

  winner_select(){
    this.winnermodal = true;   

  }

  savewinner(){
    $('.modal').removeClass('in');
    $('.modal').attr('aria-hidden', 'true');
    $('.modal').css('display', 'none');
    $('.modal-backdrop').remove();
    $('body').removeClass('modal-open');
    this.router.navigateByUrl('/dashboard');
  }

  selectrandomwinner(){
    if($('#competition').val() == 0){
      this.toastr.error("Please Select Competition", 'Error', {
        progressBar:true
      });
      return;
    }else{
      const navigationExtras = {
        queryParams: {
            id: $('#competition').val()  
        }
    };
  this.router.navigate(['/add-winner'], navigationExtras);
  }
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

}
