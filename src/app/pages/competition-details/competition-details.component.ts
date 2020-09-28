import { Component, OnInit } from '@angular/core';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import {NgbProgressbarConfig} from '@ng-bootstrap/ng-bootstrap';
import { Observable,timer } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import Swal from 'sweetalert2'
import * as $ from 'jquery';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { DataprocessService } from 'src/app/dataservice/dataprocess.service';


declare global {
  interface Window {
    registerEvents: any;
  }
}
@Component({
  selector: 'app-competition-details',
  templateUrl: './competition-details.component.html',
  styleUrls: ['./competition-details.component.css'],
  styles: [`
  .progress-outer {
    width: 96%;
    margin: 10px 2%;
    padding: 3px;
    background-color: red;
    border: 1px solid #dcdcdc;
    color: #fff;
    border-radius: 20px;
    text-align: center;
  }
  .progress-inner {
    min-width: 15%;
    min-height:18px;
    white-space: nowrap;
    overflow: hidden;
    padding: 0px;
    border-radius: 20px;
`],
providers: [NgbProgressbarConfig]
})
export class CompetitionDetailsComponent implements OnInit {
  sale_status:boolean = false;;
  statusclabelcompetiton = "Live Draw";
  sale_label = "SALE"
  loading: boolean;
  total = 100;
  competition_details:any;
  countdownTimer:any;
  width : any=0;
  leters:any;
  codearray:any;
  logininfo:any;
  openmodal:boolean = true;
  competition_id:any;
  ticket_data :any;
  ticketarray = [];
  atokenarray = [];
  selectedticketarray:Array<any>;
  selectticketarray_data = [];
  userdata = {id:0};
  select_competition:any;
  competition_name:any;
  image_url:any;
  competition_image:any;
  isLoading:boolean = false;
fromdate:string;
todate:string;
luckydip_data :any = [];
cart_data = [];
image:any;
discription:any;
available_left = '';
available_totaltickets = '';
offset : number = 0;
mySubscription: any;
saleprice:any;
ticketprice:any;
p: number = 1;
alphabeet;  
pageOfItems:Array<any>;
ticket = [];
page = 1;
pageSize =100;
selectedticketlength;
math = Math;
items = [];
salediscountdata = [];
config: any;
collection = { count: 100, data: [] };
sliderimage_array = [];
ticketpriceshow:boolean =true;  
ifsoldalltickets:boolean = true;
salepriceshow:boolean = true;
ticket_price:any;
timers:any;
isSold:any;
book_tickets = [];
  constructor(private dps: DataprocessService,private Activate: ActivatedRoute,private location: Location,private router: Router,private ds: DataserviceService,private toastr: ToastrService) {
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
    this.image_url = this.ds.getiamgeAPI();
    this.competition_details =  this.dps.competition_details();

    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    
    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
      }
    });
    this.Activate.queryParams.subscribe(res => {
      this.competition_id = res.id;
      this.isLoading =true;
      this.ds.apigetmethod('ticket?competition_id='+res.id).subscribe(res => {
        this.isLoading =false;
        if(res['success']['status'] == 'success'){
          let data  = res['success']['data'];
          // this.selectedticketarray =res['success']['data'];
          
          data.forEach(t => {
            // console.log(t);
this.ticketarray.push(t);
          });
          let unique = {};
          let distinct = [];
          this.ticketarray.forEach((x) => {
            // console.log(x)
         if (!unique[x.alphabet]) {
           distinct.push({ 'id': x.id, 'alphabet': x.alphabet });
           unique[x.alphabet] = true;
         }
        });
        this.alphabeet = distinct;
        // console.log(this.alphabeet);
        this.ticketarray = res['success']['data']; 
        }
// let selectarr = [];
this.selectedticketarray =  this.ticketarray.filter(x => x.alphabet == 'A');
if(this.competition_details){
let loop = setInterval(() => {
  for(let i=0; i< this.selectedticketarray.length; i++) {
    // alert('test');
    // this.cart_data.forEach(bt => {
      for(let j=0; j< this.competition_details.length; j++) {
      // alert(this.cart_data[j].booking_number +'-'+this.selectedticketarray[i].booking_number)
      if(this.competition_details[j].booking_number == this.selectedticketarray[i].booking_number){
        // alert($("#"+bt.booking_number))
        $("#"+this.competition_details[j].booking_number+'_'+this.competition_details[j].competition_id).addClass('clicked')
      }
    }
  }
  clearInterval(loop);
},0);
}
// this.competition_details.forEach(bt=> {
//   this.book_tickets.push({booking_number:bt.booking_number,competition:bt.competition,competition_id:bt.competition_id,
//     id:bt.id,image:bt.image,sale_price:bt.sale_price,status:bt.status,ticket_price:bt.ticket_price,user_id:bt.user_id})
// })
// console.log(this.selectedticketarray);
// console.log(Math.round(this.selectedticketarray.length / 100),'chepagina');
// let data = this.getPaginatedUsers();
// console.log(data);
        // this.ticket_data.forEach((l,i) => {
        //   //  console.log(l);
        //     if(l.alphabet == 'A'){
        //        this.selectedticketarray.push(l)
        //     }
        //     })
            this.loading =false;


            
            // if ($(".blogBox:hidden").length != 0) {
            //   $("#loadMore").show();
            // } 
      });

      this.ds.apigetmethod('images?competition_id='+res.id).subscribe(res => {
        if(res['success']['status'] == 'success'){
          let data  = res['success']['data'];
          data.forEach(i => {
            this.sliderimage_array.push({id:i.id,competition_id:i.competition_id,image_url:this.image_url+'/'+this.competition_id+'/'+i.image_url})
          })
          // console.log(this.sliderimage_array);
        }

      });

 
        


      


      this.ds.apigetmethod('details/'+res.id).subscribe(res => {
        if(res['success'].status == 'success'){
          
        let data = res['success']['data'];
        // console.log(data[0].sold,'testtrue')
    if(data[0].sold == 'true'){
this.ifsoldalltickets = false;
    }
        this.fromdate =  data[0].draw_start_date_time;
        this.todate =  data[0].draw_end_date_time;
this.discription =  data[0].description;
this.ticket_price = data[0].ticket_price;
this.isSold = data[0].sold;
// alert(this.isSold);
// this.saleprice =  data[0].ticket_price

        data.forEach(res => {
          // console.log('competitiondate'+res.draw_start_date_time)
          // console.log(res.competition);
          this.competition_name = res.competition
          this.competition_image = this.image_url+res.image;
          this.image = res.image;
          
        })
        
        }
      },error => {
       if(error['error']){
        this.toastr.error(error['error'].message, 'Error', {
          progressBar:true
        });
        return;
       }
       
      })

      setTimeout(() => {
        this.ds.apigetmethod('saledetails/'+res.id).subscribe(res => {
          // console.log(res);
          if(res['success']['status'] == 'success'){
      let data = res['success'].data;
      data.forEach(s => {
        let sd= s.sale_date.split('-');
        let sledate= sd[0]+'-'+sd[1]+'-'+sd[2];
          this.salediscountdata.push({id:s.id,sale_date:sledate,value:s.value,discount:s.discount,competition:s.competition})
        
      });
      let filter_sale_date = this.salediscountdata.filter(s => s.sale_date == moment().format('DD-MM-YYYY'));
      // console.log(filter_sale_date,'filtersaledate');
      let sale_date,sale_price;
      if(filter_sale_date.length > 0){
        // e competito days
        this.sale_status =true;
        sale_date =  filter_sale_date[0].sale_date.split('-');
        sale_price = filter_sale_date[0].value;
        this.salepriceshow = true;
        this.ticketpriceshow = true;
        if(filter_sale_date[0].discount == 2)
        {
         let per = this.ticket_price * sale_price / 100;
         this.ticketprice = this.ticket_price;
         let fixed = this.ticket_price - per;
         this.saleprice = fixed.toFixed(2);
        
         
        // this.saleprice =  data[0].ticket_price - per_val;
        }else{
        let dis_price = this.ticket_price - sale_price;
        this.saleprice = dis_price.toFixed(2);
        this.ticketprice = this.ticket_price;    
      }
      var saled = filter_sale_date[0].sale_date.split('-');
      let splitdate = saled[2]+'-'+saled[1]+'-'+saled[0];
      var compareDate = new Date(splitdate);
      compareDate.setDate(compareDate.getDate()+1); //just for this demo today + 7 days
      // this.timers = setInterval(() =>{
       
      //   timeBetweenDates(compareDate);
      // }, 1000);
    //  salediscount timer
      // this.timers = setInterval(() => {
      //   timercount(compareDate)
      // },1000);
      // actual live draw timer
      let sdate = this.fromdate.split('-');
      let edate = this.todate.split('-');
      let dsd = sdate[2]+'-'+sdate[1]+'-'+sdate[0];
      let ded = edate[2]+'-'+edate[1]+'-'+edate[0];
      var compareDate = new Date(dsd);
      var endate = new Date(ded+' '+23+':'+59);
      console.log(endate+'enddate');
      compareDate.setDate(endate.getDate() + 7); //just for this demo today + 7 days
      this.timers = setInterval(() =>{
        // timeBetweenDates(compareDate);
        timercount(endate)
      }, 1000);
      }else{
      // snormal competito days
//  alert(this.fromdate);
        this.ticketpriceshow = false;
        this.saleprice =  this.ticket_price;
    let sdate = this.fromdate.split('-');
    let edate = this.todate.split('-');
    let dsd = sdate[2]+'-'+sdate[1]+'-'+sdate[0];
    let ded = edate[2]+'-'+edate[1]+'-'+edate[0];
    
    let array_date = this.getDateArray(new Date(moment(dsd).format('YYYY-MM-DD')),new Date(moment(ded).format('YYYY-MM-DD')));
    
       // var compareDate = new Date();
            // var enddate = new Date(data[0].draw_end_date_time);
    
            
            // var sd = moment(data[0].draw_start_date_time).format('DD/MM/YYYY');
           
            // console.log('fromdate'+dsd);
            var compareDate = new Date(dsd);
            var endate = new Date(ded+' '+23+':'+59);
            console.log(endate+'enddate');
            compareDate.setDate(endate.getDate() + 7); //just for this demo today + 7 days
    
            this.timers = setInterval(() =>{
              // timeBetweenDates(compareDate);
              timercount(endate)
            }, 1000);
            
      }

    
  
  

 
  function timeBetweenDates(compareDate) {  
   
    var dateEntered =new Date(compareDate);
    var now = new Date();
    var difference = dateEntered.getTime() - now.getTime();
    let status;
    if (difference <= 0) {
      status =1;
      if(status == 1){
    let sd = moment(data[0].draw_end_date_time).format('DD/MM/YYYY');
    var endate = new Date(sd);
    endate.setDate(endate.getDate() + 7); //just for this demo today + 7 days
      timeBetweenDates(compareDate);

  }else{
      // console.log(''sd);
    clearInterval(this.timers);
      $("#day").text("00");
      $("#hours").text("00");
      $("#minuts").text("00");
      $("#sec").text("00");
  }
    } else {
      var seconds = Math.floor(difference / 1000);
      var minutes = Math.floor(seconds / 60);
      var hours = Math.floor(minutes / 60);
      var days = Math.floor(hours / 24);
    
      hours %= 24;
      minutes %= 60;
      seconds %= 60;
      let nodays = '';
      let counthours = '';
      let countminitus = '';
      let countsec = '';
      if (days < 10){
        nodays = '0' + days;
      }else{
        nodays = ''+days;
      }
      if (hours < 10){
        counthours = '0' + hours;
      }else{
        counthours = ''+hours;
      }
      if (minutes < 10){
        countminitus = '0' + minutes;
      }else{
        countminitus = ''+minutes;
      }
      if (seconds < 10){
        countsec = '0' + seconds;
      }else{
        countsec = ''+seconds;
      }
  // console.log('dayas'+days);
  // console.log('hour'+counthours);
  // console.log('min'+minutes);
  // console.log('sec'+seconds);
  // alert('test');

    $("#day").text(nodays);
      $("#hours").text(counthours);
      $("#minuts").text(countminitus);
      $("#sec").text(countsec);
    }

  }
  
}
        })
      },2000)
        
      function   timercount(end_date){
        var date_future,date_now,seconds,minutes,hours,days;
          
            // console.log(new Date('2020-06-24').getFullYear()+1);
              date_future = new Date(end_date);          
              date_now = new Date();
              // console.log(end_date+'enddate',date_now+'noedate');
              let now = new Date().toString();
              var difference = Date.parse(end_date) - Date.parse(now);
              // console.log(difference);
              if(difference < 0){
    
                $('#day').text('00');
                $('#hours').text('00');
                $('#minuts').text('00');
                $('#sec').text('00');
                clearInterval(this.timers);
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
              $('#day').text(days);
              $('#hours').text(hours);
              $('#minuts').text(minutes);
              $('#sec').text(seconds);
            } 
              
              // + " Hours: " + hours + " Minutes: " + minutes + " Seconds: " + seconds);
          
        }
     

      this.ds.apigetmethod('availability/'+this.competition_id).subscribe(res => {
        if(res['success'].status == 'success'){
        let avai = res['success'].data;
       this.available_left =  avai.left;
        this.available_totaltickets = avai.totalTickets;
          var elem = document.getElementById('progress_bar');
elem.style.width =  avai.totalTickets - avai.left + "%";
          
        }
      })
  
  });



    // this.runProgressBar();
 
    let code = {id:1,alphabet:'A'};

    // this.get_ticketcode(code)
  //  if(this.competition_details == undefined){
  //    this.router.navigateByUrl('/active-competitions');
  //  }

  let date = new Date('2020-06-17');


  // console.log('unix'+date.valueOf());
  //  var upgradeTime = 172801;
  //  var seconds = upgradeTime;
  //  function timer() {
  //    var days        = Math.floor(seconds/24/60/60);
  //    var hoursLeft   = Math.floor((seconds) - (days*86400));
  //    var hours       = Math.floor(hoursLeft/3600);
  //    var minutesLeft = Math.floor((hoursLeft) - (hours*3600));
  //    var minutes     = Math.floor(minutesLeft/60);
  //    var remainingSeconds = seconds % 60;
  //    function pad(n) {
  //      return (n < 10 ? "0" + n : n);
  //    }
  //    document.getElementById('day').innerHTML = pad(days);
  //    document.getElementById('hours').innerHTML = pad(hours);
  //    document.getElementById('minuts').innerHTML = pad(minutes);
  //    document.getElementById('sec').innerHTML = pad(remainingSeconds);
  //   //  + ":" + pad(hours) + ":" + pad(minutes) + ":" + pad(remainingSeconds)
  //    if (seconds == 0) {
  //      clearInterval(countdownTimer);
  //      document.getElementById('countdown').innerHTML = "Completed";
  //    } else {
  //      seconds--;
  //    }
  //  }
  //  var countdownTimer = setInterval(()=> {
  //    timer()
  //  },1000);
