import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-thankyou-page',
  templateUrl: './thankyou-page.component.html',
  styleUrls: ['./thankyou-page.component.css']
})
export class ThankyouPageComponent implements OnInit {
  mySubscription: any;
  cart_data = [];
  logininfo:any;
  constructor(private router:Router,private location:Location,private ds:DataserviceService) {
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
    if(!this.logininfo){
      this.router.navigateByUrl('/login')
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
  }

  gotohome(){
    this.ds.getdata(this.cart_data);
this.router.navigateByUrl('/home');
  }

  gotomytickets(){
    Swal.fire({
              title: 'Info',
              text: "Are you sure you want to logout?",
              icon: 'info',
              confirmButtonText: 'OK',
              showCancelButton:true,
              cancelButtonAriaLabel:"Cancel"
            }).then((result) => {
              if (result.value) {
                this.ds.getdata(this.cart_data);
                this.ds.logout();
              } else if (result.dismiss === Swal.DismissReason.cancel) {
                // this.router.navigateByUrl('/my-ticket');
              }
            })
   
    // this.router.navigateByUrl('/my-ticket');
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

}
