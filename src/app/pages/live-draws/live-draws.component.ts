import { Component, OnInit } from '@angular/core';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';

@Component({
  selector: 'app-live-draws',
  templateUrl: './live-draws.component.html',
  styleUrls: ['./live-draws.component.css']
})
export class LiveDrawsComponent implements OnInit {
  issold:boolean =false;
  isloading:boolean = false;
  competitiondata = [];
  featuredarraydata = [];
  upcomming = [];
  logininfo:any;
  image_url:any;
  morecompetiton:any;
livedrawarray = [];
soldcompetitionarray = [];
isLoading:boolean =false;
emptylivedrawarray:boolean = false;
  constructor(private ds: DataserviceService,private router:Router,private toastr: ToastrService) { 
    // console.log(moment().format('llll'));
    // console.log(moment('2020-07-04').format('llll'));
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
    this.image_url = this.ds.getiamgeAPI();
    this.getdrawresult_data();
    this.ds.apigetmethod('competitions').subscribe(res => {
      this.isloading =false;
      if(res['success']['status'] == 'success'){
        let feature_data = [];
        let data = res['success']['data'];
  
        this.competitiondata.forEach((c,i) => {
let edate = c.draw_end_date_time.split('-');
let ded = edate[2]+'-'+edate[1]+'-'+edate[0];
this.timercount(ded,i);
// console.log(moment(ded).format('llll'));
// c.is_featured == 1 && moment().format('DD-MM-YYYY') >= c.draw_start_date_tim
          if(c.sold == 'true'){
    this.soldcompetitionarray.push({id:c.id,image:c.image,ticket_price:c.ticket_price,sale_price:c.sale_price,competition:c.competition,description:c.description,
    draw_start_date_time:c.draw_start_date_time,draw_end_date_time:c.draw_end_date_time,draw_month:c.draw_month,
    draw_year:c.draw_year,is_active:c.is_active,is_cashdraw:c.is_cashdraw,is_draft:c.is_draft,is_drawn:c.is_drawn,
    is_featured:c.is_featured,draw_time:moment(ded).format('llll')})
          }
        })
    
  
      }
    },error => {
      this.isloading =false;
    });
  }

  ngOnInit(): void {
  
  }

  
  getdrawresult_data(){
    this.isLoading = true;
    this.ds.apigetmethod('results').subscribe(res => {
      this.isLoading=false;
      if(res['success']['status'] == 'success'){
        let data = res['success']['data'];
        if(data == ''){
          this.emptylivedrawarray =true;
        }else {
          this.emptylivedrawarray =false;
        // console.log(data);
        data.forEach((d,i) => {
          let edate = d.result_date.split('-');
          let splittime = d.result_time.split(' ');
          // alert(splittime);
        let convert_time = this.getTwentyFourHourTime(d.result_time);
        // console.log(convert_time+'changetime');
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
          // console.log(time+':'+min + 'timeonly');
let ded = new Date(edate[2]+'-'+edate[1]+'-'+edate[0]+' '+time+':'+min);

this.timercount(ded,i);
let check_after = moment(ded).isAfter(moment().format('llll'));
if(check_after === true){
  d.islivedraw_finish = false;
}else{
  d.islivedraw_finish = true;
}

// console.log(moment(ded).format('llll'));
          this.livedrawarray.push({id:d.id,competition_id:d.competition_id,competition:d.competition,
            image:this.image_url+d.image,result_date:d.result_date,
            result_time:d.result_time,draw_time:moment(ded).format('llll'),islivedraw_finish:d.islivedraw_finish});
            
          
        })
        if(this.livedrawarray.length < 0){
          this.emptylivedrawarray =true;
        }
      }
// this.competitionarray =competitionarray;
      }
    },error => {
      this.isloading =false;
    });
  }

