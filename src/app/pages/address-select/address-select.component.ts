import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-address-select',
  templateUrl: './address-select.component.html',
  styleUrls: ['./address-select.component.css']
})
export class AddressSelectComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  gotocheckout(){
    this.router.navigateByUrl('/checkout');
  }

}
