import { Component, OnInit } from '@angular/core';
import { FormsModule, FormControl,FormArray,FormGroup,Validator,FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import { error } from 'protractor';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import {IAngularMyDpOptions, IMyDateModel, IMyCalendarViewChanged, IMyRangeDateSelection, AngularMyDatePickerDirective} from 'angular-mydatepicker';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor4 } from 'ckeditor4-angular/ckeditor';

@Component({
  selector: 'app-add-questions',
  templateUrl: './add-questions.component.html',
  styleUrls: ['./add-questions.component.css']
})
export class AddQuestionsComponent implements OnInit {
  isLoading:boolean =false;
  title = "Add Question";
  action_btn = "Save";
  isSubmitted:boolean = false;
  addquestionform:FormGroup;
  file :any = [];
  public date = new Date();
  logininfo:any;
  question_id:any;
  blog_image_url:any;
  blog_image:any;
  blog_image_name:any;
  shownoeditimage:boolean = true;
  showblogimage:boolean = false;
  competitionarray:any = [];
  constructor(private Activate: ActivatedRoute,private fb:FormBuilder,private location: Location,private router: Router,private ds: DataserviceService,private toastr: ToastrService) {
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
    this.getcompetitons_data();
    this.Activate.queryParams.subscribe(res => {
      this.question_id = res.id;
      if(this.question_id){
        this.title = "Edit Question";
        this.action_btn ="Update";
      }else{
        this.title = 'Add Question';
        this.action_btn ="Save";
      }
    this.ds.getmethod('question/'+res.id, this.logininfo['success']['token']).subscribe(res => {
      if(res['success']['status'] == 'success'){
        let data = res['success']['data'];
        if(data == ''){

        }else{
          this.addquestionform.controls['id'].setValue(data.id);
          this.addquestionform.controls['competition_id'].setValue(data.competition_id);
            this.addquestionform.controls['question'].setValue(data.question);
            this.addquestionform.controls['option_a'].setValue(data.option_a);
            this.addquestionform.controls['option_b'].setValue(data.option_b);
            this.addquestionform.controls['option_c'].setValue(data.option_c);
            this.addquestionform.controls['option_d'].setValue(data.option_d);
            this.addquestionform.controls['option_e'].setValue(data.option_e);
            this.addquestionform.controls['answer'].setValue(data.answer);
        }
      
      }
    });
    });
   }

  ngOnInit(): void {
    this.addquestionform = this.fb.group({
      id:[''],
      competition_id:['0'],
      question:['',[Validators.required,Validators.maxLength(200)]],
      option_a:['',Validators.required],
      option_b:['',Validators.required],
      option_c:['',Validators.required],
      option_d:['',Validators.required],
      option_e:['',Validators.required],
      answer:['',Validators.required],
      
    })
  }

  get formControls() { return this.addquestionform.controls; }

  getcompetitons_data(){
    this.ds.apigetmethod('competitions').subscribe(res => {
      if(res['success']['status'] == 'success'){
        let competitionarray = [];
        let data = res['success']['data'];
        data.forEach(u => {
          if(u.sold == "false"){
          this.competitionarray.push({id:u.id,image:u.image,competition:u.competition,description:u.description,
            draw_start_date_time:u.draw_start_date_time,draw_end_date_time:u.draw_end_date_time,draw_month:u.draw_month,
            draw_year:u.draw_year});
          }
        })
// this.competitionarray =competitionarray;
      }
    },error => {

    });
  }

  addquestion(){
    this.isSubmitted = true;
    if(this.addquestionform.invalid){
      // if(this.addquestionform.value.crectanswer == ''){
      //   this.toastr.info('Choose the correct answer', 'Info', {
      //     progressBar:true
      //   });
      //   return;
      // }
      return;
    }else{
      console.log(this.addquestionform.value);
      if(this.addquestionform.value.id){
        this.isLoading = true;
        this.ds.postRecords('question/'+this.addquestionform.value.id,this.addquestionform.value,true).subscribe(res => {
          this.isLoading = false;
          if(res['success']['status'] == 'success'){
            Swal.fire({
              title: 'Updated',
              text: res['success']['message'],
              icon: 'success',
              confirmButtonText: 'OK',
            }).then((result) => {
              if (result.value) {
                this.router.navigateByUrl('/questionslist');
              } else if (result.dismiss === Swal.DismissReason.cancel) {
                // this.router.navigateByUrl('/register');
              }
            })
          }
    },error => {
      this.isLoading =false;
      console.log(error);
    });
      }else{
        this.isLoading = true;
      this.ds.postRecords('question',this.addquestionform.value,true).subscribe(res => {
        this.isLoading = false;
        if(res['status'] == 'SUCCESS'){
          Swal.fire({
            title: 'Success',
            text: res['message'],
            icon: 'success',
            confirmButtonText: 'OK',
          }).then((result) => {
            if (result.value) {
              this.router.navigateByUrl('/questionslist');
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              // this.router.navigateByUrl('/register');
            }
          })
        }
  },error => {
    this.isLoading =false;
    console.log(error);
  });
 
    }
  }
  }
}
