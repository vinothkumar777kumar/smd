import { Component, OnInit, ViewChild } from '@angular/core';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-competition-report',
  templateUrl: './competition-report.component.html',
  styleUrls: ['./competition-report.component.css']
})
export class CompetitionReportComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger:Subject<any> = new Subject();
  logininfo:any;
  isloading:boolean = false;
  salesreportarray = [];
  emptysalescompetitionarray:boolean =false;
  constructor(private ds: DataserviceService,private router: Router) {
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
    this.getsalesreport_data();
   }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    }
 
  }





  getsalesreport_data(){
    this.isloading =true;
    this.emptysalescompetitionarray = false;
    this.ds.getmethod('salesreports',this.logininfo['success']['token']).subscribe(res => {
      this.isloading = false;
      if(res['status'] == 'SUCCESS'){
        let data = res['data'];
        if(data == ''){
          this.emptysalescompetitionarray = true;
        }
        console.log(data);
        data.forEach(u => {
          this.salesreportarray.push({id:u.id,competition:u.competition,
            draw_start_date_time:u.draw_start_date_time,draw_end_date_time:u.draw_end_date_time});
          
        })
        this.dtTrigger.next();
// this.competitionarray = competitionarray;
      }
    },error => {
this.isloading = false;
    });
  }

  view_userwise(data){
    const navigationExtras = {
      queryParams: {
        id: data.id  
      }
  };
  this.router.navigate(['/view-userdetails-report'], navigationExtras);
  }

}
