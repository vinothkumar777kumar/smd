import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule, FormControl, FormArray, FormGroup, Validator, FormBuilder, Validators, MinLengthValidator } from '@angular/forms';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import * as $ from 'jquery';
import Swal from 'sweetalert2'
import { MovingDirection, WizardComponent } from 'angular-archwizard';
import { error } from 'protractor';
import { IAngularMyDpOptions, IMyDateModel, IMyCalendarViewChanged, IMyRangeDateSelection, AngularMyDatePickerDirective } from 'angular-mydatepicker';
import * as moment from 'moment';
import { createDecipher } from 'crypto';
import { cachedDataVersionTag } from 'v8';





@Component({
  selector: 'app-add-competitions',
  templateUrl: './add-competitions.component.html',
  styleUrls: ['./add-competitions.component.css']
})
export class AddCompetitionsComponent implements OnInit {
  competition_action = "Add Competition";
  isLoading = false;
  urls = new Array<string>();
  isSubmitted = false;
  logininfo: any;
  ticketform: FormGroup;
  competitionform: FormGroup;
  competitionimageform: FormGroup;
  competitionvedioform: FormGroup;
  // completeform:FormGroup;
  api_url: any;
  format: any;
  fileData: File = null;
  file: any = [];
  imagesfile: any = [];
  arrayfiles: any = [];
  fileDatas: any = [];
  Imagearray: FormArray;
  url: any;
  arrayurls: any;
  public date = new Date();
  showticketprice: boolean = false;
  calculate_modal: boolean = false;
  show_calculate: boolean = true;
  finish_calculate: boolean = false;
  salediscountcontrol: boolean = false;
  showcompetitionimage: boolean = false;
  competition_id: any;
  image_url: any;
  update_image: any;
  showticketpricecontrol: boolean = true;
  ticketlabel = "No of Ticket";
  showselectcompetitionimage: boolean = true;
  sliderimage_array = [];
  edit_ticket_price: any;
  ticket_price:any;
  public myDatePickerOptions2: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd-mm-yyyy',
    disableUntil: { day: this.date.getDate() - 1, month: this.date.getMonth() + 1, year: this.date.getFullYear(), }
  };
  public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd-mm-yyyy',
    disableUntil: { day: this.date.getDate() - 1, month: this.date.getMonth() + 1, year: this.date.getFullYear(), }
  };


 
  // public canExitStep1: (MovingDirection) => boolean;
  // public canExitStep2: (MovingDirection) => boolean;
  public canExitStep3: (MovingDirection) => boolean;
  public canExitStep4: (MovingDirection) => boolean;
  @ViewChild(WizardComponent)
  public wizard: WizardComponent;
  // public canExitStep2Backwards = true;
  // public canExitStep2Forwards = true;


  // public canExitStep2: (MovingDirection) => boolean = (direction) => {
  //   console.log(MovingDirection);
  //   switch (direction) {
  //     case MovingDirection.Forwards:
  //       return this.canExitStep2Forwards;
  //     case MovingDirection.Backwards:
  //       return this.canExitStep2Backwards;
  //     case MovingDirection.Stay:
  //       return true;
  //   }
  // };
  @ViewChild('dp') myDp: AngularMyDatePickerDirective;
  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private fb: FormBuilder,
    private location: Location, private router: Router, private ds: DataserviceService,
    private toastr: ToastrService, private Activate: ActivatedRoute) {
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
    if (Number(this.date.getDate()) - 1 == 0) {
      let actualDate = new Date();
      let cd = new Date(actualDate);
    cd.setDate(cd.getDate() - 1);
      // alert(cd.getDate())
      // alert(actualDate.getMonth() + 1);
      // alert(actualDate.getFullYear());
      this.myDatePickerOptions.disableUntil.day = cd.getDate();
      this.myDatePickerOptions.disableUntil.month = cd.getMonth() + 1;
      this.myDatePickerOptions.disableUntil.year = cd.getFullYear();

      this.myDatePickerOptions2.disableUntil.day = cd.getDate();
      this.myDatePickerOptions2.disableUntil.month = cd.getMonth() + 1;
      this.myDatePickerOptions2.disableUntil.year = cd.getFullYear();
    } else {
      this.myDatePickerOptions.disableUntil.day = Number(this.date.getDate()) - 1;
      this.myDatePickerOptions.disableUntil.month = Number(this.date.getMonth() + 1);
      this.myDatePickerOptions.disableUntil.year = Number(this.date.getFullYear());

      this.myDatePickerOptions2.disableUntil.day = Number(this.date.getDate()) - 1;
      this.myDatePickerOptions2.disableUntil.month = Number(this.date.getMonth() + 1);
      this.myDatePickerOptions2.disableUntil.year = Number(this.date.getFullYear());
    }

   
    this.image_url = this.ds.getiamgeAPI();
    if (!this.logininfo) {
      this.router.navigateByUrl('/login')
    }

    this.ticketform = this.fb.group({
      competition_id: [''],
      ticket_count: ['', Validators.required],
      ticket_price: ['', Validators.required],
      is_soldout: ['0'],
      is_onsale: ['0']
    });
    this.competitionform = this.fb.group({
      competition_id: [''],
      image: ['', Validators.required],
      competition: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(5)]],
      draw_start_date_time: ['', Validators.required],
      draw_end_date_time: ['', Validators.required],
      // draw_month: ['',Validators.required],
      // draw_year: ['',Validators.required],
      is_active: ['1', Validators.required],
      is_cashdraw: ['0', Validators.required],
      is_draft: ['0', Validators.required],
      is_drawn: ['0', Validators.required],
      is_featured: ['1', Validators.required],
      is_slider:['1']
    });

    this.competitionimageform = this.fb.group({
      competition_id: ['', Validators.required],
      image_array: new FormArray([
        this.upload_images()
      ]),
      
    })
    // this.completeform = this.fb.group({
    //   question:['',Validators.required],
    // })



    this.competitionvedioform = this.fb.group({
      competition_id: ['', Validators.required],
      video_url: ['', Validators.required]
    })

  }

  ngOnInit(): void {

    let d: Date = new Date();
    d.setDate(d.getDate());
    let model: IMyDateModel = { isRange: false, singleDate: { jsDate: d }, dateRange: null };
    console.log(moment(model.singleDate.jsDate).format('YYYY-MM-DD'));
    // this.canExitStep1 = (direction) => {
    //   switch (direction) {
    //     case MovingDirection.Forwards:
    //       return true;
    //     case MovingDirection.Backwards:
    //       return true;
    //     case MovingDirection.Stay:
    //       return false;
    //   }
    // };

    this.canExitStep2 = (direction) => {
      console.log('dirction' + direction);
      switch (direction) {
        case MovingDirection.Forwards:
          return false;
        case MovingDirection.Backwards:
          return true;
        case MovingDirection.Stay:
          return false;
      }
    };

    this.canExitStep3 = (direction) => {
      console.log('dirction' + direction);
      switch (direction) {
        case MovingDirection.Forwards:
          return true;
        case MovingDirection.Backwards:
          return true;
        case MovingDirection.Stay:
          return false;
      }
    };

  }

  get imageControls() { return this.competitionimageform.controls; }
  get competitionformControls() { return this.competitionform.controls; }

  upload_images() {
    return this.fb.group({
      image_url: ['', Validators.required],
    });

   
  }
  get getimageItems() {
    return this.competitionimageform.get('image_array') as FormArray;
  }
  addimage_control() {
    let image_control = this.competitionimageform.get('image_array') as FormArray;
    image_control.push(this.upload_images());
  }

  get formControls() { return this.ticketform.controls; }


  fileProgress(fileInput: any) {
    console.log(fileInput)
    let fileData = fileInput.target.files[0];
    this.file = fileData;
    // let arr = fileData.split('/'); 
    console.log(this.file);
  }

  // onSelectFile(event) {
  //   const file = event.target.files && event.target.files[0];
  //   this.file = event.target.files[0];
  //   if (file) {
  //     var reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     if(file.type.indexOf('image')> -1){
  //       this.format = 'image';
  //     } else if(file.type.indexOf('video')> -1){
  //       this.format = 'video';
  //     }
  //     reader.onload = (event) => {
  //       this.url = (<FileReader>event.target).result;
  //     }
  //   }
  // }



  save_ticket(data) {
    this.canExitStep2 = (direction) => {
      console.log('dirction' + direction);
      switch (direction) {
        case MovingDirection.Forwards:
          return true;
      }
    };
    this.ticketform.controls['competition_id'].setValue(this.competition_id);

    console.log(this.ticketform.value);
    // return;
    if (this.ticketform.value.competition_id) {
      
      if (this.ticket_price > this.ticketform.value.ticket_price) {
        this.toastr.error('Ticket price should be greater than or equal to  '+this.ticket_price, 'Info', {
          progressBar: true,
          closeButton: true
        });
        return;
      }
      if (this.ticketform.value.ticket_count <= 0) {
        this.toastr.error('No of Ticket should be greater then zero', 'Info', {
          progressBar: true,
          closeButton: true
        });
        return;
      }
      if (this.ticketform.value.ticket_price <= 0) {
        this.toastr.error('Ticket Price should be greater then zero', 'Info', {
          progressBar: true,
          closeButton: true
        });
        return;
      }
      this.isLoading = true;
      this.ds.postRecords('ticket', this.ticketform.value).subscribe(ticketres => {
        this.isLoading = false;
        if (ticketres['status'] == 'SUCCESS') {
          this.wizard.goToStep(3);
          this.wizard.goToNextStep();
          this.competitionimageform.controls['competition_id'].setValue(this.competition_id);
          this.competition_id = '';
          // alert(this.ticketform.value.competition_id);
          // Swal.fire({
          //   title: ticketres['status'],
          //   text: ticketres['message'],
          //   icon: 'success',
          //   confirmButtonText: 'OK',
          // }).then((result) => {
          //   if (result.value) {

          //   } else if (result.dismiss === Swal.DismissReason.cancel) {
          //   }
          // })

        } else {
          this.canExitStep2 = (direction) => {
            console.log('dirction' + direction);
            switch (direction) {
              case MovingDirection.Forwards:
                return false;
              case MovingDirection.Backwards:
                return false;
              case MovingDirection.Stay:
                return false;
            }
          };
        }
      }, error => {
        this.isLoading = false;
        console.log(error);
      });

    } else {
      this.canExitStep2 = (direction) => {
        console.log('dirction' + direction);
        switch (direction) {
          case MovingDirection.Forwards:
            return true;
        }
      };

    }

  }


  enterSecondStep(data) {
    if (this.ticketform.controls['ticket_price'].value < this.ticketform.controls['sale_price'].value) {
      this.ticketform.controls['sale_price'].setValue('');
      // alert('Sale price Should be less than the ticket price');
      return;
    } console.log(data);
    return;
  }

  finishFunction() {
    this.isSubmitted = true;
    console.log(this.competitionimageform.value);
    if (this.competitionimageform.invalid) {
      // alert('invalid');
      this.canExitStep3 = (direction) => {
        console.log('dirction' + direction);
        switch (direction) {
          case MovingDirection.Forwards:
            return true;
          case MovingDirection.Backwards:
            return false;
          case MovingDirection.Stay:
            return false;
        }
      };
      this.toastr.info('Select Image', 'Info', {
        progressBar: true
      });
      return;
    } else {
      //  alert('enterapi');
      this.isLoading = true;
      const myimageformdata = new FormData();
      myimageformdata.append('competition_id', this.competitionimageform.controls['competition_id'].value);
      console.log(this.fileDatas.length);
      if (this.fileDatas) {
        for (let i = 0; i <= this.fileDatas.length - 1; i++) {
          // this.fileDatas[i].description=this.documentarray.value[i].description
          let data = 'image_url[' + i + ']';
          myimageformdata.append(data, this.fileDatas[i].image_url);
        }
      }
      this.ds.postRecords('image', myimageformdata, true).subscribe(imageres => {
        console.log(imageres,'errorimage res');
        if (imageres['validation_errors']) {
          this.isLoading = false;
          this.toastr.error('The image must be an imagefile then must be a file of type: jpeg, png, jpg, gif, svg.', 'Error', {
            progressBar: true
          });
          return true;
          // for(let i=0;i<=this.addimage_control.value.length-1;i++) {

          //   alert(imageres['validation_errors']['image_url.'+i]);
          // }
          return;

        } else if (imageres['status'] == 'SUCCESS') {
          this.isLoading = false;
          Swal.fire({
            //  title: imageres['status'],
            text: 'Competition has been created successfully',
            icon: 'success',
            confirmButtonText: 'OK',
          }).then((result) => {
            if (result.value) {

              this.router.navigateByUrl('/competitions');
            } else if (result.dismiss === Swal.DismissReason.cancel) {
            }
          })

        } else {
          this.canExitStep3 = (direction) => {
            console.log('dirction' + direction);
            switch (direction) {
              case MovingDirection.Forwards:
                return false;
              case MovingDirection.Backwards:
                return true;
              case MovingDirection.Stay:
                return false;
            }
          };
        }
      }, error => {
        this.isLoading = false;
        console.log(error,'errorimage timeout');
      })
    }









    //   let competition_data =  this.http.post(this.api_url + 'competition',myFormData,headers);
    //  let ticket_data =  this.http.post(this.api_url + 'ticket',this.ticketform.value,headers);
    //  let competition_image_data =  this.http.post(this.api_url + 'image',this.competitionimageform.value,headers);
    //  let competition_vedio_data =  this.http.post(this.api_url + 'video',this.competitionvedioform.value,headers);
    //  forkJoin([competition_data,ticket_data,competition_image_data,competition_vedio_data]).subscribe(result => {
    //    console.log(result);
    //  })

  }

  save_competition() {

    // console.log(this.competitionform.value.draw_start_date_time,this.competitionform.value.draw_end_date_time,'saveticket competiton')
    // let draw_date = this.competitionform.value.draw_start_date_time;
    //     let dd = draw_date['singleDate']['date'];
    //     let draw_end_date = this.competitionform.value.draw_end_date_time;
    //     let vt = draw_end_date['singleDate']['date'];
    //     let dasd = dd.day+'-'+dd.month+'-'+dd.year;
    //     let daed = vt.day+'-'+vt.month+'-'+vt.year;
    //     console.log(dasd,daed)
    //     if(daed < dasd){
    //       this.toastr.error('Draw end date should be greater then draw start date.test', 'Error', {
    //         progressBar:true
    //       });
    //       return;
    //     }

    console.log('idt' + this.competition_id);
    if (this.competitionform.invalid) {
      this.canExitStep1 = (direction) => {
        console.log('dirction' + direction);
        switch (direction) {
          case MovingDirection.Forwards:
            return false;
          case MovingDirection.Backwards:
            return false;
          case MovingDirection.Stay:
            return false;
        }
      };
      return
    } else if (this.competitionform.value.competition_id == '') {
      let date1 = this.competitionform.value.draw_start_date_time;
      this.competitionform.controls['draw_start_date_time'].setValue(date1.singleDate.formatted);
      let date2 = this.competitionform.value.draw_end_date_time;
      // console.log(date2)
      let enddate = date2.singleDate.date;
      let rplace = /^0+/;
      let sd = (enddate.day < 10 ? '0' : '') + (enddate.day);
      let sm = (enddate.month < 10 ? '0' : '') + (enddate.month);
      this.competitionform.controls['draw_end_date_time'].setValue(sd + '-' + sm + '-' + enddate.year);
      console.log(this.competitionform.value.draw_end_date_time);
      this.isLoading = true;
      const myFormData = new FormData();
      myFormData.append('image', this.file, this.file.name);
      myFormData.append('competition', this.competitionform.value.competition);
      myFormData.append('description', this.competitionform.value.description);
      myFormData.append('draw_start_date_time', this.competitionform.value.draw_start_date_time);
      myFormData.append('draw_end_date_time', this.competitionform.value.draw_end_date_time);
      myFormData.append('draw_month', this.competitionform.value.draw_month);
      myFormData.append('draw_year', this.competitionform.value.draw_year);
      myFormData.append('is_active', this.competitionform.value.is_active);
      myFormData.append('is_cashdraw', this.competitionform.value.is_cashdraw);
      myFormData.append('is_draft', this.competitionform.value.is_draft);
      myFormData.append('is_drawn', this.competitionform.value.is_drawn);
      myFormData.append('is_featured', this.competitionform.value.is_featured);
      myFormData.append('is_rollover', '0');
      myFormData.append('is_slider', this.competitionform.value.is_slider);
      // return;
      this.ds.postRecords('competition', myFormData, true).subscribe(competitionres => {
        this.isLoading = false;
        console.log(competitionres)
        if (competitionres['status'] == 'SUCCESS') {
          this.wizard.goToStep(2);
          this.wizard.goToNextStep();
          // alert(competitionres['data']['id']);
          this.competition_id = competitionres['data']['id'];
          this.ticketform.controls['competition_id'].setValue(competitionres['data']['id']);
          // alert(this.ticketform.value.competition_id);
          this.competitionform.controls['competition_id'].setValue(competitionres['data']['id']);
          this.competitionimageform.controls['competition_id'].setValue(competitionres['data']['id']);

          Swal.fire({
            // title: "Info",
            text: "Do you wish to calculate total ?",
            icon: 'info',
            confirmButtonText: 'OK',
            showCancelButton: true,
            cancelButtonAriaLabel: 'Cancel'
          }).then((result) => {
            if (result.value) {
              jQuery('#calculatemodal').modal('toggle');
              // this.ticketform.controls['competition_id'].setValue(competitionres['data']['id']);
              this.competition_id = competitionres['data']['id'];
              // this.calculate_modal = true;
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              // this.ticketform.controls['competition_id'].setValue(competitionres['data']['id']);
              this.competition_id = competitionres['data']['id'];
              // jQuery('#calculatemodal').modal('hide');
              // $('#calculatemodal').show();
              // this.calculate_modal = true;
            }
          })

        } else {
          this.canExitStep1 = (direction) => {
            console.log('dirction' + direction);
            switch (direction) {
              case MovingDirection.Forwards:
                return false;
              case MovingDirection.Backwards:
                return false;
              case MovingDirection.Stay:
                return true;
            }
          };
        }
      });
    }
  }

  canExitStep1: (MovingDirection) => boolean = (direction) => {
    switch (direction) {
      case MovingDirection.Forwards:
        return true;
        case MovingDirection.Backwards:
        return false;
    }
  }

  canExitStep2: (MovingDirection) => boolean = (direction) => {
    switch (direction) {
      case MovingDirection.Forwards:
        return true;
      case MovingDirection.Backwards:
        return false;
    }
  }


  detectFiles(fileInput, index) {
    console.log(fileInput);
    let fileData = fileInput.target.files[0];
    this.imagesfile = fileData;
    let file = this.imageControls.image_array.value[index];
    file.image_url = this.imagesfile;
    file.index = index;
    console.log('pushfile' + file.image_url);
    if (this.fileDatas[index]) {
      this.fileDatas[index] = file;
    } else {
      this.fileDatas.push(file);
    }

  }

  // detectFiles(event) {
  //   console.log(event.target.files);
  //   this.urls = [];
  //   let files = event.target.files;
  //   if (files) {
  //     for (let file of files) {
  //       let reader = new FileReader();
  //       reader.onload = (e: any) => {
  //         this.urls.push(e.target.result);
  //       }
  //       reader.readAsDataURL(file);
  //     }
  //   }
  //   console.log(this.urls);
  // }

  close_image(i) {
    console.log(this.Imagearray);
    let image = this.competitionimageform.get('image_array') as FormArray;
    let controls = image.controls;
    console.log(controls)
    controls.splice(i, 1);
    console.log(controls)
    this.getimageItems.removeAt(i);
  }

  numberOnly(evt): boolean {
    // const charCode = (event.which) ? event.which : event.keyCode;
    // if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    //   return false;
    // }
    // return true;

    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57))
      return false;


  }


  onDateChanged(event, text_date) {
    // let {date, jsDate, formatted, epoc} = event.singleDate;
    // console.log(event['singleDate'])
    if (text_date == 'start_date') {
      this.competitionform.controls['draw_start_date_time'].setValue(event.singleDate.formatted);
      let start_date = event['singleDate'].date;
      if(start_date.day == 1){
        console.log(new Date(start_date));
      }
      console.log(start_date);
      // this.myDatePickerOptions2 = {
      //   dateRange: false,
      //   dateFormat: 'dd-mm-yyyy',
      //   disableUntil: { day: start_date.day - 1, month: start_date.month, year: start_date.year }
      // };
      if (Number(start_date.day) - 1 == 0) {
        let actualDate = new Date(Number(new Date(start_date.year + "-" + start_date.month + "-" + start_date.day)) - 1);
        this.myDatePickerOptions2.disableUntil.day = actualDate.getDate();
        this.myDatePickerOptions2.disableUntil.month = actualDate.getMonth() + 1;
        this.myDatePickerOptions2.disableUntil.year = actualDate.getFullYear();
      } else {
        this.myDatePickerOptions2.disableUntil.day = Number(start_date.day) - 1;
        this.myDatePickerOptions2.disableUntil.month = Number(start_date.month);
        this.myDatePickerOptions2.disableUntil.year = Number(start_date.year);
      }
      console.log(event.singleDate.formatted);
      var future = new Date(start_date.year + '-' + start_date.month + '-' + start_date.day); // get today date
      future.setDate(future.getDate() + 6); // add 7 days
      var finalDate = future.getFullYear() + '-' + ((future.getMonth() + 1) < 10 ? '0' : '') + (future.getMonth() + 1) + '-' + future.getDate();
      let split_date = finalDate.split('-');

      let rplace = /^0+/;
      let sm = split_date[1].replace(rplace, '');
      let sd = split_date[2].replace(rplace, '');
      console.log(split_date, sd, sm);
      this.competitionform.controls['draw_end_date_time'].setValue({
        isRange: false, singleDate: {
          date: {
            year: split_date[0],
            month: sm,
            day: sd
          }
        }
      }
      );
    } else if (text_date == 'end_date') {
      this.competitionform.controls['draw_end_date_time'].setValue(event.singleDate.formatted);
      //  let start_date = this.addcampform.controls['start_date'].value
      // let start_time = this.addcampform.controls['start_time'].value;
      // let end_time = this.addcampform.controls['end_time'].value;
      // if((start_time == '' || start_time == null) && (end_time == '' || end_time == null)){

      // Swal.fire('Error','Please Select Camp Start Time and End Time', 'error');
      // setTimeout(() => {
      // this.addcampform.controls['start_time'].reset();
      // this.addcampform.controls['end_time'].reset();
      // this.addcampform.controls['start_date'].reset();
      // this.addcampform.controls['end_date'].reset();
      //       },1000);
      //       return;
      //   }else if(start_date == '' || start_date == null){
      //     Swal.fire('Error','Please Select Camp start date', 'error');
      //       setTimeout(() => {
      //         this.addcampform.controls['start_time'].reset();
      //         this.addcampform.controls['end_time'].reset();
      //         this.addcampform.controls['end_date'].reset();
      //       },1000);
      //       return;
      //   }else{
      //     this.isselectcampdate = true;
      //     let sd = this.addcampform.controls['start_date'].value;
      //     let start_date = sd.singleDate.jsDate;
      //     let end_date = event.singleDate.jsDate;
      //    let array_date =  this.getDateArray(new Date(moment(start_date).format('YYYY-MM-DD')),new Date(moment(end_date).format('YYYY-MM-DD')));
      //    let datetime = [];
      //    array_date.forEach(e => {
      //      console.log(this.starttime + this.endtime);
      //  datetime.push({date:e,start_time:this.starttime,end_time: this.endtime})
      //    })
      //    this.addcampform.addControl('selecteddate', new FormArray([ ]));   
      //    let selectdate = this.addcampform.get('selecteddate') as FormArray;
      //    datetime.forEach(date => {
      //      console.log(date);
      //      selectdate.push(
      //        this.fb.group({
      //          date: new FormControl(date.date),
      //          select_start_time:new FormControl(date.start_time),
      //          select_end_time: new FormControl(date.end_time)
      //        })
      //      )
      //    });
      //    console.log(this.addcampform.value);
      //  this.selectedcamparray_date = array_date;
      // });
    }


  }



  onDateRange(checked: boolean): void {
    // this.model = null;
    let copy = this.getCopyOfOptions();
    copy.dateRange = checked;
    this.myDatePickerOptions = copy;
  }

  getCopyOfOptions(): IAngularMyDpOptions {
    return JSON.parse(JSON.stringify(this.myDatePickerOptions));
  }

  onCalendarViewChanged(event: IMyCalendarViewChanged): void {
    console.log('onCalendarViewChanged(): Year: ', event.year, ' - month: ', event.month, ' - first: ', event.first, ' - last: ', event.last);
  }

  onDateRangeSelection(event: IMyRangeDateSelection): void {
    console.log('onDateRangeSelection(): event: ', event);
  }

  toggleCalendar() {
    console.log('toggelcal2');
    this.cdr.detectChanges();
    this.myDp.toggleCalendar();
  }

  openmodal(e){
    console.log(e);
    jQuery('#calculatemodal').modal('show');
  }

  calculate_amount() {
    let total_amt = $('#total_amount').val();
    if (total_amt == '') {
      this.toastr.error('Please enter total amount', 'Info', {
        progressBar: true,
        closeButton: true
      });
    } else {
      console.log(total_amt);
      let parse_ta = total_amt;
      let ticket_price = Number(total_amt) / 500;
      if (ticket_price) {
        console.log(ticket_price);
        this.showticketprice = true;
        $('#ticket_price').text(ticket_price.toFixed(2));
      }
    }
  }

  calculate_submit() {
    let total_amount = $('#total_amount').val();
    let no_of_tickets = $('#no_of_tickets').val();
    if (total_amount == '') {
      this.toastr.error('Please enter total amount', 'Info', {
        progressBar: true,
        closeButton: true
      });
    } else if (no_of_tickets == '') {
      this.toastr.error('Please enter no of tickets', 'Info', {
        progressBar: true,
        closeButton: true
      });
    } else {
      let ticketprice =Number(total_amount) / Number(no_of_tickets);
      if(ticketprice < 0.01){
        this.toastr.error('Ticket price should be greater than to 0', 'Info', {
          progressBar: true,
          closeButton: true
        });
        return;
      }else{
        this.finish_calculate = true;
      this.show_calculate = false;
      $('#ticket_price').val(ticketprice.toFixed(2));
      }
      
    }
  }

  calculate_setvalue() {
    let total_amt = $('#total_amount').val();
    let no_of_tickets = $('#no_of_tickets').val();
    this.ticket_price = $('#ticket_price').val();
    this.ticketform = this.fb.group({
      competition_id: [''],
      letter_count: ['', Validators.required],
      ticket_count: ['', Validators.required],
      ticket_price: ['', Validators.required],
      is_soldout: ['0', Validators.required],
      is_onsale: ['0', Validators.required]
    });
    let letter_count = Number(no_of_tickets) / 500;
    // this.ticketform.controls['ticket_price'].setValue()
    // console.log(ticket_price);
   
    this.ticketform.controls['ticket_count'].setValue(no_of_tickets);
    this.ticketform.controls['ticket_price'].setValue(this.ticket_price);
    this.ticketform.controls['letter_count'].setValue(Math.round(letter_count));
    jQuery('#calculatemodal').modal('hide');
  }

  calculate_submit_cancel() {
    this.finish_calculate = false;
    this.show_calculate = true;
    $('#total_amount').val('');
  $('#no_of_tickets').val('');
    $('#ticket_price').val('');
  }

  deleteImage(): void {
    this.update_image = '';
    this.ds.postRecords('competitionimage/' + this.competition_id, this.logininfo['success']['token']).subscribe(res => {
      if (res['success'].status == 'success') {
        Swal.fire({
          title: 'Deleted',
          text: res['success'].message,
          icon: 'success',
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.value) {
            this.showselectcompetitionimage = true;
            this.showcompetitionimage = false;
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            this.router.navigateByUrl('/register');
          }
        })

      }
    }, error => {
      console.log(error);
    })
  }






}
