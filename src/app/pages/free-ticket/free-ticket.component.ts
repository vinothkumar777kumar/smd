import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, FormControl,FormArray,FormGroup,Validator,FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import { error } from 'protractor';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import {BehaviorSubject, of, Subject} from 'rxjs';
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-free-ticket',
  templateUrl: './free-ticket.component.html',
  styleUrls: ['./free-ticket.component.css']
})
export class FreeTicketComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger:Subject<any> = new Subject();
  freeticketdata = [];
  logininfo:any;
  coupon:any;
  emptyfreetickets:boolean = false;
  isloading:boolean = false;
  constructor(private Activate: ActivatedRoute,private fb:FormBuilder,private location: Location,private router: Router,private ds: DataserviceService,private toastr: ToastrService) {
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    }
this.getfreeticket_data();

   }

  ngOnInit(): void {
  }

  
  getfreeticket_data(){
    this.isloading = true;
    this.ds.getmethod('free',this.logininfo['success']['token']).subscribe(res => {
      this.isloading = false;
      if(res['success']['status'] == 'success'){
        let data = res['success']['data'];
        if(data == ''){
          this.emptyfreetickets = true;
        }else{
          data.forEach(t => {
            this.freeticketdata.push({id:t.id,competition:t.competition,description:t.description,
              draw_end_date_time:t.draw_end_date_time,draw_start_date_time:t.draw_start_date_time,ticket_count:t.ticket_count});
          })
          this.dtTrigger.next();
        }
       
// this.competitionarray =competitionarray;
      }
    },error => {

    });
  }

  editfreeticket(data){
    const navigationExtras = {
      queryParams: {
          id: data.id  
      }
  };
this.router.navigate(['/add-freeticket'], navigationExtras);
  }

  delete_freeticket(data){

  }

  viewticketuser(data){
    const navigationExtras = {
      queryParams: {
          id: data.id  
      }
  };
this.router.navigate(['/view-freeticket-users'], navigationExtras);
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

}
