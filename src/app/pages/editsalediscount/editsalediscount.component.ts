import { Component, OnInit } from '@angular/core';
import { FormsModule, FormControl,FormArray,FormGroup,Validator,FormBuilder, Validators } from '@angular/forms';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import * as $ from 'jquery';
import Swal from 'sweetalert2'
import {MovingDirection} from 'angular-archwizard';
import { error } from 'protractor';
import {IAngularMyDpOptions, IMyDateModel, IMyCalendarViewChanged, IMyRangeDateSelection, AngularMyDatePickerDirective} from 'angular-mydatepicker';
import * as moment from 'moment'; 
import { Router, ActivatedRoute } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-editsalediscount',
  templateUrl: './editsalediscount.component.html',
  styleUrls: ['./editsalediscount.component.css']
})
export class EditsalediscountComponent implements OnInit {
  isLoading:boolean = false;
  isSubmitted = false;
  salediscount_id:any;
  competition_id:any;
  logininfo:any;
  salediscountdata = [];
  editsalediscountform: FormGroup;
  competitionarray = [];
  constructor(private http: HttpClient,private location: Location,private router: Router,private ds: DataserviceService,
    private toastr: ToastrService,private Activate:ActivatedRoute,private fb:FormBuilder) {
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
    this.Activate.queryParams.subscribe(res => {
      console.log(this.salediscount_id);
      this.salediscount_id = res.id;
      this.competition_id = res.competition_id;
this.getsalediscount_data()
this.getcompetitons_data();
    });
  }

  ngOnInit(): void {
    this.editsalediscountform = this.fb.group({
      id:[''],
      competition_id:['',Validators.required],
      sale_date:['',Validators.required],
      discount:['',Validators.required],
      value:['',Validators.required]
    })
  }

  get formControls() { return this.editsalediscountform.controls; }

  getsalediscount_data(){
    this.ds.getmethod('discount/'+this.salediscount_id, this.logininfo['success']['token']).subscribe(res => {
      if(res['success']['status'] == 'success'){
        let data = res['success'].data;
        this.editsalediscountform.controls['id'].setValue(data[0].id);
  this.editsalediscountform.controls['competition_id'].setValue(data[0].competition_id);
  this.editsalediscountform.controls['sale_date'].setValue(data[0].sale_date);
  this.editsalediscountform.controls['discount'].setValue(data[0].discount);
  this.editsalediscountform.controls['value'].setValue(data[0].value);
 
      }
    });
  }

  getcompetitons_data(){
    this.ds.apigetmethod('competitions').subscribe(res => {
      if(res['success']['status'] == 'success'){
        let data = res['success']['data'];
        data.forEach(u => {
          this.competitionarray.push({id:u.id,image:u.image,competition:u.competition,description:u.description,
            draw_start_date_time:u.draw_start_date_time,draw_end_date_time:u.draw_end_date_time,draw_month:u.draw_month,
            draw_year:u.draw_year});
        })
        console.log(this.competitionarray);
// this.competitionarray =competitionarray;
      }
    },error => {

    });
  }

  update_salediscount(){
    this.isSubmitted =true;
if(this.editsalediscountform.invalid){
  return;
}else{
  this.isLoading =true;
  this.ds.postRecords('discount/'+this.editsalediscountform.value.id,this.editsalediscountform.value).subscribe(res => {
    this.isLoading =false;
    console.log(res);
      if(res['success'].status == 'success'){
        Swal.fire({
          title: 'Success',
          text: res['message'],
          icon: 'success',
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.value) {
            // this.router.navigateByUrl('/view-salediscount');
            const navigationExtras = {
              queryParams: {
                  id: this.competition_id 
              }
          };
        this.router.navigate(['/view-salediscount'], navigationExtras);
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            // this.router.navigateByUrl('/register');
          }
        })
      }
    },error => {
      this.isLoading=false;
      console.log(error);
    })
}
  }

  gotpreviews(){
    const navigationExtras = {
      queryParams: {
          id: this.competition_id 
      }
  };
this.router.navigate(['/view-salediscount'], navigationExtras);
  }

}
