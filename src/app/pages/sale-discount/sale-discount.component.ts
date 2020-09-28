import { Component, OnInit } from '@angular/core';
import { FormsModule, FormControl, FormArray, FormGroup, Validator, FormBuilder, Validators } from '@angular/forms';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import { ToastrService } from 'ngx-toastr';
import { Location, } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import * as $ from 'jquery';
import Swal from 'sweetalert2'
import { MovingDirection } from 'angular-archwizard';
import { error } from 'protractor';
import { IAngularMyDpOptions, IMyDateModel, IMyCalendarViewChanged, IMyRangeDateSelection, AngularMyDatePickerDirective } from 'angular-mydatepicker';
import * as moment from 'moment';
import { truncate } from 'fs';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-sale-discount',
  templateUrl: './sale-discount.component.html',
  styleUrls: ['./sale-discount.component.css'],
  providers: []
})
export class SaleDiscountComponent implements OnInit {
  isselectcompetitiondate = false;
  noactivecompetiton = false;
  isSubmitted = false;
  isLoading = false;
  salediscountform: FormGroup;
  public date = new Date();
  competitionarray = [];
  competitiondate = [];
  sale_price: any;
  salediscount_id: any;
  competition_id: any;
  salediscountupdatebtn: boolean = false;
  salesavebtn: boolean = true;
  logininfo: any;
  salediscountdata = [];
  isloading: boolean = false;

