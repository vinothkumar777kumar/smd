import { Component, OnInit, ViewChild } from '@angular/core';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import * as $ from 'jquery';
import Swal from 'sweetalert2'
import {MovingDirection} from 'angular-archwizard';
import { error } from 'protractor';
import {IAngularMyDpOptions, IMyDateModel, IMyCalendarViewChanged, IMyRangeDateSelection, AngularMyDatePickerDirective} from 'angular-mydatepicker';
import * as moment from 'moment'; 
import { Router, ActivatedRoute } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { DataTableDirective } from 'angular-datatables';
import {BehaviorSubject, of, Subject} from 'rxjs';

@Component({
  selector: 'app-view-salediscountreport',
  templateUrl: './view-salediscountreport.component.html',
  styleUrls: ['./view-salediscountreport.component.css']
})
export class ViewSalediscountreportComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger:Subject<any> = new Subject();
  freeticketid:any;
  logininfo:any;
  salesdiscountdatesarray = [];
  emptysalediscountdate:boolean = false;
  isloading:boolean = false;
  competition_id:any;
  constructor(private http: HttpClient,private location: Location,private router: Router,private ds: DataserviceService,
    private toastr: ToastrService,private Activate:ActivatedRoute) {
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
    this.emptysalediscountdate = false;
    this.ds.getmethod('salesdiscountdates/'+this.competition_id, this.logininfo['success']['token']).subscribe(res => {
      this.isloading = false;
      if(res['status'] == 'SUCCESS'){
  let data = res['data'];
  if(data == ''){
    this.emptysalediscountdate = true;
  }else{
    data.forEach(s => {
      let discount_type = '';
      if(s.discount == 1){
        discount_type = 'Amount';
      }else{
        discount_type = 'Percentage';
      }
      this.salesdiscountdatesarray.push({id:s.id,competition_id:s.competition_id,
        discount:discount_type,sale_date:s.sale_date,status:s.status,value:s.value})
    });
    this.dtTrigger.next();
    if(this.salesdiscountdatesarray.length <= 0){
      this.emptysalediscountdate = true;
    }
  }
 
      }
    });
  }

}
