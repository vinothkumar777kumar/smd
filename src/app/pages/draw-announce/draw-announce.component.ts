import { Component, OnInit } from '@angular/core';
import { FormsModule, FormControl,FormArray,FormGroup,Validator,FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import { error } from 'protractor';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import Swal from 'sweetalert2'
import * as $ from 'jquery';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import {IAngularMyDpOptions, IMyDateModel, IMyCalendarViewChanged, IMyRangeDateSelection, AngularMyDatePickerDirective} from 'angular-mydatepicker';

@Component({
  selector: 'app-draw-announce',
  templateUrl: './draw-announce.component.html',
  styleUrls: ['./draw-announce.component.css']
})
export class DrawAnnounceComponent implements OnInit {
title = "Add Draw Announcement";
  isLoading = false;
  isSubmitted:boolean = false;
  drawannounceform:FormGroup;
  public date = new Date(); 
  competitionarray = [];
  logininfo:any;
  starttime:any;
  resulttime:any;
  drawresult_id:any;
  action = "Save";
  public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd-mm-yyyy',
    disableUntil: {day: this.date.getDate()-1,month: this.date.getMonth()+1,year: this.date.getFullYear()}
  };
  constructor(private Activate: ActivatedRoute,private fb:FormBuilder,private location: Location,private router: Router,private ds: DataserviceService,private toastr: ToastrService) { 
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
    this.getcompetitons_data();
    
    this.Activate.queryParams.subscribe(res => {
      this.drawresult_id = res.id;
      if(this.drawresult_id){
        this.title = "Edit Draw Announcement";
        this.action ="Update";
      }else{
        this.title = 'Add Draw Announcement';
        this.action ="Save";
      }
    this.ds.getmethod('result/'+res.id, this.logininfo['success']['token']).subscribe(res => {
      if(res['success']['status'] == 'success'){
        let result_date = res['success']['data'].result_date.split('-');
      let join_rd = result_date[0] +'-'+result_date[1]+'-'+result_date[2];
      let rplace = /^0+/;
      let rd = result_date[0].replace(rplace,'');
      let rm = result_date[1].replace(rplace,'');
      let result_time = res['success']['data'].result_time.split(' ');
        this.drawannounceform.controls['id'].setValue(res['success']['data'].id);
        this.drawannounceform.controls['competition_id'].setValue(res['success']['data'].competition_id);
        this.drawannounceform.controls['result_date'].setValue({isRange: false, singleDate: {date: { 
          year: result_date[2], 
          month: rm, 
          day: rd
        }}});


        let convert_time = this.getTwentyFourHourTime(res['success']['data'].result_time);
      let split_time = convert_time.split(':');
      let time = split_time[0].toString()
      let min = split_time[1].toString();
      if(time < '10'){
        time = '0'+split_time[0];
      }else{
        time = ''+split_time[0];
      }
      if(min < '10'){
        // alert('test');
        min = '0'+split_time[1];
      }else{
        min = ''+split_time[1];
      }

        console.log(time,min);
        this.drawannounceform.controls['result_time'].setValue(time+':'+min);

      //  this.addcouponform.setValue(res['success']['data']); 
      }
    });
    });
  }



  getTwentyFourHourTime(amPmString) { 
    var d = new Date("1/1/2013 " + amPmString); 
    return d.getHours() + ':' + d.getMinutes(); 
}
  

  ngOnInit(): void {
    this.drawannounceform = this.fb.group({
      id:new FormControl(''),
      competition_id:new FormControl('',Validators.required),
      result_date:new FormControl('',Validators.required),
      result_time:new FormControl('',Validators.required),
      status: new FormControl(0)
    })

    if (Number(this.date.getDate()) - 1 == 0) {
      let actualDate = new Date();
      let cd = new Date(actualDate);
    cd.setDate(cd.getDate() - 1);
      // alert(cd.getDate())
      // alert(actualDate.getMonth() + 1);
      // alert(actualDate.getFullYear());
      this.myDatePickerOptions.disableUntil.day = cd.getDate();
      this.myDatePickerOptions.disableUntil.month = cd.getMonth() + 1;
      this.myDatePickerOptions.disableUntil.year = cd.getFullYear();
    } else {
      this.myDatePickerOptions.disableUntil.day = Number(this.date.getDate()) - 1;
      this.myDatePickerOptions.disableUntil.month = Number(this.date.getMonth() + 1);
      this.myDatePickerOptions.disableUntil.year = Number(this.date.getFullYear());
    }
  }

  get formControls() { return this.drawannounceform.controls; }

  getcompetitons_data(){
    this.ds.apigetmethod('competitions').subscribe(res => {
      if(res['success']['status'] == 'success'){
        let data = res['success']['data'];
        console.log(data);
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

  savedrawannounce(){
this.isSubmitted =true;
if(this.drawannounceform.invalid){
  return;
}else{
  this.isLoading = true;
  let valid_from = this.drawannounceform.value.result_date;
  let rd = valid_from['singleDate']['date'];
  var day,month;
  if(rd.day < 10){
    day = '0'+rd.day;
  }else{
    day = ''+rd.day;
  }
  if(rd.month < 10){
    month = '0'+rd.month;
  }else{
    month = ''+rd.month;
  }
  console.log(day,month);
  let data = {
    competition_id:this.drawannounceform.value.competition_id,
    result_date:day+'-'+month+'-'+rd.year,
    result_time:this.resulttime,
    status:"0"
  }
  if(this.drawannounceform.value.id){
this.ds.postRecords('result/'+this.drawannounceform.value.id,data).subscribe(res => {
  if(res['success'].status == 'success'){
    Swal.fire({
      title: 'Success',
      text: res['success']['message'],
      icon: 'success',
      confirmButtonText: 'OK',
    }).then((result) => {
      if (result.value) {
        this.router.navigateByUrl('/draw-results');  
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // this.router.navigateByUrl('/register');
      }
    })
  }
})
  }else{
  this.ds.postRecords('result',data).subscribe(res => {
    this.isLoading =false;
    if(res['status'] == 'SUCCESS'){
      Swal.fire({
        title: 'Success',
        text: res['message'],
        icon: 'success',
        confirmButtonText: 'OK',
      }).then((result) => {
        if (result.value) {
          this.router.navigateByUrl('/draw-results');  
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // this.router.navigateByUrl('/register');
        }
      })
    }
  },error => {
    this.isLoading =false;
    console.log(error);
  })
}
}
  }

  onDateChanged(event,text_date) {
    // let {date, jsDate, formatted, epoc} = event.singleDate;
    // console.log(event['singleDate'])
    if(text_date == 'result_date'){
      this.drawannounceform.controls['result_date'].setValue(event.singleDate.formatted);
      let start_date = event['singleDate'].date;
      console.log(start_date.day,start_date.month,start_date.year)
      // this.myDatePickerOptions = {
      //    dateRange: false,
      //    dateFormat: 'dd-mm-yyyy',
      //    disableUntil: {day:start_date.day - 1,month: start_date.month,year: start_date.year}
      //  };
    }else if(text_date == 'valid_to'){
      // this.drawannounceform.controls['valid_to'].setValue(event.singleDate.formatted);
    //  let start_date = this.addcampform.controls['start_date'].value
      // let start_time = this.addcampform.controls['start_time'].value;
      // let end_time = this.addcampform.controls['end_time'].value;
      // if((start_time == '' || start_time == null) && (end_time == '' || end_time == null)){
  
        // Swal.fire('Error','Please Select Camp Start Time and End Time', 'error');
        // setTimeout(() => {
          // this.addcampform.controls['start_time'].reset();
          // this.addcampform.controls['end_time'].reset();
          // this.addcampform.controls['start_date'].reset();
          // this.addcampform.controls['end_date'].reset();
  //       },1000);
  //       return;
  //   }else if(start_date == '' || start_date == null){
  //     Swal.fire('Error','Please Select Camp start date', 'error');
  //       setTimeout(() => {
  //         this.addcampform.controls['start_time'].reset();
  //         this.addcampform.controls['end_time'].reset();
  //         this.addcampform.controls['end_date'].reset();
  //       },1000);
  //       return;
  //   }else{
  //     this.isselectcampdate = true;
  //     let sd = this.addcampform.controls['start_date'].value;
  //     let start_date = sd.singleDate.jsDate;
  //     let end_date = event.singleDate.jsDate;
  //    let array_date =  this.getDateArray(new Date(moment(start_date).format('YYYY-MM-DD')),new Date(moment(end_date).format('YYYY-MM-DD')));
  //    let datetime = [];
  //    array_date.forEach(e => {
  //      console.log(this.starttime + this.endtime);
  //  datetime.push({date:e,start_time:this.starttime,end_time: this.endtime})
  //    })
  //    this.addcampform.addControl('selecteddate', new FormArray([ ]));   
  //    let selectdate = this.addcampform.get('selecteddate') as FormArray;
  //    datetime.forEach(date => {
  //      console.log(date);
  //      selectdate.push(
  //        this.fb.group({
  //          date: new FormControl(date.date),
  //          select_start_time:new FormControl(date.start_time),
  //          select_end_time: new FormControl(date.end_time)
  //        })
  //      )
  //    });
  //    console.log(this.addcampform.value);
  //  this.selectedcamparray_date = array_date;
    // });
  }
  
  
  }

  onTimeChange(event,texttime){
    if(texttime == 'start_time'){
      var inputEle = document.getElementById('start_time');
      var timeSplit = event.target.value.split(':'),
      hours,
      minutes,
      meridian;
    hours = timeSplit[0];
    minutes = timeSplit[1];
    if (hours > 12) {
      meridian = 'PM';
      hours -= 12;
    } else if (hours < 12) {
      meridian = 'AM';
      if (hours == 0) {
        hours = 12;
      }
    } else {
      meridian = 'PM';
    }
    this.resulttime = hours + ':' + minutes+' '+meridian;
    this.starttime = hours + ':' + minutes;
    }else{
      var inputEle = document.getElementById('end_time');
      var timeSplit = event.target.value.split(':'),
      hours,
      minutes,
      meridian;
    hours = timeSplit[0];
    minutes = timeSplit[1];
    if (hours > 12) {
      meridian = 'PM';
      // hours -= 12;
    } else if (hours < 12) {
      meridian = 'AM';
      if (hours == 0) {
        hours = 12;
      }
    } else {
      meridian = 'PM';
    }
    console.log(hours + ':' + minutes);
    // this.endtime = hours + ':' + minutes;
    }
  }
  
  
  
  onDateRange(checked: boolean): void {
    // this.model = null;
    let copy = this.getCopyOfOptions();
    copy.dateRange = checked;
    this.myDatePickerOptions = copy;
  }

  getCopyOfOptions(): IAngularMyDpOptions {
    return JSON.parse(JSON.stringify(this.myDatePickerOptions));
  }


}
