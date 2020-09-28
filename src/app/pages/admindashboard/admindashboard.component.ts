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
// import * as pluginDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.css']
})
export class AdmindashboardComponent implements OnInit {
  logininfo:any;
  userdatalength:number = 0;
  featurcompetitionlength:number = 0;
  winnerdatalength:number = 0;
  upcommingdata_length:number = 0;
  winnerdata = [];
 feature_data = [];
 upcomming = [];
 dailysaledate = [];
 daliysalesold = [];
 dailysaleunsold = [];
 competition_id:any;
 competition_form:FormGroup;
 dataSource: Object;
 fusion_chart_data = [];
 preditionarray = [];
 competitiondata = [];
 image_url:any;
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [{ data:this.daliysalesold, label: 'Booked Ticket' },
  { data: this.dailysaleunsold, label: 'Available Ticket' }];

  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };

  public pieChartLabels: Label[] = [['Total Tickets'], ['Sale Tickets'],['Unsold Tickets']];
  public pieChartData: number[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public pieChartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)','rgba(0,0,255,0.3)'],
    },
  ];

  constructor(private fb:FormBuilder,private location: Location,private router: Router,private ds: DataserviceService,private toastr: ToastrService) { 
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
    if(!this.logininfo || this.logininfo['success']['role'] != 1){
      this.router.navigateByUrl('/login');
    }
    this.image_url = this.ds.getiamgeAPI();
    this.competition_form = this.fb.group({
      competition_id:['']
    })
    this.get_competitiondata();
    this.get_winnerdata();
    this.get_preditiondata();
    this.ds.getmethod('users',this.logininfo['success']['token']).subscribe(res => {
      console.log(res['success']['data'].length);
      if(res['success']['status'] == 'success'){
this.userdatalength = res['success']['data'].length;
      }
    },error => {

    });

  
   
  }

  ngOnInit(): void {
    
  }

  get_competitiondata(){
    this.ds.apigetmethod('competitions').subscribe(res => {
      if(res['success']['status'] == 'success'){
 
        let data = res['success']['data'];
        data.forEach(c => {
          this.competitiondata.push({id:c.id,image:this.image_url+c.image,ticket_price:c.ticket_price,sale_price:c.sale_price,competition:c.competition,description:c.description,
          draw_start_date_time:c.draw_start_date_time,draw_end_date_time:c.draw_end_date_time,draw_month:c.draw_month,
          draw_year:c.draw_year,is_active:c.is_active,is_cashdraw:c.is_cashdraw,is_draft:c.is_draft,is_drawn:c.is_drawn,
          is_featured:c.is_featured}) 
        })
        this.competitiondata.forEach(c => { 
          if(c.is_featured == 1 && moment().format('DD-MM-YYYY') >= c.draw_start_date_time){
            // console.log(c);
            this.competition_form.controls['competition_id'].setValue(c.id)
this.feature_data.push({id:c.id,competition:c.competition,description:c.description,
  draw_start_date_time:c.draw_start_date_time,draw_end_date_time:c.draw_end_date_time,draw_month:c.draw_month,
  draw_year:c.draw_year,is_active:c.is_active,is_cashdraw:c.is_cashdraw,is_draft:c.is_draft,is_drawn:c.is_drawn,
  is_featured:c.is_featured})

          }
          
        })
        this.competitiondata.forEach(c => {
          let now = new Date();
          // console.log(now ,c.draw_start_date_time)
          if(moment().format('DD-MM-YYYY') < c.draw_start_date_time){
            this.upcomming.push({id:c.id,image:c.image,ticket_price:c.ticket_price,sale_price:c.sale_price,competition:c.competition,description:c.description,
              draw_start_date_time:c.draw_start_date_time,draw_end_date_time:c.draw_end_date_time,draw_month:c.draw_month,
              draw_year:c.draw_year,is_active:c.is_active,is_cashdraw:c.is_cashdraw,is_draft:c.is_draft,is_drawn:c.is_drawn,
              is_featured:c.is_featured})
          }
        })

     
      this.getticket_data();
this.featurcompetitionlength = this.feature_data.length;
this.upcommingdata_length = this.upcomming.length;
// console.log(res['succe ss']['data']);
      }
    },error => {

    });

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
this.preditionarray.push({id:c.id,competition:c.competition,
  startDate:c.startDate,endDate:c.endDate,soldTickets:c.soldTickets,
  totalTickets:c.totalTickets,unsoldTickets:c.unsoldTickets,average:Math.round(average)})

          
          
        })
     
      this.getticket_data();
