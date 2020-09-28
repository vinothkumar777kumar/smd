import { Component, OnInit, ViewChild } from '@angular/core';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-view-user-report',
  templateUrl: './view-user-report.component.html',
  styleUrls: ['./view-user-report.component.css']
})
export class ViewUserReportComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger:Subject<any> = new Subject();
  competition_id:any;
  isloading:boolean = false;
  logininfo:any;
  userwisearray = [];
  constructor(private router: Router,private ds: DataserviceService,private Activate:ActivatedRoute) {
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
    this.Activate.queryParams.subscribe(res => {
      this.competition_id = res.competition_id;
this.getdsalediscount_data()
    });
   }

  ngOnInit(): void {
  }

  getdsalediscount_data(){
    this.isloading = true;
    // this.emptysalediscountdate = false;
    this.ds.getmethod('salesdiscountdates/'+this.competition_id, this.logininfo['success']['token']).subscribe(res => {
      this.isloading = false;
      if(res['status'] == 'SUCCESS'){
  let data = res['data'];
  if(data == ''){
    // this.emptysalediscountdate = true;
  }else{
    data.forEach(s => {
      let discount_type = '';
      if(s.discount == 1){
        discount_type = 'Amount';
      }else{
        discount_type = 'Percentage';
      }
      this.userwisearray.push({id:s.id,competition_id:s.competition_id,
        discount:discount_type,sale_date:s.sale_date,status:s.status,value:s.value})
    });
    this.dtTrigger.next();
    if(this.userwisearray.length <= 0){
      // this.emptysalediscountdate = true;
    }
  }
 
      }
    });
  }

}
