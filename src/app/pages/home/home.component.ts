import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import { Router, NavigationEnd } from '@angular/router';
import * as moment from 'moment';
import { ApiconfigService } from 'src/app/dataservice/apiconfig.service';

declare global {
  interface Window {
    registerEvents: any;
  }
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  logininfo:any;
  mySubscription: any;
  competitiondata = [];
  featuredarraydata = [];
  upcomming = [];
  morecompetiton = [];
  competiondata:any;
  image_url:any;
  testimo_image_url:any;
  isloading:boolean = false;
  emptyfeatuiredarraydata:boolean = false;
  salepriceshow:boolean = false;
  salediscountdata = [];
  testimonialsarray = [];
  testimonialsstorearray = [];
  showfeaturedcompetition:boolean = false;
  showupcomingcompetition:boolean = false;
  showpreviouswinner:boolean = false;
  showtestimonials:boolean = false;
  showwinnerdata:boolean = false;
  showslider:boolean = false;
  isshowmainslider:boolean = false;
  sliderarray = [];
  constructor(private ds: DataserviceService,private router: Router,private ref: ChangeDetectorRef,private api:ApiconfigService) { 
    this.ds.scrollToTop(2000);
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
      }
    });
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));


    // console.log(this.logininfo);
  this.isloading =true;
    setTimeout(() => {
      this.getcompetitionarray();
      this.image_url = this.ds.getiamgeAPI();
      this.testimo_image_url = this.ds.gettestmoamgeurl();
    },1000)


    // let sale_status = 0;
    // this.salediscountdata.forEach(sd => {
    //   console.log(moment().format('DD-MM-YYYY'), sd.sale_date,'test');
    //   if(moment().format('DD-MM-YYYY') == sd.sale_date){
    //     sale_status = 1;
    //     // this.competition_status ="Sale Discount";
    //     // this.statusclabelcompetiton = "Sale For"
    //     this.saleprice = sd.value;
    //     var saled = sd.sale_date.split('-');
    //     let splitdate = saled[2]+'-'+saled[1]+'-'+saled[0];
    //     var compareDate = new Date(splitdate);
    //     compareDate.setDate(compareDate.getDate()+1); //just for this demo today + 7 days
    //     timers = setInterval(() =>{
    //       timeBetweenDates(compareDate);
    //     }, 1000);
    //   }
    // })
    
  }
    
  

  ngOnInit(): void {
    this.ds.scrollToTop(2000);
    window.registerEvents.slick();
    // console.log(this.salediscountdata);
    setTimeout(() => {
    this.testimonialsdata();
  },1000);
  }

  getcompetitionarray(){
    this.ds.apigetmethod('competitions').subscribe(res => {
      this.isloading =false;
      if(res['success']['status'] == 'success'){
        let feature_data = [];
        let data = res['success']['data'];
        data.forEach(c => {
          this.competitiondata.push({id:c.id,image:this.image_url+c.image,ticket_price:c.ticket_price,sale_price:c.sale_price,competition:c.competition,description:c.description,
          draw_start_date_time:c.draw_start_date_time,draw_end_date_time:c.draw_end_date_time,draw_month:c.draw_month,
          draw_year:c.draw_year,is_active:c.is_active,is_cashdraw:c.is_cashdraw,is_draft:c.is_draft,is_drawn:c.is_drawn,
          is_featured:c.is_featured,sold:c.sold,discount_status:c.discount_status,discount_price:c.discount_price,discount_type:c.discount_type,
          is_slider:c.is_slider}) 
        })
        this.competitiondata.forEach(c => {
          let discountprice;
          let cd = moment().format('YYYY-MM-DD');
          let sd = moment(c.draw_start_date_time,'DD-MM-YYYY').format('YYYY-MM-DD'); 
          console.log(cd,sd);
          console.log((moment(sd).isSameOrBefore(cd)));         
          if(c.sold == 'false' && moment(sd).isSameOrBefore(cd) == true && c.is_featured == 1){
            if(c.discount_type == '2'){
             let per = c.ticket_price * c.discount_price;
             let div = per/ 100
             let fixed = c.ticket_price - div;
            discountprice = fixed.toFixed(2);
            
             
            // this.saleprice =  data[0].ticket_price - per_val;
            }else{
            let dis_price = c.ticket_price -c.discount_price;
            discountprice = dis_price.toFixed(2);    
          }
this.featuredarraydata.push({id:c.id,image:c.image,ticket_price:c.ticket_price,sale_price:c.sale_price,competition:c.competition,description:c.description,
  draw_start_date_time:c.draw_start_date_time,draw_end_date_time:c.draw_end_date_time,draw_month:c.draw_month,
  draw_year:c.draw_year,is_active:c.is_active,is_cashdraw:c.is_cashdraw,is_draft:c.is_draft,is_drawn:c.is_drawn,
  is_featured:c.is_featured,sold:c.sold,discount_status:c.discount_status,discount_price:discountprice,
  is_slider:c.is_slider})
          }
        })

        if(this.featuredarraydata.length <= 0){
          this.emptyfeatuiredarraydata = true;
          this.isloading = false;
          this.showfeaturedcompetition = false;
        }else{
          this.showfeaturedcompetition = true;
        }

        this.featuredarraydata.forEach((fc,i) => {
          let img_src = '';
          if(fc.is_slider == 1){
            img_src = fc.image;
          }else{
            img_src = 'assets/img/smd/logo.png';
          }
          let sdate = fc.draw_start_date_time.split('-');
let sd = sdate[2]+'-'+sdate[1]+'-'+sdate[0];
          if(i <= 4){
this.sliderarray.push({id:fc.id,image:img_src,sd:moment(sd).format('llll'),competition:fc.competition})
          }
        
          })

          if(this.sliderarray.length <= 0){
// this.showslider = false;
this.isshowmainslider = true;
          }else{
            // alert(this.sliderarray.length);
            // this.showslider = true;
            this.isshowmainslider = true;
          }
      
        console.log(this.sliderarray);

        this.competitiondata.forEach(c => {
          let cd = moment().format('YYYY-MM-DD');
          let sd = moment(c.draw_start_date_time,'DD-MM-YYYY').format('YYYY-MM-DD'); 
          console.log(cd,sd);
          console.log((moment(sd).isSameOrAfter(cd)));
          if(moment(sd).isAfter(cd) == true){
            this.upcomming.push({id:c.id,image:c.image,ticket_price:c.ticket_price,sale_price:c.sale_price,competition:c.competition,description:c.description,
              draw_start_date_time:c.draw_start_date_time,draw_end_date_time:c.draw_end_date_time,draw_month:c.draw_month,
              draw_year:c.draw_year,is_active:c.is_active,is_cashdraw:c.is_cashdraw,is_draft:c.is_draft,is_drawn:c.is_drawn,
              is_featured:c.is_featured})
          }
        })

        if(this.upcomming.length <= 0){
          this.isloading = false;
          this.showupcomingcompetition = false;
        }else{
          this.showupcomingcompetition = true;
        }

  this.morecompetiton =   this.competitiondata.filter(res => res.is_featured == 0);
  
// this.competitiondata = feature_data;
// console.log(this.featuredarraydata);;
      }
      this.ds.scrollToTop(2000);
    },error => {

    });
  }

  testimonialsdata(){
    this.isloading = true;
    this.ds.apigetmethod('testimonials').subscribe(res => {
      this.isloading = false;
      if(res['success']['status'] == 'success'){
        let data = res['success']['data'];
        if(data == ''){
          // this.emptytestimonialsdata = true;
              this.isloading = false;
        }else{
          let couponarray = [];
          data.forEach((t,i) => { 
            this.testimonialsstorearray.push({id:t.id,image:this.testimo_image_url+t.image,title:t.title,description:t.description,
              competition:t.competition,name:t.name,status:t.status});          
          })

          let tma = this.testimonialsstorearray.filter(t => t.status == 1);
          tma.forEach((ft,i) => {
if(i <= 2){
  this.testimonialsarray.push({id:ft.id,image:ft.image,title:ft.title,description:ft.description,
    competition:ft.competition,name:ft.name,status:ft.status}); 
}
          })

          if(this.testimonialsarray.length <= 0){
            this.isloading = false;
            this.showtestimonials = false;
          }else{
            this.showtestimonials = true;
          }
        }
        this.ds.scrollToTop(2000);
              }
    },error => {
      // console.log(error);
      // this.emptytestimonialsdata = true;
      this.isloading = false;
    })
  }


  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }




  competitions_details(data){
    // this.ds.getdata(data);
    // console.log(data);
    const navigationExtras = {
      queryParams: {  
          id: data.id, 
      }
  };
this.router.navigate(['/competition-details'], navigationExtras);
    // this.router.navigateByUrl('/competition-details');
    // console.log(data);
  }

 

}
