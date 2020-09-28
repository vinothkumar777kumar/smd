import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataprocessService {
  card_data:any;
  constructor() { }

  getdata(data){
    console.log(data,'dayaserve cart data');
    this.card_data = data;
    console.log(this.card_data,'save ed cart data');
    // this.messageSource.next(data);

  }

 

  competition_details(){
    console.log(this.card_data,'return data')
    return this.card_data;
  }
}