if(this.logininfo){
  this.get_userdata();
}





}

  ngOnInit(): void {
    this.config = {
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.collection.count
    };
    // console.log(this.salediscountdata);
    

//     const second = 1000,
//     minute = second * 60,
//     hour = minute * 60,
//     day = hour * 24;
//     let todate = moment(this.todate).format('YYYY-MM-DD')  ;
// let date = moment(this.todate).format("DD-MM-YYYY"); 
// let countDown = new Date(date).getTime(),
//   x = setInterval(() => {    

//     let now = new Date().getTime(),
//         distance = countDown - now;

//     $('#day').text(Math.floor(distance / (day)));
//       $('#hours').text(Math.floor((distance % (day)) / (hour)));
//       $('#minuts').text(Math.floor((distance % (hour)) / (minute)));
//       $('#sec').text(Math.floor((distance % (minute)) / second));

//     //do something later when date is reached
//     //if (distance < 0) {
//     //  clearInterval(x);
//     //  'IT'S MY BIRTHDAY!;
//     //}

//   }, 1000);

if(this.competition_details){
  this.competition_details.forEach(bt=> {
    this.book_tickets.push({booking_number:bt.booking_number,competition:bt.competition,competition_id:bt.competition_id,
      id:bt.id,image:bt.image,sale_price:bt.sale_price,status:bt.status,ticket_price:bt.ticket_price,user_id:bt.user_id})
  })
}
  }


  

  get_userdata(){
    this.ds.getmethod('myaccount',this.logininfo['success']['token']).subscribe(res => {
      if(res['status'] == 'success'){
     this.userdata = res['data'];
      }
    },error => {
     if(error['error']){
      this.toastr.error(error['error'].message, 'Error', {
        progressBar:true
      });
      return;
     }
     
    })
  }
  

  // runProgressBar(){
  //   Observable.timer(0,100)
  //   .takeWhile(()=>
  //      this.isWidthWithinLimit()
  //      )
  //   .subscribe(()=>{
  //     this.width=this.width+1;
  //     console.log(this.width);
  //   })
  // }

  
  isWidthWithinLimit(){
    if(this.width===50){
      return false;
    }else{
      return true;
    }
  }

  get_ticketcode(code){
    
    this.offset =0;
    this.selectedticketarray =[];
    this.selectedticketarray = this.ticketarray.filter(x => x.alphabet == code.alphabet);
    console.log(this.cart_data)
    console.log(this.selectedticketarray)
    // this.selectedticketarray.forEach(ac => {
    let loop = setInterval(() => {
    for(let i=0; i< this.selectedticketarray.length; i++) {
      // alert('test');
      // this.cart_data.forEach(bt => {
        for(let j=0; j< this.cart_data.length; j++) {
        // alert(this.cart_data[j].booking_number +'-'+this.selectedticketarray[i].booking_number)
        if(this.cart_data[j].booking_number == this.selectedticketarray[i].booking_number){
          // alert($("#"+bt.booking_number))
          $("#"+this.cart_data[j].booking_number+'_'+this.cart_data[j].competition_id).addClass('clicked')
        }
      }
    }
    clearInterval(loop);
  },0);

  let bktic = setInterval(() => {
    for(let i=0; i< this.selectedticketarray.length; i++) {
      // alert('test');
      // this.cart_data.forEach(bt => {
        for(let j=0; j< this.book_tickets.length; j++) {
        // alert(this.cart_data[j].booking_number +'-'+this.selectedticketarray[i].booking_number)
        if(this.book_tickets[j].booking_number == this.selectedticketarray[i].booking_number){
          // alert($("#"+bt.booking_number))
          $("#"+this.book_tickets[j].booking_number+'_'+this.book_tickets[j].competition_id).addClass('clicked')
        }
      }
    }
    clearInterval(bktic);
  },0);

   
    // console.log(this.selectedticketarray);
    // console.log('pushticketdaya'+this.ticket_data);
    // let data = this.getPaginatedUsers();
    // console.log('loaddat'+data);
  //   data.forEach((l,i) => {
  //     if(l.alphabet == code.alphabet){
  //        this.selectedticketarray.push(l)
  //   }
  // });
//     let codearray = [];
// for (let i = 1; i < 100; i++) {
//     let newName = {
//        name:code.name + i
//     };
//     codearray.push(newName);
// }
// this.codearray= codearray;
  }

  luckydip_check(){
    if(!this.logininfo){
      this.openmodal = false;
      Swal.fire({
        text: 'Please register for an account before selecting tickets.',
        showCancelButton: true,
        icon:'info',
        confirmButtonText: 'Login',
        cancelButtonText: 'Register'
      }).then((result) => {
        if (result.value) {
     this.router.navigateByUrl('/login');
        
        // For more information about handling dismissals please visit
        // https://sweetalert2.github.io/#handling-dismissals
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          this.router.navigateByUrl('/register');
        }
      })
    }else{
      this.ds.getdata(this.selectticketarray_data);
      this.router.navigateByUrl('/cart');
      this.selectticketarray_data = [];
    }
  }

  gotocart(){
    if(!this.logininfo){
      this.openmodal = false;
      Swal.fire({
        text: 'Please register for an account before selecting tickets.',
        showCancelButton: true,
        icon:'info',
        confirmButtonText: 'Login',
        cancelButtonText: 'Register'
      }).then((result) => {
        if (result.value) {
     this.router.navigateByUrl('/login');
        
        // For more information about handling dismissals please visit
        // https://sweetalert2.github.io/#handling-dismissals
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          this.router.navigateByUrl('/register');
        }
      })
    }else{
      this.isLoading =true;
      this.ds.getmethod('luckydip?competition_id='+this.competition_id, this.logininfo['success']['token']).subscribe(res => {
        // console.log(res);
        this.isLoading =false;
        if(res['success']['status'] == 'success'){
          this.luckydip_data = [];
          this.luckydip_data = res['success']['data'][0];
         let data =  res['success']['data'];
         console.log(this.cart_data);
         let exit_ticket = this.cart_data.filter(cd => cd.booking_number == this.luckydip_data.booking_number);
        if(exit_ticket.length ==  0){
            this.cart_data.push({id:this.luckydip_data.id,booking_number:this.luckydip_data.booking_number,
              competition:this.luckydip_data.competition,competition_id:this.luckydip_data.competition_id,
             image:this.luckydip_data.image,sale_price:this.saleprice,status:this.luckydip_data.status,
             ticket_price:this.luckydip_data.ticket_price,user_id:this.userdata.id})
        }else{
          this.toastr.info('Ticket number '+this.luckydip_data.booking_number+' already exists. please select another ticket', 'Info', {
            progressBar:true
          });
          return;
        }
        
        //  console.log(this.cart_data);
          // this.cart_data = res['success']['data'];
          this.openmodal = true;
        }else{
          this.toastr.error('No Lucky Dip Data', 'Error', {
            progressBar:true
          });
          return;
        }
      },error => {
      this.isLoading = false;
      })
      // console.log(this.cart_data);
    }
  }

  checkout(){
    // console.log(this.cart_data);
    let unique = {};
    let distinct = [];
    // let book_tickets = [];
    this.cart_data.forEach(bt => {
      if (!unique[bt.booking_number]) {
       this.book_tickets.push({booking_number:bt.booking_number,competition:bt.competition,competition_id:bt.competition_id,
          id:bt.id,image:bt.image,sale_price:bt.sale_price,status:bt.status,ticket_price:bt.ticket_price,user_id:bt.user_id})
        unique[bt.booking_number] = true;
      }
    })
   console.log(this.book_tickets,'booketickets');
    console.log(this.cart_data);
    this.dps.getdata(this.book_tickets);
    this.router.navigateByUrl('/cart');
    $('.modal').removeClass('in');
    $('.modal').attr('aria-hidden', 'true');
    $('.modal').css('display', 'none');
    $('.modal-backdrop').remove();
    $('body').removeClass('modal-open');
  }

  onchange(data){
    // console.log(data);
  }

  toggleClass(e,data,i) {
    console.log(e.target.id);
    console.log(data);
    const classList = e.target.classList;
    const classes = e.target.className;
    classes.includes('clicked') ? classList.remove('clicked') : classList.add('clicked');
    
    let id = e.currentTarget.id;
    if($('#'+id).hasClass('clicked') == true){
      // alert(this.saleprice);
    this.cart_data.push({id:data.id,competition_id: data.competition_id,ticket_number:data.ticket_number,
      booking_number:data.booking_number,sale_price:this.saleprice,ticket_price:this.ticket_price,user_id:this.userdata.id,image:this.image,competition:this.competition_name});
    }else{
      // alert('remove');
      if(this.book_tickets.length > 0){
        let j =  this.book_tickets.findIndex(x => x.id == data.id);
        this.book_tickets.splice(j,1);
      }
    let i =  this.selectticketarray_data.findIndex(x => x.id == data.id);
      this.selectticketarray_data.splice(i,1);
      let j =  this.cart_data.findIndex(x => x.id == data.id);
      this.cart_data.splice(j,1);
      
    
    console.log(this.cart_data)
  }
    // console.log(this.selectticketarray_data); 
  }

  loadMore(even){
    this.isLoading =false;
    let data = this.getPaginatedUsers();
        data.forEach((l,i) => {
          //  console.log(l);
           this.isLoading =false;
               this.selectedticketarray.push(l)
            
  });
  
}

  getPaginatedUsers() {
    // console.log('split50'+this.ticket_data);
    // console.log('offset'+this.offset);
    let tmp = this.ticket_data.slice(this.offset, this.offset + 100);
    this.offset += 100;
    return tmp;
  }

  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    this.pageOfItems = pageOfItems;
}

pageChanged(event){
  this.config.currentPage = event;
}


  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
      clearInterval(this.timers);
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


  

}
