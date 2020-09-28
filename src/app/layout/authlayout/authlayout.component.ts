import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  badgecls:string;
  subMenu:Array<any>;
}
declare global {
  interface Window {
    registerEvents: any;
  }
}
export const ROUTES: RouteInfo[] = [
  { path: '/my-account', title: 'Account Detail',  icon: 'fa fa-user', class: '',badgecls:'',subMenu:[] },
  { path: '/my-ticket', title: 'My Tickets',  icon:'fa fa-ticket', class: '',badgecls:'',subMenu:[] },
  { path: '/my-transaction', title: 'My Transactions',  icon:'fa fa-ticket', class: '',badgecls:'',subMenu:[] },
  { path: '/testimonials-list', title: 'Testimonials',  icon:'fa fa-image', class: '',badgecls:'',subMenu: [] },
  // { path: '/wallet', title: 'Wallet',  icon:'fa fa-ticket', class: '' },
  { path: '/my-freetickets', title: 'Free Tickets',  icon:'fa fa-ticket', class: '',badgecls:'',subMenu:[] },
  { path: '/change-password', title: 'Change Password',  icon:'fa fa-key', class: '',badgecls:'',subMenu:[] },
  { path: '/login', title: 'Logout',  icon:'fa fa-lock', class: '',badgecls:'',subMenu:[] }
];

export const Admin_ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard',  icon:'fa fa-tachometer', class: '',badgecls:'',subMenu:[] },
  { path: '/users', title: 'Users',  icon:'fa fa-users', class: '',badgecls:'',subMenu:[] },
  { path: '/competitions', title: 'Competitions',  icon:'fa fa-ticket', class: '' ,badgecls:'',subMenu:[]},
  { path: '/rollover-competition', title: 'Notification',  icon:'fa fa-bell', class: '',badgecls:'badge badge-light',subMenu: [] },
  { path: '/sale-discount-list', title: 'Sale Discount',  icon:'fa fa-percent', class: '',badgecls:'',subMenu:[] },
  { path: '/free-ticket', title: 'Free Ticket',  icon:'fa fa-ticket', class: '',badgecls:'',subMenu:[] },
  { path: '/draw-results', title: 'Live Draws',  icon:'fa fa-ticket', class: '',badgecls:'',subMenu:[] },
  { path: '/winner', title: 'Winner',  icon:'fa fa-trophy', class: '' ,badgecls:'',subMenu:[]},
  { path: '/coupon', title: 'Coupon',  icon:'fa fa-gift', class: '',badgecls:'',subMenu:[] },
  { path: '/blog-list', title: 'Blog',  icon:'fa fa-image', class: '',badgecls:'',subMenu:[] },
  { path: '/testimonialstable', title: 'Testimonials',  icon:'fa fa-image', class: '',badgecls:'',subMenu:[] },
  { path: '', title: 'Report',  icon:'fa fa-image', class: 'dropdown-btn',badgecls:'',subMenu: [
    { path: '/coupon-report', title: 'Coupon Reports',  icon:'fa fa-file', class: '' },
  { path: '/daily-sale-report', title: 'Sales Discount Reports',  icon:'fa fa-file', class: '' },
  { path: '/freetickets-report', title: 'Free Tickets Reports',  icon:'fa fa-file', class: '' },
  { path: '/sales-report', title: 'Sales Reports',  icon:'fa fa-file', class: '' }
  ] },
  // { path: '/trustpoilot', title: 'Trustpilot',  icon:'fa fa-ticket', class: '' },
  // { path: '/livedraw', title: 'Live Draw',  icon:'fa fa-ticket', class: '' },
  { path: '/questionslist', title: 'Questions',  icon:'fa fa-question-circle', class: '',badgecls:'',subMenu:[] },
  { path: '/login', title: 'Logout',  icon:'fa fa-key', class: '',badgecls:'',subMenu:[] }
];

@Component({
  selector: 'app-authlayout',
  templateUrl: './authlayout.component.html',
  styleUrls: ['./authlayout.component.css']
})
export class AuthlayoutComponent implements OnInit {
  @Input() masterArray : string[];
  public menuItems: any[];
  public isCollapsed = true;
  logininfo:any
  mySubscription: any;
  rolloverarray = [];
  rollovercompetitionlength:number = 0;
  constructor(private router:Router,private location:Location,private ds: DataserviceService) {
    
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
    setTimeout(() => {
      window.registerEvents.dropdown();
    },0);
    this.ds.scrollToTop(2000);
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
    if(!this.logininfo){
      // this.router.navigateByUrl('/home');
    }else if(this.logininfo['success'].role == 1){
      this.menuItems = Admin_ROUTES.filter(menuItem => menuItem);      
    }else{
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    }
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
   });
   this.getrolloverdata();
  }

  getrolloverdata(){
    this.ds.getmethod('rollovernotification',this.logininfo['success']['token']).subscribe(res => {
      console.log(res);
      // this.isloading =false;
     if(res['status'] == 'SUCCESS'){
 let filterticket = [];
       let data  = res['data'];
       data.forEach(r => {
 this.rolloverarray.push({competition:r.competition,
   id:r.competition_id,start_date:r.start_date});
       })
this.rollovercompetitionlength = this.rolloverarray.length;
   }
   });
 }

  routingpath(path){
    console.log(path);
    // return;
    if(path == '/login'){
      this.mySubscription.unsubscribe();
this.ds.logout();
    }else{
      this.router.navigateByUrl(path);
    }
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

}