  getsoldcompetition(){
    this.ds.apigetmethod('competitions').subscribe(res => {
      this.isloading =false;
      if(res['success']['status'] == 'success'){
        let feature_data = [];
        let data = res['success']['data'];
        data.forEach(c => {
          this.competitiondata.push({id:c.id,image:this.image_url+c.image,ticket_price:c.ticket_price,sale_price:c.sale_price,competition:c.competition,description:c.description,
          draw_start_date_time:c.draw_start_date_time,draw_end_date_time:c.draw_end_date_time,draw_month:c.draw_month,
          draw_year:c.draw_year,is_active:c.is_active,is_cashdraw:c.is_cashdraw,is_draft:c.is_draft,is_drawn:c.is_drawn,
          is_featured:c.is_featured,sold:c.sold}) 
        })
        this.competitiondata.forEach(c => {
          // c.is_featured == 1 && moment().format('DD-MM-YYYY') >= c.draw_start_date_time
          if(c.sold == 'true'){
this.livedrawarray.push({id:c.id,image:c.image,ticket_price:c.ticket_price,sale_price:c.sale_price,competition:c.competition,description:c.description,
  draw_start_date_time:c.draw_start_date_time,draw_end_date_time:c.draw_end_date_time,draw_month:c.draw_month,
  draw_year:c.draw_year,is_active:c.is_active,is_cashdraw:c.is_cashdraw,is_draft:c.is_draft,is_drawn:c.is_drawn,
  is_featured:c.is_featured,sold:c.sold})
          }
        })
      }
    },error => {
      this.isloading =false;
    });
  }

  timercount(end_date,index){
    var date_future,date_now,seconds,minutes,hours,days;
      var calcNewYear = setInterval(() => {
        // console.log(new Date('2020-06-24').getFullYear()+1);
          date_future = new Date(end_date);          
          date_now = new Date();
          // console.log(end_date+'enddate',date_now+'noedate');
          var difference = date_future.getTime() - date_now.getTime();
          // console.log(difference);
          if(difference < 0){

            $('#day_'+index).text('00');
            $('#hours_'+index).text('00');
            $('#minuts_'+index).text('00');
            $('#sec_'+index).text('00');
            clearInterval(calcNewYear);
            return false;
          }else{
          seconds = Math.floor((date_future - (date_now))/1000);
          minutes = Math.floor(seconds/60);
          hours = Math.floor(minutes/60);
          days = Math.floor(hours/24);
          
          hours = hours-(days*24);
          minutes = minutes-(days*24*60)-(hours*60);
          seconds = seconds-(days*24*60*60)-(hours*60*60)-(minutes*60);
        // console.log(days,hours);
   
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
         
          $('#day_'+index).text(days);
          $('#hours_'+index).text(hours);
          $('#minuts_'+index).text(minutes);
          $('#sec_'+index).text(seconds);

          if(minutes != '00' && minutes <= 10 && seconds != '00'){
            $('#days_'+index).hide();
            $('#hrs_'+index).hide();
            
          }
        } 
          
          // + " Hours: " + hours + " Minutes: " + minutes + " Seconds: " + seconds);
      },1000);
    }

   getTimeRemaining(endtime) {
    // console.log(Date.parse(endtime),'parse',moment(endtime).format('DD-MM-YYYY'))
var t = Date.parse(endtime) - Date.parse('2020-06-22');
var seconds = Math.floor((t / 1000) % 60);
var minutes = Math.floor((t / 1000 / 60) % 60);
var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
var days = Math.floor(t / (1000 * 60 * 60 * 24));
return {
'total': t,
'days': days,
'hours': hours,
'minutes': minutes,
'seconds': seconds
};
}

 initializeClock(id, endtime) {
  var clock = document.getElementById(id);
  // var daysSpan = clock.querySelector('.days');
  // var hoursSpan = clock.querySelector('.hours');
  // var minutesSpan = clock.querySelector('.minutes');
  // var secondsSpan = clock.querySelector('.seconds');

  function updateClock() {
    var t:any = this.getTimeRemaining(endtime);
// console.log(t.days);
// console.log(t.hours);
// console.log(t.minutes);
// console.log(t.seconds);

    // daysSpan.innerHTML = t.days;
    // hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
    // minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
    // secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

    if (t.total <= 0) {
      clearInterval(timeinterval);
    }
  }

  updateClock();
  var timeinterval = setTimeout(() => {updateClock() },1000);
}

livedraw_details(data){
//   const navigationExtras = {
//     queryParams: {
//         id: data.id  
//     }
// };
// console.log(data);
this.ds.live_draw_data(data);
this.router.navigate(['/live-draw-details']);

}

getTwentyFourHourTime(amPmString) { 
  var d = new Date("1/1/2013 " + amPmString); 
  return d.getHours() + ':' + d.getMinutes(); 
}

}
