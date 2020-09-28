import { Component, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import { Router, NavigationEnd } from '@angular/router';
import { error } from 'protractor';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { DataprocessService } from 'src/app/dataservice/dataprocess.service';

declare global {
  interface Window {
    registerEvents: any;
  }
}
export const ROUTES = [
  { path: '/home', title: 'Home',  icon: '', class: '',submenu:[],style:'padding-left:0px',badgeclass:'' },
  { path: '/active-competitions', title: 'Competitions',  icon:'', class: '', submenu:[
    { path: '/active-competitions', title: 'Active Competitions',  icon: '', class: '' },
    { path: '/sold-out', title: 'Sold Out',  icon: '', class: '' },
    { path: '/live-draws', title: 'Live Draws',  icon: '', class: '' },
    { path: '/winners-podium', title: 'Winner Podium',  icon: '', class: '' }
  ],style:'padding-left:0px',badgeclass:'' },
  { path: '/how_to_play', title: 'How to play',  icon:'', class: '',submenu:[],style:'padding-left:0px',badgeclass:'' },
  { path: '/blog', title: 'Blog',  icon:'', class: '',submenu:[],style:'padding-left:0px',badgeclass:'' },
  { path: '/viewtestimonials', title: 'Testimonials',  icon:'', class: '',submenu:[],badgeclass:'' },
  { path: '/my-account', title: 'My Account',  icon:'', class: '',submenu:[],style:'padding-left:0px',badgeclass:'' },
  { path: '/cart', title: 'Cart',  icon:'fa fa-cart-arrow-down', class: 'cartli',subclass:'cart',submenu:[],style:'padding-left:0px',substyle:'background-color: #000000 !important;color: #fff !important',badgeclass:'badge badge-light cart-badge-position'}
];

export const NORMAL_ROUTES = [
  { path: '/home', title: 'Home',  icon: '', class: '',submenu:[], style:'padding-left:0px',badgeclass:'' },
  { path: '/active-competitions', title: 'Competitions',  icon:'', class: '', submenu:[
    { path: '/active-competitions', title: 'Active Competitions',  icon: '', class: '' },
    { path: '/sold-out', title: 'Sold Out',  icon: '', class: '' },
    { path: '/live-draws', title: 'Live Draws',  icon: '', class: '' },
    { path: '/winners-podium', title: 'Winner Podium',  icon: '', class: '' }
  ],style:'padding-left:0px',badgeclass:'' },
  { path: '/how_to_play', title: 'How to play',  icon:'', class: '',submenu:[],style:'padding-left:0px',badgeclass:'' },
  { path: '/blog', title: 'Blog',  icon:'', class: '',submenu:[],style:'padding-left:0px',badgeclass:'' },
  { path: '/viewtestimonials', title: 'Testimonials',  icon:'', class: '',submenu:[],badgeclass:'' },
  { path: '/login', title: 'Login',  icon:'', class: 'main-button',submenu:[],subclass:'auth',badgeclass:'',style:'padding-left:0px' },
  { path: '/register', title: 'Register',  icon:'', class: 'main-button',subclass:'auth',submenu:[],badgeclass:'',style:'padding-left:0px'}
];




@Component({
  selector: 'app-login-header',
  templateUrl: './login-header.component.html',
  styleUrls: ['./login-header.component.css']
})
export class LoginHeaderComponent implements OnInit {

  public menuItems: any[];
  logininfo:any;
  countcart:any = []
  cart_data:any;
  length_cart:number = 0;
  mySubscription: any;
  constructor(private ds: DataserviceService,private router:Router,private location:Location,private dps: DataprocessService) { 
    // alert('test login header');
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
    if(!this.logininfo){
      this.menuItems = NORMAL_ROUTES.filter(menuItem => menuItem);
    }else{
      this.menuItems = ROUTES.filter(menuItem => menuItem);
    }

    this.cart_data = this.dps.competition_details();
    if(this.cart_data){
    let cartdata = [];
this.cart_data.forEach(c => {
cartdata.push({booking_number:c.booking_number,competition_id:c.competition_id,copetition:c.copetition,
  id:c.id,ticket_number:c.ticket_number,sale_price:c.sale_price,user_id:c.user_id})
  })
this.length_cart = cartdata.length;
// console.log('remaindata'+this.masterArray());

}
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
    window.registerEvents.toogolenavbar();
  }


  get masterArray() { 
    return this.ds.competition_details; 
 } 

 ngOnDestroy() {
  if (this.mySubscription) {
    this.mySubscription.unsubscribe();
  }
}

}
