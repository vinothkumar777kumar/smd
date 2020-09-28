import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import { error } from 'protractor';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import Swal from 'sweetalert2'
import * as $ from 'jquery';
import {BehaviorSubject, of, Subject} from 'rxjs';
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators';
import { DataTableDirective } from 'angular-datatables';
import * as moment from 'moment'; 

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger:Subject<any> = new Subject();
  userdata:any = [];
  questionarraydata = [];
  activeticketfdata = [];
  myaccountdata:any;
  logininfo:any;
  filtertickets:any;
  isloading:boolean = false;
  mySubscription:any;
  emptyquestiondata:boolean =true;
  constructor(private location: Location,private router: Router,private ds: DataserviceService,private toastr: ToastrService) {
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
  this.questiondata();
  this.dtOptions = {
    pagingType: 'full_numbers',
    pageLength: 5,
    processing: true
  }
  this.router.routeReuseStrategy.shouldReuseRoute = function () {
    return false;
  };
  
  this.mySubscription = this.router.events.subscribe((event) => {
    if (event instanceof NavigationEnd) {
      // Trick the Router into believing it's last link wasn't previously loaded
      this.router.navigated = false;
    }
  });
   }

  ngOnInit(): void {
  }
  questiondata(){
    this.isloading = true;
    this.emptyquestiondata = false;
    this.ds.getmethod('question',this.logininfo['success']['token']).subscribe(res => {
      this.isloading = false;
      if(res['success']['status'] == 'success'){
        let data = res['success']['data'];
        if(data == ''){
          this.emptyquestiondata = true;
        }else{
          let couponarray = [];
          data.forEach(q => {     
            this.questionarraydata.push({id:q.id,question:q.question,answer:q.answer,competition:q.competition,competition_id:q.competition_id,
              option_a:q.option_a,option_b:q.option_b,option_c:q.option_c,option_d:q.option_d,option_e:q.option_e});
          })
          let item = this.questionarraydata[Math.floor(Math.random() * this.questionarraydata.length)];
          console.log(item);
          if(this.questionarraydata.length <= 0){
            this.emptyquestiondata = true;
          }
          this.dtTrigger.next();
        }
      
              }
    },error => {
      this.isloading = false;
      this.emptyquestiondata = true;
      console.log(error);
    })
  }

  edit_questions(data){
    const navigationExtras = {
      queryParams: {
          id: data.id  
      }
  };
this.router.navigate(['/add-question'], navigationExtras);
  }

  delete_questions(data){
    this.ds.deleterecord('question/'+data.id).subscribe(res => {
      if(res['success']['status'] == "success"){
       Swal.fire({
         title: 'Success',
         text: res['success']['message'],
         icon: 'success',
         confirmButtonText: 'OK',
       }).then((result) => {
         if (result.value) {
           this.questionarraydata = [];
           this.questiondata();
           this.router.navigateByUrl('/questionslist');
         } else if (result.dismiss === Swal.DismissReason.cancel) {
           this.router.navigateByUrl('/questionslist');
         }
       })
      }
     },error=> {
       console.log(error);
     })
  }

}
