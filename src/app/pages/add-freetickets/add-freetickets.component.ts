import { Component, OnInit } from '@angular/core';
import { FormsModule, FormControl,FormArray,FormGroup,Validator,FormBuilder, Validators } from '@angular/forms';
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

@Component({
  selector: 'app-add-freetickets',
  templateUrl: './add-freetickets.component.html',
  styleUrls: ['./add-freetickets.component.css']
})
export class AddFreeticketsComponent implements OnInit {
  title = 'Add Free Tickets';
  action = "Save";
  isSubmitted =false;
  isLoading = false;
  addfreeticketform:FormGroup;
  competitionarray =[];
  userdata = [];
  logininfo:any;
  dropdownSettings: any = {};
  ShowFilter = false;
  freeticketid:any;
  competition_id:any;
  edituser_id:boolean =false;
  adduser_id:boolean =true;
  user_id:any;
  editdisablecompetition:any;
  sel_comp_availableticket:any;
  sel_comp_freetickets:any;
  sel_comp_ticketcount:any;
  constructor(private http: HttpClient,private fb:FormBuilder,
    private location: Location,private router: Router,private ds: DataserviceService,
    private toastr: ToastrService,private Activate:ActivatedRoute) { 
      this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
      this.editdisablecompetition =true;
      this.getuserdata();
      this.getcompetitons_data();
      this.Activate.queryParams.subscribe(res => {
        this.freeticketid = res.id;
        this.competition_id = res.competition_id;
        if(this.freeticketid){
          this.adduser_id = false;
          this.edituser_id =true;
      
        if(this.freeticketid){
          this.title = "Edit Free Tickets";
        }else{
          this.title = 'Add Free Tickets';
        }
      this.ds.getmethod('free/'+res.id, this.logininfo['success']['token']).subscribe(res => {
        if(res['success']['status'] == 'success'){
          this.action ="Update";
          this.editdisablecompetition ='';
          // this.addfreeticketform.controls['user_id'].disable();
          let fetch_data = res['success']['data'];
          // console.log(fetch_data[0].competition_id)
          this.addfreeticketform.controls['id'].setValue(fetch_data[0].id);
      this.addfreeticketform.controls['competition_id'].setValue(fetch_data[0].competition_id);
      this.userdata.forEach(u => {
        if(u.id == fetch_data[0].user_id){
          this.user_id = fetch_data[0].user_id
          console.log(u.name,'name');
          this.addfreeticketform.controls['user_id'].setValue(u.name);
        }
      })
      this.addfreeticketform.controls['no_of_tickets'].setValue(fetch_data[0].no_of_tickets);

        }
      });
    }
      });
    this.addfreeticketform = this.fb.group({
      id:[''],
      competition_id:['',Validators.required],
      user_id:['',Validators.required],
      no_of_tickets:['',Validators.required]
    })
  }

  ngOnInit(): void {
  
    // this.addfreeticketform.controls['user_id'].setValue([{ "id": 2, "name": "User" }, { "id": 8, "name": "jhon" } ]);
  }

  get formControls() { return this.addfreeticketform.controls; }

  getuserdata(){
    this.ds.getmethod('users',this.logininfo['success']['token']).subscribe(res => {
      if(res['success']['status'] == 'success'){
        let userarray = [];
        let data = res['success']['data'];  
        data.forEach(u => {
          userarray.push({id:u.id,name:u.name,phone:u.phone,postcode:u.postcode,status:u.status,town:u.town,user_type:u.user_type,email:u.email})
        })
        // console.log(userarray);
this.userdata =userarray;
      }
    },error => {

    });
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      enableCheckAll:true,
      // selectAllText: 'Select All',
      // unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    
    
  }


  getcompetitons_data(){
    this.ds.apigetmethod('competitions').subscribe(res => {
      if(res['success']['status'] == 'success'){
        let data = res['success']['data'];
        data.forEach(u => {
          let cd = moment().format('YYYY-MM-DD');
          let sd = moment(u.draw_start_date_time,'DD-MM-YYYY').format('YYYY-MM-DD');  
          // moment().format('DD-MM-YYYY') >= u.draw_start_date_time
          if(u.sold == 'false' && moment(sd).isSameOrBefore(cd) == true && u.is_featured == 1){
          this.competitionarray.push({id:u.id,image:u.image,competition:u.competition,description:u.description,
            draw_start_date_time:u.draw_start_date_time,draw_end_date_time:u.draw_end_date_time,draw_month:u.draw_month,
            draw_year:u.draw_year,ticket_count:u.ticket_count,available_tickets:u.available_tickets,free_tickets:u.free_tickets});
          }
        })
// this.competitionarray =competitionarray;
      }
    },error => {

    });
  }