  public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd-mm-yyyy',
    disableDateRanges: [{ begin: { year: 2000, month: 1, day: 1 }, end: { year: 2030, month: 12, day: 31 } }]


  };
  constructor(private Activate: ActivatedRoute, private http: HttpClient, private fb: FormBuilder,
    private location: Location, private ds: DataserviceService,
    private toastr: ToastrService, private router: Router) {
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
    this.salediscountform = this.fb.group({
      competition: ['', Validators.required],
      // competition_date:['',Validators.required],
      // discount_price:['',Validators.required]
    })
    this.getcompetitons_data();
    this.Activate.queryParams.subscribe(res => {
      this.salediscount_id = res.id;
      this.competition_id = res.competition_id;
     
      // this.getsalediscount_data()
      // this.getcompetitons_data();
    });
    if (this.salediscount_id) {
       this.getsalediscount_data()
      this.salesavebtn = false;
      this.salediscountupdatebtn = true;
    }

  }

  ngOnInit(): void {

  }

  get formControls() { return this.salediscountform.controls; }

  getsalediscount_data() {
    this.ds.getmethod('discount/' + this.salediscount_id, this.logininfo['success']['token']).subscribe(res => {
      if (res['success']['status'] == 'success') {
        let data = res['success'].data;
        this.salediscountform.addControl('competitiondate', new FormArray([]));
        this.salediscountform.controls['competition'].setValue(data[0].competition_id);
        this.isselectcompetitiondate = true;
        let selectdate = this.salediscountform.get('competitiondate') as FormArray;
        selectdate.push(
          this.fb.group({
            id: new FormControl(data[0].id),
            date: new FormControl(data[0].sale_date),
            change_discount: new FormControl(),
            discount_type: new FormControl(data[0].discount, [Validators.required]),
            discount_price: new FormControl(data[0].value)
          })
        )
      }
    });

  }

  change_competition(e) {
    let cid = e.target.value;
    this.isloading = true;
    this.isselectcompetitiondate = false;
    this.noactivecompetiton = false;
    this.ds.getmethod('saledetails/' + cid, this.logininfo['success']['token']).subscribe(res => {
      console.log(res + 'emptyresult');

      if (res['success']['status'] == 'success') {
        let data = res['success'].data;
        if (data == '' || data != '') {
          data.forEach(s => {
            let disc_type = '';
            let sdd = [];
            this.salediscountdata.push({ id: s.id, sale_date: s.sale_date, value: s.value, discount_type: disc_type, competition: s.competition })

          });
          setTimeout(() => {
            this.competitiondate = [];
            let id = e.target.value;
            let ctdata = this.competitionarray.filter(c => c.id == id);
            // console.log(ctdata);
            this.sale_price = ctdata[0].ticket_price;
            // console.log(ctdata[0].draw_start_date_time,ctdata[0].draw_end_date_time);
            // let sdate = moment(ctdata[0].draw_start_date_time,'YYYY-DD-MM');
            // let edate = moment(ctdata[0].draw_end_date_time,'YYYY-DD-MM');
            let sdate = ctdata[0].draw_start_date_time.split('-');
            let edate = ctdata[0].draw_end_date_time.split('-');
            var day, month;
            if (edate[0] < 10) {
              day = '0' + edate[0];
            } else {
              day = '' + edate[0];
            }
            if (edate[1] < 10) {
              month = '0' + edate[1];
            } else {
              month = '' + edate[1];
            }
            let sd = sdate[2] + '-' + sdate[1] + '-' + sdate[0];
            let ed = edate[2] + '-' + month + '-' + day;
            // console.log(ctdata[0].draw_start_date_time,ctdata[0].draw_end_date_time);
            // console.log(sd,ed)



            // console.log(new Date(moment(sd).format('YYYY-DD-MM')));
            let array_date = this.getDateArray(new Date(moment(sd).format('YYYY-MM-DD')), new Date(moment(ed).format('YYYY-MM-DD')));
            // console.log(array_date,'array sale date');
            // console.log(this.salediscountdata,'discount array sale date');
            let asale_date;
            let saledate;
            let pushdate = [];
            let sale_date = Array.from(this.salediscountdata, (x) => x.sale_date);
            pushdate = array_date.filter(val => !sale_date.includes(val));
            console.log(pushdate);
              
            let now = new Date();
            let date = now.getDate();
            let mon = now.getMonth() + 1;
            let year = now.getFullYear();
            let am, ad;
            if (date < 10) {
              ad = '0' + date;
            } else {
              ad = date;
            }
            if (mon < 10) {
              am = '0' + mon;
            } else {
              am = '' + mon;
            }
            let now_date = year + '-' + am + '-' + ad;
            let filter_date = pushdate.filter(d => {
              let bd = d.split('-');
              let dsd = bd[2] + '-' + bd[1] + '-' + bd[0];
              if (new Date(now_date) <= new Date(dsd)) {
                return d;
              }

            });
            if (filter_date.length <= 0) {
              this.isselectcompetitiondate = false;
              this.noactivecompetiton = true;
              this.isloading = false;
            } else {
              this.isselectcompetitiondate = true;
            }
            console.log(filter_date, 'filterdate');
            filter_date.forEach((d, i) => {
              //  console.log(d);
              let datearr = d.split('-');
              let rplace = /^0+/;
              let date = datearr[0].replace(rplace, '');

              let month = datearr[1].replace(rplace, '');
              this.competitiondate.push({ year: parseInt(datearr[2]), month: parseInt(month), day: parseInt(date) })
            })
            // console.log(parseInt(date)+'replace')
            this.myDatePickerOptions = {
              dateRange: false,
              dateFormat: 'dd-mm-yyyy',
              disableDateRanges: [{ begin: { year: 2000, month: 1, day: 1 }, end: { year: 2030, month: 12, day: 31 } }],
              enableDates: this.competitiondate
            };
            this.salediscountform.addControl('competitiondate', new FormArray([]));
            let selectdate = this.salediscountform.get('competitiondate') as FormArray;
            for (let i = selectdate.length - 1; i >= 0; i--) {
              selectdate.removeAt(i)
            }
            // console.log(array_date);

            filter_date.forEach(date => {

              let sdate = date.split('-');
              let sd = sdate[0] + '-' + sdate[1] + '-' + sdate[2];

              let now = new Date();
              let dat = now.getDate().toString();
              let month: any = now.getMonth() + 1;

              if (dat < '10') {
                dat = '0' + dat;
              } else {
                dat = dat;
              }
              if (month < 10) {
                month = '0' + month;
              } else {
                month = month;
              }
              this.isselectcompetitiondate = true;
              // this.noactivecompetiton =false;
              // console.log(moment().format('DD-MM-YYYY'),moment(date).format('DD-MM-YYYY'),);
              let sale_price;

              let sfd = this.salediscountdata.filter(sd => sd.sale_date == date);
              console.log(sfd);
              if (sfd.length > 0) {
                sale_price = sfd[0].value;
              } else {
                sale_price = ctdata[0].ticket_price;
              }
              this.isloading = false;
             
           

     
                  selectdate.push(
                    this.fb.group({
                      date: new FormControl(date),
                      change_discount: new FormControl(),
                      discount_type: new FormControl('1', [Validators.required]),
                      discount_price: new FormControl(sale_price)
                    })
                  )
                
                
            
             
              
              
             



            });

            //   else{
            // this.isselectcompetitiondate = false;
            // this.noactivecompetiton =true;
            //   }





            // selectdate.controls['discount_price'].disable();
            // let arrdata = this.salediscountform.get('competitiondate') as FormArray;
            // arrdata.controls['discount_price'].dis;
            // this.salediscountform.controls['early_club'].disable();
            // console.log(this.competitiondate)
          }, 2000);

        }
      }
    });




  }

  save_salediscount() {

    this.isSubmitted = true;
    if (this.salediscountform.invalid) {
      return;
    } else {
      let compet = this.salediscountform.get('competitiondate') as FormArray;
      // compet.controls.forEach((x,i) => {
      //   console.log(this.sale_price);
      // if(x.get('discount_price').value > this.sale_price){
      //   this.toastr.error('The discount price should be less then sales price', 'Error', {
      //     progressBar:true
      //   });
      //   return;
      // }
      // })
      const salediscountform = new FormData();
      salediscountform.append('competition_id', this.salediscountform.value.competition);
      let competition = this.salediscountform.get('competitiondate') as FormArray;
      let errorstatus = 0;
      competition.controls.forEach((c, i) => {
        let discount_price = 0;

        if (competition.controls[i].get('discount_price').value <= 0) {
          this.toastr.info('The discount price should be greater then 0.', 'Info', {
            progressBar: true
          });
          errorstatus += 1;
          return false;
        }
        if (competition.controls[i].get('discount_type').value == 1) {
          // alert(competition.controls[i].get('discount_price').value+' '+this.sale_price);
          if (Number(competition.controls[i].get('discount_price').value) > Number(this.sale_price)) {
            this.toastr.info('The discount price should be less then the sale price.', 'Info', {
              progressBar: true
            });
            errorstatus += 1;
            return false;
          } else {
            discount_price = Number(this.sale_price) - Number(competition.controls[i].get('discount_price').value);
            // if(discount_price > this.sale_price){
            //   this.toastr.info('The discount price should be less then sales price.', 'Info', {
            //         progressBar:true
            //       });
            //       return false;
            // }
          }
        } else if (competition.controls[i].get('discount_type').value == 2) {
          let dp = Number(this.sale_price) * Number(competition.controls[i].get('discount_price').value);
          discount_price = dp / 100;
          if (discount_price == this.sale_price) {
            this.toastr.info('Should be percentage less then 100.', 'Info', {
              progressBar: true
            });
            errorstatus += 1;
            return false;
          } else if (Number(competition.controls[i].get('discount_price').value) > 100) {
            this.toastr.info('Should be percentage discount price less then 100.', 'Info', {
              progressBar: true
            });
            errorstatus += 1;
            return false;
          }
        }
        // console.log(this.sale_price);

        if (competition.controls[i].get('change_discount').value == true) {
          // console.log(c.value.date);
          salediscountform.append('data[' + i + '][sale_date]', c.value.date);
        }
        if (competition.controls[i].get('change_discount').value == true) {
          salediscountform.append('data[' + i + '][discount]', c.value.discount_type);
        }
        if (competition.controls[i].get('change_discount').value == true) {
          salediscountform.append('data[' + i + '][value]', c.value.discount_price);
        }
      })
      console.log(errorstatus);
      // return;
if(errorstatus == 0){
      this.isLoading = true;
      this.ds.postRecords('discount', salediscountform, true).subscribe(res => {
        this.isLoading = false;
        if (res['status'] == 'SUCCESS') {
          Swal.fire({
            title: 'Success',
            text: res['message'],
            icon: 'success',
            confirmButtonText: 'OK',
          }).then((result) => {
            if (result.value) {
              this.router.navigateByUrl('/sale-discount-list');
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              // this.router.navigateByUrl('/register');
            }
          })
        }
      }, error => {
        this.isLoading = false;
        console.log(error);
      })
    }
    }

  }


  update_salediscount(saleddata) {
    console.log(saleddata);
    // return;
    this.isSubmitted = true;
    if (this.salediscountform.invalid) {
      return;
    } else {
      let datas = saleddata;
      let discount_price = 0;
      if (datas.value.discount_price <= 0) {
        this.toastr.info('The discount price should be greater then 0.', 'Info', {
          progressBar: true
        });
        return false;
      }

      if (datas.value.discount_type == 1) {
        if (datas.value.discount_price > this.sale_price) {
          this.toastr.info('The discount price should be less then the sale price.', 'Info', {
            progressBar: true
          });
          return false;
        } else {
          discount_price = Number(this.sale_price) - Number(datas.value.discount_price);
          // if(discount_price > this.sale_price){
          //   this.toastr.info('The discount price should be less then sales price.', 'Info', {
          //         progressBar:true
          //       });
          //       return false;
          // }
        }
      } else if (datas.value.discount_type == 2) {
        let dp = Number(this.sale_price) * Number(datas.value.discount_price);
        discount_price = dp / 100;
        if (discount_price == this.sale_price) {
          this.toastr.info('Should be percentage less then 100.', 'Info', {
            progressBar: true
          });
          return false;
        } else if (discount_price > 100) {

        }
      }

      let data = {
        id: this.salediscount_id,
        competition_id: this.salediscountform.value.competition,
        sale_date: datas.value.date,
        discount: datas.value.discount_type,
        value: datas.value.discount_price

      }
      // console.log(data);
      // return;
      this.isLoading = true;
      this.ds.postRecords('discount/' + data.id, data).subscribe(res => {
        this.isLoading = false;
        console.log(res);
        if (res['success'].status == 'success') {
          Swal.fire({
            title: 'Success',
            text: res['message'],
            icon: 'success',
            confirmButtonText: 'OK',
          }).then((result) => {
            if (result.value) {
              this.router.navigateByUrl('/sale-discount-list');
              // this.router.navigateByUrl('/view-salediscount');
              //   const navigationExtras = {
              //     queryParams: {
              //         id: this.competition_id 
              //     }
              // };
              // this.router.navigate(['/view-salediscount'], navigationExtras);
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              // this.router.navigateByUrl('/register');
            }
          })
        }
      }, error => {
        this.isLoading = false;
        console.log(error);
      })
    }
  }
  getcompetitons_data() {
    this.ds.apigetmethod('competitions').subscribe(res => {
      if (res['success']['status'] == 'success') {
        let competitionarray = [];
        let data = res['success']['data'];
        let unique = {};
        let distinct = [];
        data.forEach(u => {
          let cd = moment().format('YYYY-MM-DD');
          let sd = moment(u.draw_start_date_time,'DD-MM-YYYY').format('YYYY-MM-DD');  
          // moment().format('DD-MM-YYYY') >= u.draw_start_date_time
          if(u.sold == 'false' && moment(sd).isSameOrBefore(cd) == true && u.is_featured == 1){
            if (!unique[u.id]) {
              this.competitionarray.push({
                id: u.id, image: u.image, competition: u.competition, description: u.description,
                draw_start_date_time: u.draw_start_date_time, draw_end_date_time: u.draw_end_date_time, draw_month: u.draw_month,
                draw_year: u.draw_year, sale_price: u.sale_price, ticket_price: u.ticket_price
              });
              unique[u.id] = true;
            }
          }
        })
        console.log(this.competitionarray);
        // this.competitionarray =competitionarray;
      }
    }, error => {

    });
  }

  onDateChanged(event, text_date) {
    // let {date, jsDate, formatted, epoc} = event.singleDate;
    // console.log(event['singleDate'])
    if (text_date == 'start_date') {
      // this.competitionform.controls['draw_start_date_time'].setValue(event.singleDate.formatted);
      let start_date = event['singleDate'].date;
      // this.myDatePickerOptions2 = {
      //    dateRange: false,
      //    dateFormat: 'dd-mm-yyyy',
      //    disableUntil: {day:start_date.day - 1,month: start_date.month,year: start_date.year}
      //  };
    } else if (text_date == 'end_date') {
      // this.competitionform.controls['draw_end_date_time'].setValue(event.singleDate.formatted);
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
    // let copy = this.getCopyOfOptions();
    // copy.dateRange = checked;
    // this.myDatePickerOptions = copy;
  }



  discountchange(e, index) {
    let selectdate = this.salediscountform.get('competitiondate') as FormArray;
    if (e.target.checked == true) {
      selectdate.controls[index].get('discount_price').enable();
    } else {
      selectdate.controls[index].get('discount_price').disable();
    }
  }

  getDateArray(start, end) {
    // console.log(start + end);
    var arr = new Array();
    var dt = new Date(start);
    while (dt <= end) {
      arr.push(moment(dt).format('DD-MM-YYYY'));
      dt.setDate(dt.getDate() + 1);
    }
    return arr;
  }

  discountchangeprice_all(e) {
    if (e.target.checked == true) {
      let competition = this.salediscountform.get('competitiondate') as FormArray;
      competition.controls.forEach((c, i) => {
        if (competition.controls[i].get('discount_price').enabled) {
          // console.log(c.value);
        }

      })
      // selectdate.controls[index].get('discount_price').enable();
    } else {
      //  selectdate.controls[index].get('discount_price').disable();
    }
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

}
