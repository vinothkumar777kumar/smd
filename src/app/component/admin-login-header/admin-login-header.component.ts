import { Component, OnInit } from '@angular/core';

export const ROUTES = [
  // { path: 'admin/dashboard', title: 'Dashboard',  icon: '', class: '',submenu:[],style:'padding-left:0px',badgeclass:'' },
  { path: '/admin/home', title: 'Home',  icon: '', class: '',submenu:[],style:'padding-left:0px',badgeclass:'' },
  { path: '/admin/active-competitions', title: 'Competitions',  icon:'', class: '', submenu:[
    { path: '/admin/active-competitions', title: 'Active Competitions',  icon: '', class: '' },
    { path: '/admin/sold-out', title: 'Sold Out',  icon: '', class: '' },
    { path: '/admin/live-draws', title: 'Live Draws',  icon: '', class: '' },
    { path: '/admin/winners-podium', title: 'Winner Podium',  icon: '', class: '' }
  ],style:'padding-left:0px',badgeclass:'' },
  { path: '/admin/how_to_play', title: 'How to play',  icon:'', class: '',submenu:[],style:'padding-left:0px',badgeclass:'' },
  { path: '/admin/blog', title: 'Blog',  icon:'', class: '',submenu:[],style:'padding-left:0px',badgeclass:'' },
  { path: '/admin/testimonials', title: 'Testimonials',  icon:'', class: '',submenu:[],badgeclass:'' },
  // { path: '/my-account', title: 'My Account',  icon:'', class: '',submenu:[],style:'padding-left:0px',badgeclass:'' },
  { path: 'admin/cart', title: 'Cart',  icon:'fa fa-cart-arrow-down', class: 'cartli',subclass:'cart',submenu:[],style:'padding-left:0px',substyle:'background-color: #000000 !important;color: #fff !important',badgeclass:'badge badge-light cart-badge-position'}
];

export const NORMAL_ROUTES = [
  { path: '/admin/home', title: 'Home',  icon: '', class: '',submenu:[], style:'padding-left:0px',badgeclass:'' },
  { path: '/admin/active-competitions', title: 'Competitions',  icon:'', class: '', submenu:[
    { path: '/admin/active-competitions', title: 'Active Competitions',  icon: '', class: '' },
    { path: '/admin/sold-out', title: 'Sold Out',  icon: '', class: '' },
    { path: '/admin/live-draws', title: 'Live Draws',  icon: '', class: '' },
    { path: '/admin/winners-podium', title: 'Winner Podium',  icon: '', class: '' }
  ],style:'padding-left:0px',badgeclass:'' },
  { path: '/admin/how_to_play', title: 'How to play',  icon:'', class: '',submenu:[],style:'padding-left:0px',badgeclass:'' },
  { path: '/admin/blog', title: 'Blog',  icon:'', class: '',submenu:[],style:'padding-left:0px',badgeclass:'' },
  { path: '/admin/testimonials', title: 'Testimonials',  icon:'', class: '',submenu:[],badgeclass:'' },
  { path: '/admin/login', title: 'Login',  icon:'', class: 'main-button',submenu:[],subclass:'auth',badgeclass:'',style:'padding-left:0px' },
  { path: '/admin/register', title: 'Register',  icon:'', class: 'main-button',subclass:'auth',submenu:[],badgeclass:'',style:'padding-left:0px'}
];

@Component({
  selector: 'app-admin-login-header',
  templateUrl: './admin-login-header.component.html',
  styleUrls: ['./admin-login-header.component.css']
})

export class AdminLoginHeaderComponent implements OnInit {
  public menuItems: any[];
  logininfo:any;
  countcart:any = []
  constructor() {
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
    if(!this.logininfo){
      this.menuItems = NORMAL_ROUTES.filter(menuItem => menuItem);
    }else{
      this.menuItems = ROUTES.filter(menuItem => menuItem);
      }
    }
   
  

  ngOnInit(): void {
  }

}
