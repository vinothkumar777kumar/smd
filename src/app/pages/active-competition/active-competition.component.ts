import { Component, OnInit } from '@angular/core';
import { FormsModule, FormControl,FormArray,FormGroup,Validator,FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import { error} from 'protractor';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import * as moment from 'moment';
import * as $ from 'jquery';

@Component({
  selector: 'app-active-competition',
  templateUrl: './active-competition.component.html',
  styleUrls: ['./active-competition.component.css']
})
export class LiveCompetitionComponent implements OnInit {
  logininfo:any;
  image_url:any;
  preditionarray = [];
  constructor(private fb:FormBuilder,private location: Location,private router: Router,private ds: DataserviceService,private toastr: ToastrService) { 
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
    this.image_url = this.ds.getiamgeAPI();
  }


  ngOnInit(): void {
  }

  
  get_preditiondata(){
    this.ds.getmethod('predition',this.logininfo['success']['token']).subscribe(res => {
      if(res['status'] == 'SUCCESS'){
        let data = res['data'];
        console.log(res['data'],'preditodaat');
        let date1;
        data.forEach(c => { 
          let sdate = c.startDate.split('-');

let dsd = sdate[1]+'/'+sdate[0]+'/'+sdate[2];

           date1 = new Date(dsd); 
var date2 = new Date("06/24/2020"); 
console.log(date1,date2,'start_date');
// To calculate the time difference of two dates 
var Difference_In_Time = date2.getTime() - date1.getTime(); 
  
// To calculate the no. of days between two dates 
var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24); 
let tickets = c.soldTickets / Difference_In_Days;
let average = c.unsoldTickets / tickets;
  console.log( Difference_In_Days,'diffdays');
//To display the final no. of days (result) 
// document.write("Total number of days between dates  <br>"
//                + date1 + "<br> and <br>" 
//                + date2 + " is: <br> " 
//                + Difference_In_Days);
alert(c.soldTickets);
if(c.soldTickets > 0){
this.preditionarray.push({id:c.id,competition:c.competition,
  startDate:c.startDate,endDate:c.endDate,soldTickets:c.soldTickets,
  totalTickets:c.totalTickets,unsoldTickets:c.unsoldTickets,average:Math.round(average)})
}

          
          
        })
     
      // this.getticket_data();
// this.featurcompetitionlength = this.feature_data.length;
// console.log(res['succe ss']['data']);
      }
    },error => {

    });
  }

}
