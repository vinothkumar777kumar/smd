import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { Router } from '@angular/router';

declare global {
  interface Window {
    registerEvents: any;
  }
}
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
    window.registerEvents.flipcard();
  }

  onchange(event,text){
    var count = 0;
var maxLength = $('#cvc').val().toString().length;
    if(text == 'name'){
    if(event.target.value == ''){
      $('.rccs__name').text('YOUR NAME HERE');
    }else{
   $('.rccs__name').text(event.target.value);
    }
  }else if(text == 'expiry'){
    if(event.target.value == ''){
      $('.rccs__expiry__value').text('••/••');
    }else{
   $('.rccs__expiry__value').text(event.target.value);
    }
  }else if(text == 'cvc'){
    $('.rccs__cvc').text((event.target.value.replace(/[^\s]/g, "*")))
  }else if(text == 'cardnumber'){
    if(event.target.value == ''){
      $('.rccs__number').text('•••• •••• •••• ••••');
    }else{
      var foo =event.target.value.split("-").join(""); // remove hyphens
      if (foo.length > 0) {
        foo = foo.match(new RegExp('.{1,4}', 'g')).join(" ");
      }
      console.log(foo);
      $('.rccs__number').text(foo);
  //  $('.rccs__number').text(event.target.value);
    }
  }
  }

  checkDigit(event) {
    var code = (event.which) ? event.which : event.keyCode;

    if ((code < 48 || code > 57) && (code > 31)) {
        return false;
    }

    return true;
}

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  postcheckout(){
    // alert('test');
    this.router.navigateByUrl('/post-checkout');
  }




}