this.featurcompetitionlength = this.feature_data.length;
// console.log(res['succe ss']['data']);
      }
    },error => {

    });
  }
    

  get_winnerdata(){
    this.ds.getmethod('winner', this.logininfo['success']['token']).subscribe(res => {
      if(res['success']['status'] == 'success'){
        let winner_data = [];
        let data = res['success']['data'];
        data.forEach(w => {
        let winner_data = [];
        this.winnerdata.push({id:w.id,user_id:w.user_id,competition_id:w.competition_id,
          profile_image:w.profile_image,response:w.response,ticket_number:w.ticket_number,
          video_thumbnail:w.video_thumbnail,video_url:w.video_url,testimonials:w.testimonials})
          
        })
        console.log(this.winnerdata,'winnerdafa');
this.winnerdatalength = this.winnerdata.length;
console.log(winner_data.length);
      }
    },error => {

    });
  }

  getticket_data(){
   console.log(this.competition_form.value.competition_id)
let total_tickets = '';
let daily_sold_tickets = 0;
let daily_unsold_tickets = 0;
    this.ds.getmethod('dailysales/'+this.competition_form.value.competition_id,this.logininfo['success']['token']).subscribe(res => {
      if(res['status'] == 'SUCCESS'){
        let dailysaledate = res['data'];
        this.dailysaledate = [];
        this.daliysalesold = [];
        this.dailysaleunsold = [];
        dailysaledate.forEach(ds => {
          total_tickets = ds.totalTickets;
          this.dailysaledate.push(ds.date)
        })
        this.barChartLabels = this.dailysaledate;
        console.log(this.dailysaledate);
        dailysaledate.forEach(ds => {
          daily_sold_tickets += ds.dailySold;
          this.daliysalesold.push(ds.dailySold)
        })
        console.log(this.daliysalesold);
        dailysaledate.forEach(ds => {
          daily_unsold_tickets += ds.dailyUnsold;
          this.dailysaleunsold.push(ds.dailyUnsold)
        })
        let unsold_tickets = parseInt(total_tickets) - daily_sold_tickets;
        this.pieChartData = [];
        this.pieChartData.push(parseInt(total_tickets),daily_sold_tickets,unsold_tickets);
        console.log(parseInt(total_tickets),daily_sold_tickets,unsold_tickets);
        this.barChartData = [
          { data:this.daliysalesold, label: 'Booked Ticket' },
          { data: this.dailysaleunsold, label: 'Available Ticket' }
        ];
        this.fusion_chart_data = [];
        dailysaledate.forEach(ds => {
          this.fusion_chart_data.push({label:ds.date,value:ds.dailySold})
        })
        console.log(this.fusion_chart_data);
        const dataSource = {
          chart: {
            //Set the chart caption
            caption: "Booking Tickets status",
            //Set the chart subcaption
            // subCaption: "In MMbbl = One Million barrels",
            //Set the x-axis name
            xAxisName: "Booking Status",
            //Set the y-axis name
            // yAxisName: "Reserves (MMbbl)",
            // numberSuffix: "K",
            //Set the theme for your chart
          "theme": "Candy"
          },
          // Chart Data - from step 2
          data: this.fusion_chart_data
        };
        this.dataSource = dataSource;
      }
    })
  }

}
