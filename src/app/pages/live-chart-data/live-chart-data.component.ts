import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, FormControl,FormArray,FormGroup,Validator,FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import { error} from 'protractor';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color, BaseChartDirective } from 'ng2-charts';
import * as moment from 'moment';
import * as $ from 'jquery';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-live-chart-data',
  templateUrl: './live-chart-data.component.html',
  styleUrls: ['./live-chart-data.component.css']
})
export class LiveChartDataComponent implements OnInit {
  dailysaledate = [];
  daliysalesold = [];
  dailysaleunsold = [];
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  logininfo:any;
  competition_name:any;
  competition_id:any
  image_url:any;
  competitiondata = [];
  feature_data = [];
  dropdownSettings: any = {};
  ShowFilter = false;
  comparitiondata = [];
  comparition_data = [];
  linechart:boolean =false;
  compare_competiton_data = [];
  linchartdata = [];
  colors = ['red', 'green', 'blue', 'yellow', 'purple', 'teal'];
  colorIndex = 0;
  public barChartColors: Color[] = [
    { backgroundColor: 'purple' },
    { backgroundColor: 'brown' },
  ]
  public barChartData: ChartDataSets[] = [{ data:this.daliysalesold, label: 'Booked Ticket' },
  { data: this.dailysaleunsold, label: 'Available Ticket' }];

  // line chart
  public lineChartData: ChartDataSets[];
  
  public lineChartLabels: Label[];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      // yAxes: [
      //   {
      //     id: 'y-axis-0',
      //     position: 'left',
      //   },
      //   {
      //     id: 'y-axis-1',
      //     position: 'right',
      //     gridLines: {
      //       color: 'rgba(255,0,0,0.3)',
      //     },
      //     ticks: {
      //       fontColor: 'red',
      //     }
      //   }
      // ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno'
          }
        },
      ],
    },
  };
  public lineChartColors: Color[];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];
@ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;
  constructor(private Activate: ActivatedRoute,private fb:FormBuilder,private location: Location,private router: Router,private ds: DataserviceService,private toastr: ToastrService) { 
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
    this.image_url = this.ds.getiamgeAPI();
    // this.get_competitiondata();
    this.getcomparitiondata();
    this.Activate.queryParams.subscribe(res => {
      this.competition_id = res.id;
      this.competition_name = res.competition;
   let total_tickets = '';
   let daily_sold_tickets = 0;
   let daily_unsold_tickets = 0;
       this.ds.getmethod('dailysales/'+this.competition_id,this.logininfo['success']['token']).subscribe(res => {
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
           this.lineChartLabels =['day 1','day 2','day 3','day 4','day 5','day 6','day 7'];
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
           
           this.barChartData = [
             { data:this.daliysalesold, label: 'Booked Ticket' },
             { data: this.dailysaleunsold, label: 'Available Ticket' }
           ];

          //  this.lineChartData= [
          //   { data: [20,10,30,40,50,60,65], label: 'Competition 1' },
          //   { data: [1000,2000,3000,4000,5000,6000,7000], label:'Competition 2' },
          // ];

          // this.lineChartColors = [
          //   {
          //     borderColor: 'green',
          //     backgroundColor: 'rgba(255,0,0,0.3)',
          //   },
          //   {
          //     borderColor: 'yellow',
          //     backgroundColor: 'rgba(255,0,0,0.3)',
          //   },
          // ];
           
         }
       })
      });
     
  }

  ngOnInit(): void {
  }

  getcomparitiondata(){
    this.ds.getmethod('comparison',this.logininfo['success']['token']).subscribe(res => {
      if(res['status'] == 'SUCCESS'){
        let data = res['data'];  
        let competiton_data = [];
        let unique = {};
        let distinct = [];
      //   res.forEach((x) => {
      //  if (!unique[x.Emp_Dept]) {
      //    distinct.push({ 'Dep_id': x.Emp_Dept, 'Dep_Name': x.Emp_Dept });
      //    unique[x.Emp_Dept] = true;
      //  }
      data.forEach(u => {
        this.compare_competiton_data.push({id:u.id,competition:u.competition,
          day:u.day,date:u.date,totalTickets:u.totalTickets,dailySold:u.dailySold,dailyUnsold:u.dailyUnsold})
      })
        data.forEach(u => {
          if (!unique[u.competition]) {
          competiton_data.push({id:u.id,competition:u.competition,
            day:u.day,date:u.date,totalTickets:u.totalTickets,dailySold:u.dailySold,dailyUnsold:u.dailyUnsold})
            unique[u.competition] = true;
          }
        })
        this.comparition_data = competiton_data
        console.log(this.competitiondata);
      }
    },error => {

    });
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField:'competition',
      enableCheckAll:true,
      // selectAllText: 'Select All',
      // unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: this.ShowFilter
    };
  }

  // get_competitiondata(){
  //   this.ds.apigetmethod('competitions').subscribe(res => {
  //     if(res['success']['status'] == 'success'){
 
  //       let data = res['success']['data'];
  //       data.forEach(c => {
  //         this.competitiondata.push({id:c.id,image:this.image_url+c.image,ticket_price:c.ticket_price,sale_price:c.sale_price,competition:c.competition,description:c.description,
  //         draw_start_date_time:c.draw_start_date_time,draw_end_date_time:c.draw_end_date_time,draw_month:c.draw_month,
  //         draw_year:c.draw_year,is_active:c.is_active,is_cashdraw:c.is_cashdraw,is_draft:c.is_draft,is_drawn:c.is_drawn,
  //         is_featured:c.is_featured}) 
  //       })
  //       let competiton_array = [];
  //       this.competitiondata.forEach(c => { 
  //           competiton_array.push({id:c.id,competition:c.competition,description:c.description,
  // draw_start_date_time:c.draw_start_date_time,draw_end_date_time:c.draw_end_date_time,draw_month:c.draw_month,
  // draw_year:c.draw_year,is_active:c.is_active,is_cashdraw:c.is_cashdraw,is_draft:c.is_draft,is_drawn:c.is_drawn,
  // is_featured:c.is_featured}) ;      
          
  //       })
  //       console.log(competiton_array,'fetur data');
  //       this.feature_data = competiton_array;
  //       this.dropdownSettings = {
  //         singleSelection: false,
  //         idField: 'id',
  //         textField:'competition',
  //         enableCheckAll:true,
  //         // selectAllText: 'Select All',
  //         // unSelectAllText: 'UnSelect All',
  //         itemsShowLimit: 3,
  //         allowSearchFilter: this.ShowFilter
  //       };
      
  //     }
  //   },error => {

  //   });

  // }

  public randomize(): void {
    for (let i = 0; i < this.lineChartData.length; i++) {
      for (let j = 0; j < this.lineChartData[i].data.length; j++) {
        this.lineChartData[i].data[j] = this.generateNumber(i);
      }
    }
    this.chart.update();
  }

  private generateNumber(i: number) {
    return Math.floor((Math.random() * (i < 2 ? 100 : 1000)) + 1);
  }

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public hideOne() {
    const isHidden = this.chart.isDatasetHidden(1);
    this.chart.hideDataset(1, !isHidden);
  }

  public pushOne() {
    this.lineChartData.forEach((x, i) => {
      const num = this.generateNumber(i);
      const data: number[] = x.data as number[];
      data.push(num);
    });
    this.lineChartLabels.push(`Label ${this.lineChartLabels.length}`);
  }

  public changeColor() {
    this.lineChartColors[2].borderColor = 'green';
    this.lineChartColors[2].backgroundColor = `rgba(0, 255, 0, 0.3)`;
  }

  public changeLabel() {
    this.lineChartLabels[2] = ['1st Line', '2nd Line'];
    // this.chart.update();
  }

  onSelectAll(eve){

  }

  onItemSelect(data){
let cd = this.compare_competiton_data.filter(c => c.id == data.id);
console.log(cd)
this.linechart = true;
let solddata = [];  

console.log(cd);
cd.forEach((c,i) => {
  solddata.push(c.dailySold);
})
this.barChartColors[0].backgroundColor = this.colors[this.colorIndex++];
this.linchartdata.push({ data: solddata, label: cd[0].competition});
console.log(this.linchartdata);  
this.lineChartData= this.linchartdata;
this.lineChartColors = this.barChartColors
// console.log(cd);
  }

  onItemDeSelect(e){

  }
  

}
