import { Component, OnInit, QueryList, ViewChildren, ViewChild } from '@angular/core';
import { FormsModule, FormControl, FormArray, FormGroup, Validator, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import { error } from 'protractor';
import { ToastrService } from 'ngx-toastr';
import { Location, DecimalPipe } from '@angular/common';
import Swal from 'sweetalert2'
import * as $ from 'jquery';
import * as moment from 'moment';
import { IAngularMyDpOptions, IMyDateModel, IMyCalendarViewChanged, IMyRangeDateSelection, AngularMyDatePickerDirective } from 'angular-mydatepicker';
import { isEmpty } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CountryService } from 'src/app/dataservice/country.service';
import { Country } from './../country';
import { Competition } from './../competition';
import { SortableDirective, SortEvent } from './../../layout/adminlayout/sortable.directive';
import { SortColumn, SortDirection } from './../../layout/adminlayout/sortable.directive';
import { Injectable, PipeTransform } from '@angular/core';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { DataTableDirective } from 'angular-datatables';
import { async } from '@angular/core/testing';





@Component({
  selector: 'app-competitions',
  templateUrl: './competitions.component.html',
  styleUrls: ['./competitions.component.css'],
  providers: [CountryService, DecimalPipe]
})
export class CompetitionsComponent implements OnInit {


  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _countries$ = new BehaviorSubject<Country[]>([]);
  private _total$ = new BehaviorSubject<number>(0);






  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  isSubmitted: boolean = false;
  isloading: boolean = false;
  emptycompetitiondata: boolean = false;
  logininfo: any;
  competitionsdata: any;
  filtercompetitionarray = [];
  image_url: any;
  editvedioform: FormGroup;
  editdateform: FormGroup;
  public date = new Date();
  timers:any;
  video_competition_id:any;
  video_id:any;
  public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd-mm-yyyy',
    disableUntil: { day: this.date.getDate() - 1, month: this.date.getMonth() + 1, year: this.date.getFullYear() }
  };
  public myDatePickerOptions1: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd-mm-yyyy',
    disableUntil: { day: this.date.getDate() - 1, month: this.date.getMonth() + 1, year: this.date.getFullYear() }
  };
  constructor(private fb: FormBuilder, private location: Location, private router: Router,
    private ds: DataserviceService, private toastr: ToastrService, public service: CountryService) {

    // console.log(this.service.countriecompetitionss$,'competitiondata');
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
    if (!this.logininfo || this.logininfo['success']['role'] != 1) {
      this.router.navigateByUrl('/login');
    }
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    }
    this.getcompetitiondata();
    this.image_url = this.ds.getiamgeAPI();


    this.editdateform = this.fb.group({
      competition_id: [''],
      draw_start_date_time: ['', Validators.required],
      draw_end_date_time: ['', Validators.required]
    });


    this.editvedioform = this.fb.group({
      id:[''],
      competition_id: [''],
      video_url: ['', Validators.required]
    })


  }

  ngOnInit(): void {
    var time = moment().format('hh:mm:ss');
    let ct = moment.duration(time);
    console.log(time)
    var date = moment().format('YYYY-MM-DD hh:mm:ss');
    let d = moment(date);
    
    let mtime = d.subtract(ct); 
    
    console.log(mtime);
  }

  nextButtonClickEvent(): void {
    //do next particular records like  101 - 200 rows.
    //we are calling to api

    // console.log('next clicked')
  }

  get formControls() { return this.editdateform.controls; }

  get vediocontrol() { return this.editvedioform.controls; }


  async getcompetitiondata() {
    // console.log(this.image_url);
    this.isloading = true;

    this.ds.getmethod('competitions', this.logininfo['success']['token']).subscribe(async res => {

      if (res['success']['status'] == 'success') {
        let data = res['success']['data'];
        // console.log(data,'data');
        let array = [];
        if (data == '') {
          this.emptycompetitiondata = true;
          this.isloading = false;
        } else {
          let competition = [];
          let soldfalsecompetition = [];
          let filterdatecompetition = [];
          data.forEach((c, i) => {
            // let ticketstatus;

            // this.ds.getmethod('status/'+c.id,this.logininfo['success']['token']).subscribe(status => {
            //  let ticketstatus = status['success'];
            //  console.log(ticketstatus);
            if (c.ticket_price != null) {
              competition.push({
                id: c.id,competition_id:c.competition_id,image: this.image_url + c.image, competition: c.competition, description: c.description, draw_start_date_time: c.draw_start_date_time,
                draw_end_date_time: c.draw_end_date_time, draw_month: c.draw_month, draw_year: c.draw_year, is_active: c.is_active,
                is_cashdraw: c.is_cashdraw, is_draft: c.is_draft, is_drawn: c.is_drawn, is_featured: c.is_featured, sold: c.sold, available_tickets: c.available_tickets
              })
              //  totalTickets:ticketstatus.totalTickets,availableTickets:ticketstatus.availableTickets
            }
            //  })

          })

          soldfalsecompetition = competition.filter(val => {
            // console.log(moment().format('DD-MM-YYYY') , moment(val.draw_end_date_time).format('MM-DD-YYYY'))
            if (val.sold == 'false') {
              return val;
            }

          });
          console.log(soldfalsecompetition, 'soldfalsedata');
          soldfalsecompetition.forEach((sc, i) => {
            // console.log(sc.draw_end_date_time);
            console.log(sc.draw_end_date_time);
            let edate = sc.draw_end_date_time.split('-');
            let ded = edate[2] + '-' + edate[1] + '-' + edate[0];
          //   var calcNewYear = setInterval(() => {
          //  this.timers = this.timercount(ded, i, sc.id, sc);
          //  console.log('test');
          //   },1000);

          })
          this.competitionsdata = competition;
          this.dtTrigger.next();
          this.isloading = false;
         
        }
      }
    }, error => {

    });
  }

  timercount(end_date,index,c_id,cd){
    var date_future,date_now,seconds,minutes,hours,days;
     
        // console.log(new Date('2020-06-24').getFullYear()+1);
          date_future = new Date(end_date);          
          date_now = new Date();
          // console.log(end_date+'enddate',date_now+'noedate');
          var difference = date_future.getTime() - date_now.getTime();
          // console.log(difference);
          if(difference < 0){
            clearInterval(this.timers);
           
          }else{
          seconds = Math.floor((date_future - (date_now))/1000);
          minutes = Math.floor(seconds/60);
          hours = Math.floor(minutes/60);
          days = Math.floor(hours/24);
          
          hours = hours-(days*24);
          minutes = minutes-(days*24*60)-(hours*60);
          seconds = seconds-(days*24*60*60)-(hours*60*60)-(minutes*60);
        
   
          if(days == 1 && hours == 12){
            
            this.toastr.info('Competition Status', 'Info', {
              disableTimeOut:true,
              progressBar:true,
              closeButton:true
            });
          }else{
            // console.log(days,hours);
          }
          
          // console.log('#day_'+index,days)
          if (days < 10){
            days = '0' + days;
          }else{
            days = ''+days;
          }
          if (hours < 10){
            hours = '0' + hours;
          }else{
            hours = ''+hours;
          }
          if (minutes < 10){
            minutes = '0' + minutes;
          }else{
            minutes = ''+minutes;
          }
          if (seconds < 10){
            seconds = '0' + seconds;
          }else{
            seconds = ''+seconds;
          }
          console.log(days,hours,minutes,seconds);
          
          if(days == '00' && hours <= '12'){
            
            console.log(cd);
            
          }
        } 
          
          // + " Hours: " + hours + " Minutes: " + minutes + " Seconds: " + seconds);
      
    }

  delete_competition(data) {
    console.log(data.id)
    this.ds.deleterecord('competition/' + data.id).subscribe(res => {
      if (res['success'].status == 'success') {
        Swal.fire({
          title: 'Deleted',
          text: res['success'].message,
          icon: 'success',
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.value) {
            // this.competitionsdata = [];
            //  this.getcompetitiondata();

            this.router.navigateByUrl('/competitions', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/competitions']);
            });
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            this.router.navigateByUrl('/register');
          }
        })

      }
    }, error => {
      console.log(error);
    })
  }

  editdate(data) {
    this.ds.getmethod('showDays/' + data.id, this.logininfo['success']['token']).subscribe(res => {
      if (res['success'].status == "success") {
        console.log(res['success']['data'].draw_start_date_time);
        let sdate = res['success']['data'].draw_start_date_time.split('-');
        let edate = res['success']['data'].draw_end_date_time.split('-');
        let sd = sdate[0] + '-' + sdate[1] + '-' + sdate[2];
        let ed_split = edate[0] + '-' + edate[1] + '-' + edate[2];
        let rplace = /^0+/;
        let date = sdate[0].replace(rplace, '');
        let month = sdate[1].replace(rplace, '');
        let ed = edate[0].replace(rplace, '');
        let em = edate[1].replace(rplace, '');

        this.editdateform.controls['competition_id'].setValue(data.id);
        this.editdateform.controls['draw_start_date_time'].setValue({
          isRange: false, singleDate: {
            date: {
              year: sdate[2],
              month: month,
              day: date
            }
          }
        });
        this.editdateform.controls['draw_end_date_time'].setValue({
          isRange: false, singleDate: {
            date: {
              year: edate[2],
              month: em,
              day: ed
            }
          }
        });
        // this.editdateform.setValue(res['success'].data);

      }
    }, error => {
      console.log(error);
    })
  }


  editvedio(data) {
    this.ds.getmethod('video/' + data.competition_id, this.logininfo['success']['token']).subscribe(res => {
      jQuery('#editvediomodal').modal('show');
      if (res['success'].status == "success") {
        this.editvedioform.controls['id'].setValue(res['success']['data'].id);
        this.editvedioform.controls['competition_id'].setValue(res['success']['data'].competition_id);
        this.editvedioform.controls['video_url'].setValue(res['success']['data'].video_url);

        // this.editdateform.setValue(res['success'].data);

      }else if(res['success'].status == 'failed'){
        // alert(data.id);
        this.video_id = data.id;
        this.video_competition_id = data.competition_id;
        // this.editvedioform.controls['competition_id'].setValue(data.id);
        this.toastr.error(res['success'].message, 'Error', {
          progressBar:true
        });
        return;
      }

    }, error => {
      console.log(error);
    })
  }

  updatevedio() {
    console.log(this.editvedioform.value.competition_id);
    this.isSubmitted = true;
    if (this.editvedioform.invalid) {
      return
    } else if(this.editvedioform.value.id) {
      this.ds.postRecords('video/' + this.editvedioform.value.id, this.editvedioform.value, this.logininfo['success']['token']).subscribe(res => {
        if (res['success'].status == "success") {
          Swal.fire({
            title: 'Success',
            text: res['success'].message,
            icon: 'success',
            confirmButtonText: 'OK',
          }).then((result) => {
            if (result.value) {
              this.competitionsdata = [];
              this.getcompetitiondata();
              $('.modal').removeClass('in');
              $('.modal').attr('aria-hidden', 'true');
              $('.modal').css('display', 'none');
              $('.modal-backdrop').remove();
              $('body').removeClass('modal-open');
              this.router.navigateByUrl('/competitions');
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              this.router.navigateByUrl('/competitions');
            }
          })
        }
      }, error => {
        console.log(error);
      })
    } else {
      this.editvedioform.controls['competition_id'].setValue(this.video_competition_id);
      this.ds.postRecords('video', this.editvedioform.value, this.logininfo['success']['token']).subscribe(res => {
        if (res['status'] == "SUCCESS") {
          Swal.fire({
            title: 'Success',
            text: res['message'],
            icon: 'success',
            confirmButtonText: 'OK',
          }).then((result) => {
            if (result.value) {
              // this.competitionsdata = [];
              // this.getcompetitiondata();
            
              $('.modal').removeClass('in');
              $('.modal').attr('aria-hidden', 'true');
              $('.modal').css('display', 'none');
              $('.modal-backdrop').remove();
              $('body').removeClass('modal-open');
              this.router.navigateByUrl('/competitions', { skipLocationChange: true }).then(() => {
                this.router.navigate(['/competitions']);
              });
              // this.router.navigateByUrl('/competitions');
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              this.router.navigateByUrl('/competitions');
            }
          })
        }
      }, error => {
        console.log(error);
      })
    }
  }


  update_date() {
    this.isSubmitted = true;
    let update_start_date = this.editdateform.value.draw_start_date_time;
    let sdate = update_start_date['singleDate']['date'];
    let update_end_date = this.editdateform.value.draw_end_date_time;
    let edate = update_end_date['singleDate']['date'];
    let data = {
      competition_id: this.editdateform.value.competition_id,
      draw_start_date_time: sdate.day + '-' + sdate.month + '-' + sdate.year,
      draw_end_date_time: edate.day + '-' + edate.month + '-' + edate.year,
    }
    this.ds.postRecords('updateDays/' + this.editdateform.value.competition_id, data, this.logininfo['success']['token']).subscribe(res => {
      if (res['success'].status == "success") {
        Swal.fire({
          title: 'Success',
          text: res['success'].message,
          icon: 'success',
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.value) {
            this.competitionsdata = [];
            this.getcompetitiondata();
            $('.modal').removeClass('in');
            $('.modal').attr('aria-hidden', 'true');
            $('.modal').css('display', 'none');
            $('.modal-backdrop').remove();
            $('body').removeClass('modal-open');
            this.router.navigateByUrl('/competitions');
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            this.router.navigateByUrl('/competitions');
          }
        })
      }
    }, error => {
      console.log(error);
    })

  }

  rollover(data) {
    console.log(data);
    let selectcompetition_data = data;
    let end_date = selectcompetition_data.draw_end_date_time;
    let sdate = end_date.split('-');
    let sd = sdate[2] + '-' + sdate[1] + '-' + sdate[0];
    var dates = new Date(sd);
    console.log(dates.getDate())
    dates.setDate(dates.getDate() + 6);
    Swal.fire({
      title: 'Info',
      text: "Do you change rollover ?",
      icon: 'info',
      confirmButtonText: 'Go',
      cancelButtonText: 'Drop',
      showCancelButton: true,
    }).then((result) => {
      if (result.value) {
        console.log(selectcompetition_data);
        let data = {
          "competition_id": selectcompetition_data.id,
          "rollover_start_date": moment(selectcompetition_data.draw_end_date_time).format('YYYY-DD-MM'),
          "rollover_end_date": moment(dates).format('YYYY-MM-DD'),
        };
        this.ds.postRecords('rollover/' + selectcompetition_data.id, this.logininfo['success']['token']).subscribe(res => {
          if (res['success'].status == 'success') {
            Swal.fire({
              title: 'Success',
              text: res['success'].message,
              icon: 'success',
              confirmButtonText: 'OK',
            }).then((result) => {
              if (result.value) {
                this.router.navigateByUrl('/competitions', { skipLocationChange: true }).then(() => {
                  this.router.navigate(['/competitions']);
                });
              } else if (result.dismiss === Swal.DismissReason.cancel) {
                // this.router.navigateByUrl('/register');
              }
            })
          }
        }, error => {
          console.log(error);
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    })
  }

  onDateChanged(event, text_date) {
    // let {date, jsDate, formatted, epoc} = event.singleDate;
    // console.log(event['singleDate'])
    if (text_date == 'start_date') {
      this.editdateform.controls['draw_start_date_time'].setValue(event.singleDate.formatted);
      let start_date = event['singleDate'].date;
      console.log(start_date.day, start_date.month, start_date.year)
      // this.myDatePickerOptions = {
      //    dateRange: false,
      //    dateFormat: 'dd-mm-yyyy',
      //    disableUntil: {day:start_date.day - 1,month: start_date.month,year: start_date.year}
      //  };
    } else if (text_date == 'end_date') {
      this.editdateform.controls['draw_end_date_time'].setValue(event.singleDate.formatted);
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

  edit_competition(data) {
    const navigationExtras = {
      queryParams: {
        id: data.id
      }
    };
    this.router.navigate(['/edit-competition'], navigationExtras);
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

  onChange(e) {
    console.log(e);
  }


  // ngAfterViewInit(): void {
  //   this.dtTrigger.next();
  // }

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

  view_ticketstatus(data) {
    const navigationExtras = {
      queryParams: {
        id: data.id
      }
    };
    this.router.navigate(['/view-ticket-status'], navigationExtras);
  }

  nullify(data) {
    console.log(data.id)
    this.ds.postRecords('nullify/' + data.id, this.logininfo['success']['token']).subscribe(res => {
      if (res['success'].status == 'success') {
        Swal.fire({
          title: '',
          text: res['success'].message,
          icon: 'success',
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.value) {

          } else if (result.dismiss === Swal.DismissReason.cancel) {
            this.router.navigateByUrl('/register');
          }
        })

      }
    }, error => {
      console.log(error);
    })
  }


}