  save_addfreetickets(){
this.isSubmitted = true;
if(this.addfreeticketform.invalid){
  return;
}else if(this.addfreeticketform.controls['no_of_tickets'].value <= 0){
  this.toastr.info('The free tickets should be greater then 0.', 'Info', {
        progressBar:true
      });
      return false;
}else{
 
  if(this.addfreeticketform.value.id){
    const freeticketform = new FormData();
    freeticketform.append('competition_id',this.addfreeticketform.value.competition_id);
    freeticketform.append('user_id',this.user_id);
    freeticketform.append('no_of_tickets',this.addfreeticketform.value.no_of_tickets);
    console.log(freeticketform);
    this.isLoading = true;
    this.ds.postRecords('free/'+this.addfreeticketform.value.id,freeticketform,true).subscribe(res => {
      console.log(res);
      this.isLoading = false;
      if(res['success'].status == 'success'){
        Swal.fire({
          title: 'Success',
          text: res['message'],
          icon: 'success',
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.value) {
            // this.router.navigateByUrl('/view-freeticket-users');
            const navigationExtras = {
              queryParams: {
                  id: this.competition_id 
              }
          };
        this.router.navigate(['/view-freeticket-users'], navigationExtras);
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            // this.router.navigateByUrl('/register');
          }
        })
      }
    },error => {
      this.isLoading = false;
      console.log(error);
    })
  }else{
    
  const freeticketform = new FormData();
  freeticketform.append('competition_id',this.addfreeticketform.value.competition_id);
  freeticketform.append('no_of_tickets',this.addfreeticketform.value.no_of_tickets);
  this
  let user_id = this.addfreeticketform.value.user_id;
  let user_name =[];
  user_id.forEach((u,i)=> {
user_name.push(u.name)
    freeticketform.append('data['+i+'][user_id]',u.id);
  })
  // console.log(this.addfreeticketform.value.no_of_tickets);
  // console.log(user_name.join(',').toUpperCase());
  let ticket_count = Number(user_name.length) * Number(this.addfreeticketform.value.no_of_tickets);
  let give_freeticket = Number(this.sel_comp_availableticket) - Number(this.sel_comp_freetickets);
    // alert(give_freeticket);
    if(Number(this.addfreeticketform.value.no_of_tickets) > Number(this.sel_comp_ticketcount)){
      this.toastr.info("Free Ticket grether then total tickets ", 'Info', {
        progressBar:true
      });
      return;
    }
    if(Number(this.addfreeticketform.value.no_of_tickets) > Number(this.sel_comp_availableticket)){
      this.toastr.info("Free Ticket grether then available tickets ", 'Info', {
        progressBar:true
      });
      return;
    }
    if(Number(ticket_count) > Number(this.sel_comp_availableticket)){
      this.toastr.info("Free Ticket grether then available tickets ", 'Info', {
        progressBar:true
      });
      return;
    }
    // if(Number(this.addfreeticketform.value.no_of_tickets) > Number(this.sel_comp_freetickets)){
    //   this.toastr.info("Free Ticket allocate should be lessthen or equal "+Number(this.sel_comp_freetickets), 'Info', {
    //     progressBar:true
    //   });
    //   return;
    // }
    // return;
    this.isLoading = true;
  this.ds.postRecords('free',freeticketform,true).subscribe(res => {
    this.isLoading = false;
    console.log(res);
    if(res['status'] == 'SUCCESS'){
      Swal.fire({
        title: 'Success',
        text: this.addfreeticketform.value.no_of_tickets+' Free Tickets '+' Asssign to Users '+user_name.join(',').toUpperCase()+' Successful.',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then((result) => {
        if (result.value) {
          this.router.navigateByUrl('/free-ticket');
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // this.router.navigateByUrl('/register');
        }
      })
    }
  },error => {
    this.isLoading = false;
    console.log(error);
  })
}
}
  }

  onSelectAll(eve){

  }

  onItemSelect(e){

  }

  onItemDeSelect(e){

  }
  onCheck(e){

  }

  gettoprevies(){
    const navigationExtras = {
      queryParams: {
          id: this.competition_id 
      }
  };
this.router.navigate(['/free-ticket'], navigationExtras);
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  onchangecompetition(e){
    let c_id = e.target.value;
    let filter_comp = this.competitionarray.filter(c => c.id == c_id);
    console.log(filter_comp[0].available_tickets);
    console.log(filter_comp[0].free_tickets);
    console.log(filter_comp[0].ticket_count);
    this.sel_comp_availableticket = filter_comp[0].available_tickets;
    this.sel_comp_freetickets = filter_comp[0].free_tickets;
    this.sel_comp_ticketcount = filter_comp[0].ticket_count;
  }

}
