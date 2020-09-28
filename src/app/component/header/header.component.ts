import { Component, OnInit, Input } from '@angular/core';
import { FormsModule, FormControl,FormArray,FormGroup,Validator,FormBuilder, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import { error } from 'protractor';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2'
import { DataprocessService } from 'src/app/dataservice/dataprocess.service';

declare global {
  interface Window {
    registerEvents: any;
  }
}

export const ROUTES = [
  { path: '/home', title: 'Home',  icon: '', class: '',submenu:[],badgeclass:'' },
  { path: '', title: 'Competitions',  icon:'', class: '', submenu:[
    { path: '/active-competitions', title: 'Active Competitions',  icon: '', class: '' },
    { path: '/sold-out', title: 'Sold Out',  icon: '', class: '' },
    { path: '/live-draws', title: 'Live Draws',  icon: '', class: '' },
    { path: '/winners-podium', title: 'Winner Podium',  icon: '', class: '' }
  ],badgeclass:'' },
  { path: '/how_to_play', title: 'How to play',  icon:'', class: '',submenu:[],badgeclass:'' },
  { path: '/blog', title: 'Blog',  icon:'', class: '',submenu:[],badgeclass:'' },
  { path: '/viewtestimonials', title: 'Testimonials',  icon:'', class: '',submenu:[],badgeclass:'' },
  // { path: '/testimonials', title: 'Testimonials',  icon:'', class: '',submenu:[],badgeclass:'' },
  { path: '/my-account', title: 'My Account',  icon:'', class: '',submenu:[],badgeclass:'' },
  { path: '/cart', title: 'Cart',  icon:'fa fa-cart-arrow-down', class: 'cartli',subclass:'cart',submenu:[],substyle:'background-color: #000000 !important;color: #fff !important',badgeclass:'badge badge-light cart-badge-position'}
];

export const NORMAL_ROUTES = [
  { path: '/home', title: 'Home',  icon: '', class: '',submenu:[],badgeclass:'' },
  { path: '', title: 'Competitions',  icon:'', class: '', submenu:[
    { path: '/active-competitions', title: 'Active Competitions',  icon: '', class: '' },
    { path: '/sold-out', title: 'Sold Out',  icon: '', class: '' },
    { path: '/live-draws', title: 'Live Draws',  icon: '', class: '' },
    { path: '/winners-podium', title: 'Winner Podium',  icon: '', class: '' }
  ],badgeclass:'' },
  { path: '/how_to_play', title: 'How to play',  icon:'', class: '',submenu:[],badgeclass:'' },
  { path: '/blog', title: 'Blog',  icon:'', class: '',submenu:[],badgeclass:'' },
  { path: '/viewtestimonials', title: 'Testimonials',  icon:'', class: '',submenu:[],badgeclass:'' },
  // { path: '/testimonials', title: 'Testimonials',  icon:'', class: '',submenu:[],badgeclass:'' },
  { path: '/login', title: 'Login',  icon:'', class: 'main-button',submenu:[],subclass:'auth',badgeclass:'' },
  { path: '/register', title: 'Register',  icon:'', class: 'main-button',subclass:'auth',submenu:[],badgeclass:''}
];






@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public menuItems: any[];
  logininfo:any;
  countcart:any = []
  cart_data = [];
  length_cart:number = 0;
  @Input('incomingmsg') newrandmsg: string;
  message: string;
  editedmsg: string;
  mySubscription:any;
  cartdata = [];
  cart_any:any;
  constructor(private dps: DataprocessService,private fb:FormBuilder,private router: Router,private ds: DataserviceService,private toastr: ToastrService) { 
    // alert('test');
  
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
    if(!this.logininfo){
      this.menuItems = NORMAL_ROUTES.filter(menuItem => menuItem);
    }else{
      this.menuItems = ROUTES.filter(menuItem => menuItem);      
    }
    
    this.cart_any = this.dps.competition_details();
console.log(this.cart_any,'cart data any');
    if(this.cart_any){
    this.cart_any.forEach(c => {
      this.cart_data.push({booking_number:c.booking_number,competition_id:c.competition_id,copetition:c.copetition,
        id:c.id,ticket_number:c.ticket_number,sale_price:c.sale_price,user_id:c.user_id})
        })
      }

    // this.cart_data =this.ds.competition_details();
    // console.log(this.cart_data,'headr cart data');
    if(this.cart_data){
    
this.cart_data.forEach(c => {
this.cartdata.push({booking_number:c.booking_number,competition_id:c.competition_id,copetition:c.copetition,
  id:c.id,ticket_number:c.ticket_number,sale_price:c.sale_price,user_id:c.user_id})
  })
this.length_cart = this.cartdata.length;
// alert(this.length_cart + 'cart length');
// console.log(this.editedmsg);
}


// this.ds.getdata(msg => {
//   console.log('msg'+msg);
// })
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

editthemsg() {
  this.ds.editMsg(this.editedmsg);
}

  ngOnInit(): void {
    window.registerEvents.toogolenavbar();
    // this.ds.telecast.subscribe(message => this.message = message);
  }

   myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

}
