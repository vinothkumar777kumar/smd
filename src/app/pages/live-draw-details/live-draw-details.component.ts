import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import { Router, NavigationEnd } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';

@Component({
  selector: 'app-live-draw-details',
  templateUrl: './live-draw-details.component.html',
  styleUrls: ['./live-draw-details.component.css']
})
export class LiveDrawDetailsComponent implements OnInit {
  @ViewChild('iframe') iframe: ElementRef;
  live_draw_details:any;
  draw_time:any;
  logininfo:any;
  drawresultarray = [];
  competition_id:any;
  random_select_winner:any;
  randomwinner = [];
  showwinner:boolean = false;
  mySubscription: any;
  calcNewYear:any;
  winer_ticket = '';
  winner = '';
  smdvedio:boolean = false;
  ISthewinnerzoon:boolean = false;
  constructor(private ds: DataserviceService,private router:Router,private toastr: ToastrService) { 
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
    $('#iframe').hide();
    $('#winnerdata').css('display','none');
    $('#winner').hide();

    $('#ISthewinnerzoon').hide();
    
    this.live_draw_details = this.ds.get_livedrawe_data();
    if(this.live_draw_details == undefined){
      this.router.navigateByUrl('/live-draws');
    }
    this.competition_id = this.live_draw_details.competition_id;
    let edate = this.live_draw_details.result_date.split('-');
    let ded = edate[2]+'-'+edate[1]+'-'+edate[0];
    this.timercount(this.live_draw_details.draw_time);
    // moment(this.live_draw_details).format('llll')
    console.log(this.live_draw_details,'livedraw date');
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    
    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
      }
    });
  }

  ngOnInit(): void {

    
  }

  timercount(end_date){
 
    var date_future,date_now,seconds,minutes,hours,days;
      this.calcNewYear = setInterval(() => {
        // console.log(new Date('2020-06-24').getFullYear()+1);
          date_future = new Date(end_date);          
          date_now = new Date();
          var difference = date_future.getTime() - date_now.getTime();
          $('#ISthewinnerzoon').hide();
          if(difference <= 0){
            this.showwinner = true;
            $('#winnerdata').css('display','block');
            // this.issold =true;
            $('#day').text('00');
            $('#hours').text('00');
            $('#minuts').text('00');
            $('#sec').text('00');
            clearInterval(this.calcNewYear);
            $('#winnerdata').hide();
            $('#logo').hide()
            $('#winner').hide();
            $('#winner_name').hide();
            $('#winner_tickt').hide();
            $('#ISthewinnerzoon').hide();
            this.ds.getmethod('random?competition_id='+this.competition_id,this.logininfo['success']['token']).subscribe(res => {
              if(res['success'].status == 'success'){
                this.smdvedio = true;
                $('#winnerdata').show();
            this.ISthewinnerzoon = false;
                this.random_select_winner = res['success']['data'];
                let data = res['success']['data'][0];
                setTimeout(() => {
                  $('#logo').show();
                  $('#logo').addClass('w3-animate-zoom');
                  $('#winner').show();  
                  $('#winner').addClass('w3-animate-zoom');
                },1000)
                
                setTimeout(() => {
                  $('#winner_name').show();
            $('#winner_tickt').show();
            $('#winner_name').addClass('w3-animate-zoom');
            $('#winner_tickt').addClass('w3-animate-zoom');
                  this.winner = data.name;
                  this.winer_ticket = data.booking_number;
                  
                },3000)
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
           }else{
            // this.showwinner = true;
            $('#winner_table').show();
            $('#winner').show();
            
            
            //  console.log(this.randomwinner);
            // $('#winner_name').text(this.randomwinner[0].name);
            // $('#ticket_number').text(this.randomwinner[0].booking_number);
            // $('#town').text(this.randomwinner[0].town);
            
            //   setTimeout(() => {
            //     let iframe = document.getElementById('iframe'); 
            //   let content = '<div style="text-align:center" class="w3-container w3-center w3-animate-zoom"><img src="assets/img/smd/logo.png" style="height: 100px;width:100px" /><h2 class="t1 unstyled-title text-center wow bounceInUp fadeIn animate__animated animate__bounce"  style="color:#fff">The Winner</h2><span style="color: #f5a019;" class="t2">Winner Name : </span> <span class="text-uppercase" style="color:#fff">'+this.randomwinner[0].name+'</span><br><span style="color: #f5a019;" class="end">Ticket Number : </span> <span style="color:#fff">'+this.randomwinner[0].booking_number+'</span></div>';
            //   let doc =  this.iframe.nativeElement.contentDocument  || this.iframe.nativeElement.contentWindow;
            //   doc.open();
            //   doc.write(content);
            // doc.close();
            // // this.showwinner = true;
            // $('#iframe').show();
            //   },0)
              
            
           
           }
          
                // this.addwinnerform.controls['user_id'].setValue(this.randomwinner[0].name);
            //  this.addwinnerform.controls['competition_id'].setValue(this.randomwinner[0].competition);
            //  this.addwinnerform.controls['ticket_number'].setValue(this.randomwinner[0].booking_number);
            //  this.addwinnerform.controls['town'].setValue(this.randomwinner[0].town);
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
          }else{
            $('#winnerdata').hide();
            $('#logo').hide()
                    $('#winner').hide();
                    $('#winner_name').hide();
                    $('#winner_tickt').hide();
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
         
          $('#day').text(days);
          $('#hours').text(hours);
          $('#minuts').text(minutes);
          $('#sec').text(seconds);
          if(days == '00' && hours == '00' && minutes <= 10 && seconds != '00'){
            $('#day_hide').hide();
            $('#hours_hide').hide();
            $('#ISthewinnerzoon').show();
            this.smdvedio = true;
            this.ISthewinnerzoon = true;
          }
          
          } 
          // console.log('#day_'+index,days)
          
          
          // + " Hours: " + hours + " Minutes: " + minutes + " Seconds: " + seconds);
      },1000);
    }

    ngOnDestroy() {
      if (this.mySubscription) {
        this.mySubscription.unsubscribe();
        clearInterval(this.calcNewYear);
      }
    }

    // ngAfterViewInit() {
    //   this.showwinner = true;
    //   let content = '<div><b>Name :</b> vinoth</div>';
    //   let doc =  this.iframe.nativeElement.contentDocument || this.iframe.nativeElement.contentWindow;
    //   doc.open();
    //   doc.write(content);
    //   doc.close();
    // }

}
