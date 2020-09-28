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
import * as moment from 'moment'; 

@Component({
  selector: 'app-relaunch-coupon',
  templateUrl: './relaunch-coupon.component.html',
  styleUrls: ['./relaunch-coupon.component.css']
})
export class RelaunchCouponComponent implements OnInit {
  isSubmitted:boolean = false;
  isLoading:boolean = false;
  addcouponform:FormGroup;
  logininfo:any;
  couponid:any
  title = 'Add Coupon';
  public date = new Date(); 
  competitionarray = [];
  dropdownSettings: any = {};
  public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd-mm-yyyy',
    disableUntil: {day: this.date.getDate()-1,month: this.date.getMonth()+1,year: this.date.getFullYear()}
  };
  public myDatePickerOptions1: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd-mm-yyyy',
    disableUntil: {day: this.date.getDate()-1,month: this.date.getMonth()+1,year: this.date.getFullYear()}
  };
  constructor(private Activate: ActivatedRoute,private fb:FormBuilder,private location: Location,private router: Router,private ds: DataserviceService,private toastr: ToastrService) { 
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
    this.getcompetitons_data();
    
this.addcouponform = this.fb.group({
  id:[''],
  competition:['',Validators.required],
  coupon:['',Validators.required],
  code:['',Validators.required],
  valid_from:[''],
  valid_to:[''],
  coupon_type:['1',Validators.required],
  coupon_value:['',Validators.required],
  min_cart_amount:[0],
  max_redeem_amount:[0],
  is_active:['1',Validators.required],
})

this.Activate.queryParams.subscribe(res => {
  this.couponid = res.id;
 
this.ds.getmethod('coupon/'+res.id, this.logininfo['success']['token']).subscribe(res => {
  if(res['success']['status'] == 'success'){
    let data = res['success']['data'][0];
    console.log(data);
    let valid_from = data.valid_from.split('-');
    let valid_to = data.valid_to.split('-');
  let vf = valid_from[0] +'-'+valid_from[1]+'-'+valid_from[2];
  let vt = valid_to[0] +'-'+valid_to[1]+'-'+valid_to[2];
  let rplace = /^0+/;
  let vfd = valid_from[0].replace(rplace,'');
  let vfm = valid_from[1].replace(rplace,'');
  let vtd = valid_to[0].replace(rplace,'');
  let vtm = valid_to[1].replace(rplace,'');
   
    // this.addcouponform.controls['id'].setValue(this.couponid);
    this.addcouponform.controls['competition'].setValue(data.competition);
    this.addcouponform.controls['coupon'].setValue(data.coupon);
    this.addcouponform.controls['code'].setValue(data.code);
    if (Number(vfd) - 1 == 0) {
      let actualDate = new Date(Number(new Date(valid_from[2] + "-" + vfm + "-" + vfd)) - 1);
      this.myDatePickerOptions.disableUntil.day = actualDate.getDate();
      this.myDatePickerOptions.disableUntil.month = actualDate.getMonth() + 1;
      this.myDatePickerOptions.disableUntil.year = actualDate.getFullYear();
    } else {
      this.myDatePickerOptions.disableUntil.day = Number(vfd) - 1;
      this.myDatePickerOptions.disableUntil.month = Number(vfm);
      this.myDatePickerOptions.disableUntil.year = Number(valid_from[2]);
    }
    // this.addcouponform.controls['valid_from'].setValue({isRange: false, singleDate: {date: { 
    //   year: valid_from[2], 
    //   month: vfm, 
    //   day: vfd
    // }}});
       if (Number(vtd) - 1 == 0) {
      let actualDate = new Date(Number(new Date(valid_to[2] + "-" + vtm + "-" + vtd)) - 1);
      this.myDatePickerOptions1.disableUntil.day = actualDate.getDate();
      this.myDatePickerOptions1.disableUntil.month = actualDate.getMonth() + 1;
      this.myDatePickerOptions1.disableUntil.year = actualDate.getFullYear();
    } else {
      // this.myDatePickerOptions1.disableUntil.day = Number(vtd) - 1;
      // this.myDatePickerOptions1.disableUntil.month = Number(vtm);
      // this.myDatePickerOptions1.disableUntil.year = Number(valid_to[2]);
    }
    // this.addcouponform.controls['valid_to'].setValue({isRange: false, singleDate: {date: { 
    //   year: valid_to[2], 
    //   month: vtm, 
    //   day: vtd
    // }}});
    this.addcouponform.controls['coupon_type'].setValue(data.coupon_type);
    this.addcouponform.controls['coupon_value'].setValue(data.coupon_value);
    this.addcouponform.controls['min_cart_amount'].setValue(0);
    this.addcouponform.controls['max_redeem_amount'].setValue(0);
    this.addcouponform.controls['is_active'].setValue(data.is_active);
  //  this.addcouponform.setValue(res['success']['data']); 
  }
});
});
  }

  ngOnInit(): void {
    this.addcouponform.controls['valid_from'].setValue({isRange: false, singleDate: {date: { 
      year: this.date.getFullYear(), 
      month: this.date.getMonth()+1, 
      day: this.date.getDate()
    }}});
    this.addcouponform.controls['valid_to'].setValue({isRange: false, singleDate: {date: { 
      year: this.date.getFullYear(),
      month: this.date.getMonth()+1, 
      day: this.date.getDate()
    }}});

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

      this.myDatePickerOptions1.disableUntil.day = cd.getDate();
      this.myDatePickerOptions1.disableUntil.month = cd.getMonth() + 1;
      this.myDatePickerOptions1.disableUntil.year = cd.getFullYear();
    } else {
      this.myDatePickerOptions.disableUntil.day = Number(this.date.getDate()) - 1;
      this.myDatePickerOptions.disableUntil.month = Number(this.date.getMonth() + 1);
      this.myDatePickerOptions.disableUntil.year = Number(this.date.getFullYear());

      this.myDatePickerOptions1.disableUntil.day = Number(this.date.getDate()) - 1;
      this.myDatePickerOptions1.disableUntil.month = Number(this.date.getMonth() + 1);
      this.myDatePickerOptions1.disableUntil.year = Number(this.date.getFullYear());
    }
  }

  get formControls() { return this.addcouponform.controls; }

  getcompetitons_data(){
    this.ds.apigetmethod('competitions').subscribe(res => {
      if(res['success']['status'] == 'success'){
        let data = res['success']['data'];
        let cmd = [];
        data.forEach(u => {
          let cd = moment().format('YYYY-MM-DD');
          let sd = moment(u.draw_start_date_time,'DD-MM-YYYY').format('YYYY-MM-DD'); 
          if(u.sold == 'false' && moment(sd).isSameOrBefore(cd) == true && u.is_featured == 1){
            cmd.push({id:u.id,image:u.image,competition:u.competition,description:u.description,
            draw_start_date_time:u.draw_start_date_time,draw_end_date_time:u.draw_end_date_time,draw_month:u.draw_month,
            draw_year:u.draw_year});
          }
        })
        console.log(this.competitionarray);
this.competitionarray =cmd;
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

  addcoupon(){
    this.isSubmitted =true;
    if(this.addcouponform.invalid){
      // alert('test invalid')
      if(this.addcouponform.controls['valid_to'].valid == false ){
        this.toastr.error('Valid to date should be greater than or equal to  current date.', 'Info', {
          progressBar:true
        });
        return;
      }
      // console.log(this.addcouponform.controls['id'].valid,'id');
      // console.log(this.addcouponform.controls['coupon'].valid,'coupon');
      // console.log(this.addcouponform.controls['code'].valid,'code');
      // console.log(this.addcouponform.controls['valid_from'].valid,'valid_from');
      // console.log(this.addcouponform.controls['valid_to'].valid,'valid_to');
      // console.log(this.addcouponform.controls['coupon_type'].valid,'coupon_type');
      // console.log(this.addcouponform.controls['coupon_value'].valid,'coupon_value');
      // console.log(this.addcouponform.controls['min_cart_amount'].valid,'min_cart_amount');
      // console.log(this.addcouponform.controls['max_redeem_amount'].valid,'imax_redeem_amountd');
      // console.log(this.addcouponform.controls['is_active'].valid,'is_active');
      // console.log(this.addcouponform.controls['competition'].valid,'competition');
      return;
    }else{
      console.log(this.addcouponform.value);
      // alert('valid')
      if(this.addcouponform.value.coupon_value == 0){
        this.toastr.error('Coupon value should be grater then 0', 'Error', {
          progressBar:true
        });
        return;
      }
      if(this.addcouponform.value.coupon_type == 2){
        if(this.addcouponform.value.coupon_value > 100)
        this.toastr.error('Coupon percentage should be less then or equal to 100', 'Error', {
          progressBar:true
        });
        return;
      }
      if(this.addcouponform.controls['id'].value){
        // alert('test');
        let valid_from = this.addcouponform.value.valid_from;
        let vf = valid_from['singleDate']['date'];
        let vfd= (vf.day < 10 ? '0' : '')+(vf.day);
let vfm = (vf.month < 10 ? '0' : '')+(vf.month);
        let valid_to = this.addcouponform.value.valid_to;
        let vt = valid_to['singleDate']['date'];
        let vtd= (vt.day < 10 ? '0' : '')+(vt.day);
        let vtm = (vt.month < 10 ? '0' : '')+(vt.month);
        let ca = this.addcouponform.value.competition;
        let couponddata = new FormData();
ca.forEach((c,i) => {
  // let key =    'competition_id['+i+']'
  // coupon_data['competition_id['+i+']'] = c.id;
  couponddata.append('competition_id['+i+']',c.id);
   })
couponddata.append('coupon',this.addcouponform.value.coupon);
couponddata.append('code',this.addcouponform.value.code);
couponddata.append('valid_from',vfd+'-'+vfm+'-'+vf.year);
couponddata.append('valid_to',vtd+'-'+vtm+'-'+vt.year);
couponddata.append('coupon_type',this.addcouponform.value.coupon_type);
couponddata.append('coupon_value',this.addcouponform.value.coupon_value);
couponddata.append('min_cart_amount',this.addcouponform.value.min_cart_amount);
couponddata.append('max_redeem_amount',this.addcouponform.value.max_redeem_amount);
couponddata.append('is_active',this.addcouponform.value.is_active);
  //       let coupon_data = {
  //         id:this.addcouponform.value.id,
  // coupon:this.addcouponform.value.coupon,
  // code:this.addcouponform.value.code,
  // valid_from:vfd+'-'+vfm+'-'+vf.year,
  // valid_to:vtd+'-'+vtm+'-'+vt.year,
  // coupon_type:this.addcouponform.value.coupon_type,
  // coupon_value:this.addcouponform.value.coupon_value,
  // min_cart_amount:this.addcouponform.value.min_cart_amount,
  // max_redeem_amount:this.addcouponform.value.max_redeem_amount,
  // is_active:this.addcouponform.value.is_active,
  //       }
  //       ca.forEach((c,i) => {
  //         let key =    'competition_id['+i+']'
  //         coupon_data['competition_id['+i+']'] = c.id;
  //          })
  //       console.log(coupon_data);
  this.isLoading = true;
      this.ds.postRecords('coupon/'+this.addcouponform.controls['id'].value,couponddata,true).subscribe(res => {
        this.isLoading = false;
        if(res['success']['status'] == 'success'){
          Swal.fire({
            title: 'Success',
            text: res['success']['message'],
            icon: 'success',
            confirmButtonText: 'OK',
          }).then((result) => {
            if (result.value) {
              this.router.navigateByUrl('/coupon');
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              // this.router.navigateByUrl('/register');
            }
          })
        }
      },error => {
        this.isLoading = false;
        console.log(error);
      })
      }else{     
        let valid_from = this.addcouponform.value.valid_from;
        let vf = valid_from['singleDate']['date'];
        let vfd= (vf.day < 10 ? '0' : '')+(vf.day);
        let vfm = (vf.month < 10 ? '0' : '')+(vf.month);
        let valid_to = this.addcouponform.value.valid_to;
        let vt = valid_to['singleDate']['date'];
        let vtd= (vt.day < 10 ? '0' : '')+(vt.day);
        let vtm = (vt.month < 10 ? '0' : '')+(vt.month);
        let ca = this.addcouponform.value.competition;
// ca.forEach((c,i) => {
//   console.log('competition_id['+i+']',c.id);
// })
// return;

let couponddata = new FormData();
ca.forEach((c,i) => {
  // let key =    'competition_id['+i+']'
  // coupon_data['competition_id['+i+']'] = c.id;
  couponddata.append('competition_id['+i+']',c.id);
   })
couponddata.append('coupon',this.addcouponform.value.coupon);
couponddata.append('code',this.addcouponform.value.code);
couponddata.append('valid_from',vfd+'-'+vfm+'-'+vf.year);
couponddata.append('valid_to',vtd+'-'+vtm+'-'+vt.year);
couponddata.append('coupon_type',this.addcouponform.value.coupon_type);
couponddata.append('coupon_value',this.addcouponform.value.coupon_value);
couponddata.append('min_cart_amount',this.addcouponform.value.min_cart_amount);
couponddata.append('max_redeem_amount',this.addcouponform.value.max_redeem_amount);
couponddata.append('is_active',this.addcouponform.value.is_active);
  //       let coupon_data = {
  // coupon:this.addcouponform.value.coupon,
  // code:this.addcouponform.value.code,
  // valid_from:vfd+'-'+vfm+'-'+vf.year,
  // valid_to:vtd+'-'+vtm+'-'+vt.year,
  // coupon_type:this.addcouponform.value.coupon_type,
  // coupon_value:this.addcouponform.value.coupon_value,
  // min_cart_amount:this.addcouponform.value.min_cart_amount,
  // max_redeem_amount:this.addcouponform.value.max_redeem_amount,
  // is_active:this.addcouponform.value.is_active,
  //       }
      
        // console.log(coupon_data);
        // return;
        this.isLoading = true;
      this.ds.postRecords('coupon',couponddata,true).subscribe(res => {
        this.isLoading = false;
        if(res['validation_errors']){
          this.toastr.error(res['validation_errors'].valid_to, 'Error', {
            progressBar:true
          });
          return;
        }else if(res['status'] == 'SUCCESS'){
          Swal.fire({
            title: 'Success',
            text: 'Coupon Relaunch Successfully',
            icon: 'success',
            confirmButtonText: 'OK',
          }).then((result) => {
            if (result.value) {
              this.router.navigateByUrl('/coupon');
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              // this.router.navigateByUrl('/register');
            }
          })
        }
      },error => {
        this.isLoading = false;
        console.log(error);
      })
    }
  }
  }

  
  onDateChanged(event,text_date) {
    // let {date, jsDate, formatted, epoc} = event.singleDate;
    // console.log(event['singleDate'])
    if(text_date == 'valid_from'){
      this.addcouponform.controls['valid_from'].setValue(event.singleDate.formatted);
      let start_date = event['singleDate'].date;
      console.log(start_date.day,start_date.month,start_date.year)
      // this.myDatePickerOptions = {
      //    dateRange: false,
      //    dateFormat: 'dd-mm-yyyy',
      //    disableUntil: {day:start_date.day - 1,month: start_date.month,year: start_date.year}
      //  };
      //    this.myDatePickerOptions1 = {
      //    dateRange: false,
      //    dateFormat: 'dd-mm-yyyy',
      //    disableUntil: {day:start_date.day - 1,month: start_date.month,year: start_date.year}
      //  };
       if (Number(start_date.day) - 1 == 0) {
        let actualDate = new Date(Number(new Date(start_date.year + "-" + start_date.month + "-" + start_date.day)) - 1);
        this.myDatePickerOptions1.disableUntil.day = actualDate.getDate();
        this.myDatePickerOptions1.disableUntil.month = actualDate.getMonth() + 1;
        this.myDatePickerOptions1.disableUntil.year = actualDate.getFullYear();
      } else {
        this.myDatePickerOptions1.disableUntil.day = Number(start_date.day) - 1;
        this.myDatePickerOptions1.disableUntil.month = Number(start_date.month);
        this.myDatePickerOptions1.disableUntil.year = Number(start_date.year);
      }
      this.addcouponform.controls['valid_to'].setValue({isRange: false, singleDate: {date: { 
        year: start_date.year,
        month: start_date.month, 
        day: start_date.day
      }}});
    }else if(text_date == 'valid_to'){
      this.addcouponform.controls['valid_to'].setValue(event.singleDate.formatted);
      let end_date = event['singleDate'].date;
      //   this.myDatePickerOptions = {
      //    dateRange: false,
      //    dateFormat: 'dd-mm-yyyy',
      //    disableUntil: {day:end_date.day - 1,month: end_date.month,year: end_date.year}
      //  };
      //  this.addcouponform.controls['valid_from'].setValue({isRange: false, singleDate: {date: { 
      //   year: end_date.year,
      //   month: end_date.month, 
      //   day: end_date.day
      // }}});
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
  
  
  
  onDateRange(checked: boolean): void {
    // this.model = null;
    let copy = this.getCopyOfOptions();
    copy.dateRange = checked;
    this.myDatePickerOptions = copy;
  }

  getCopyOfOptions(): IAngularMyDpOptions {
    return JSON.parse(JSON.stringify(this.myDatePickerOptions));
  }

  
  numberOnly(evt): boolean {
    // const charCode = (event.which) ? event.which : event.keyCode;
    // if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    //   return false;
    // }
    // return true;

    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57))
      return false;


  }

  randomnumber(){
  
    var val = this.randomString(4,'1A2B');
    this.addcouponform.controls['code'].setValue(val);
  }


randomString(len, charSet) {
  charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var randomString = '';
  for (var i = 0; i < len; i++) {
      var randomPoz = Math.floor(Math.random() * charSet.length);
      randomString += charSet.substring(randomPoz,randomPoz+1);
  }
  return randomString;
}


onSelectAll(eve){

}

onItemSelect(e){

}

onItemDeSelect(e){

}
onCheck(e){

}

}
