import { Component, OnInit, ViewChild } from '@angular/core';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-view-userdetail-report',
  templateUrl: './view-userdetail-report.component.html',
  styleUrls: ['./view-userdetail-report.component.css']
})
export class ViewUserdetailReportComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger:Subject<any> = new Subject();
  isloading:boolean = false;
  emptysalesuserswisearray:boolean = false;
  logininfo:any;
  competition_id:any;
  userwisearray = [];
  constructor(private http: HttpClient,private location: Location,private router: Router,private ds: DataserviceService,
    private toastr: ToastrService,private Activate:ActivatedRoute) {
      this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
      this.Activate.queryParams.subscribe(res => {
        this.competition_id = res.id;
  this.getuserswisedata()
      });
     }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    }
  }

  getuserswisedata(){
    this.isloading = true;
    this.emptysalesuserswisearray = false;
    this.ds.getmethod('salesdates/'+this.competition_id,this.logininfo['success']['token']).subscribe( res => {
      // let data = status['success'];
      if(res['status'] == 'SUCCESS'){
        let data = res['data'];
        if(data == ''){
this.emptysalesuserswisearray = true;
this.isloading = false;
        }else{
          data.forEach((u) => {
            this.userwisearray.push({
              booking_date:u.booking_date,no_of_tickets:u.no_of_tickets,sale_price:u.sale_price,total_price:u.total_price,
              name:u.name,free_tickets:u.free_tickets
            })
          })
          this.dtTrigger.next();
          this.emptysalesuserswisearray = false;
          this.isloading = false;
        }
      }
       });
  }

}
