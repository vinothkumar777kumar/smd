import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, FormControl,FormArray,FormGroup,Validator,FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import { error} from 'protractor';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label,Color, BaseChartDirective } from 'ng2-charts';
import * as moment from 'moment';
import * as $ from 'jquery';
import Swal from 'sweetalert2';
import {BehaviorSubject, of, Subject} from 'rxjs';
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-live-active-competition',
  templateUrl: './live-active-competition.component.html',
  styleUrls: ['./live-active-competition.component.css']
})
export class LiveActiveCompetitionComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger:Subject<any> = new Subject();
  logininfo:any;
  image_url:any;
  preditionarray = [];

  constructor(private fb:FormBuilder,private location: Location,private router: Router,private ds: DataserviceService,private toastr: ToastrService) { 
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
    this.image_url = this.ds.getiamgeAPI();
    this.get_preditiondata();
  }
  

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    }
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
var Difference_In_Time = date1.getTime() - date2.getTime(); 
  
// To calculate the no. of days between two dates 
var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24); 
console.log(Difference_In_Days);
let tickets = c.soldTickets / Difference_In_Days;
let average = c.unsoldTickets / tickets;
  console.log( Difference_In_Days,'diffdays');
//To display the final no. of days (result) 
// document.write("Total number of days between dates  <br>"
//                + date1 + "<br> and <br>" 
//                + date2 + " is: <br> " 
//                + Difference_In_Days);
if(c.soldTickets > 0){
this.preditionarray.push({id:c.id,competition:c.competition,
  startDate:c.startDate,endDate:c.endDate,soldTickets:c.soldTickets,
  totalTickets:c.totalTickets,unsoldTickets:c.unsoldTickets,average:Math.round(average)})
}

      
          
        })
        this.dtTrigger.next();  
      // this.getticket_data();
// this.featurcompetitionlength = this.feature_data.length;
// console.log(res['succe ss']['data']);
      }
    },error => {

    });
  }

  viewchart_data(data){
    console.log(data);
    const navigationExtras = {
      queryParams: {
          id: data.id ,
          competition:data.competition
      }
  };
this.router.navigate(['/live-chart-data'], navigationExtras);
  }
}

