import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import { Router, NavigationEnd } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-sold-out',
  templateUrl: './sold-out.component.html',
  styleUrls: ['./sold-out.component.css']
})
export class SoldOutComponent implements OnInit {
  logininfo:any;
  mySubscription: any;
  competitiondata = [];
  soldoytarray = [];
  upcomming = [];
  morecompetiton = [];
  competiondata:any;
  image_url:any;
  isloading:boolean = false;
  emptyfeatuiredarraydata:boolean = false;
  salepriceshow:boolean = false;
  salediscountdata = [];
  constructor(private ds: DataserviceService,private router: Router,private ref: ChangeDetectorRef) { 
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
    this.image_url = this.ds.getiamgeAPI();
    // console.log(this.logininfo);
  this.isloading =true;
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
        this.soldoytarray =   this.competitiondata.filter(res => res.sold == 'true');
        console.log(this.soldoytarray);
       

        // if(this.soldoytarray.length <= 0){
        //   this.emptyfeatuiredarraydata = true;
        //   this.isloading = false;
        }
        

        


      },error => {

    });
  }

  ngOnInit(): void {
  }

}
