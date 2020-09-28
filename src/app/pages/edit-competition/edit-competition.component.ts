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

@Component({
  selector: 'app-edit-competition',
  templateUrl: './edit-competition.component.html',
  styleUrls: ['./edit-competition.component.css']
})
export class EditCompetitionComponent implements OnInit {
  isSubmitted: boolean = false;
  isLoading = false;
  competitionname: string;
  competitionform: FormGroup;
  competitionimageform: FormGroup;
  public date = new Date();
  logininfo: any;
  image_url: any;
  competition_id: any;
  showcompetitionimage: boolean = false;
  update_image: any;
  sliderimage_array = [];
  imagesfile: any = [];
  fileDatas = [];
  fileData: File = null;
  file: any = [];
  image_name: any;
  showselectcompetitionimage: boolean = false;
  public myDatePickerOptions2: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd-mm-yyyy',
    disableUntil: { day: this.date.getDate() - 1, month: this.date.getMonth() + 1, year: this.date.getFullYear(), }
  };
  public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd-mm-yyyy',
    disableUntil: { day: this.date.getDate() - 1, month: this.date.getMonth() + 1, year: this.date.getFullYear() }
  };

  // public canExitStep1: (MovingDirection) => boolean;
  public canExitStep2: (MovingDirection) => boolean;
  @ViewChild(WizardComponent)
  public wizard: WizardComponent;
  // @ViewChild('dp') myDp: AngularMyDatePickerDirective;
  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private fb: FormBuilder,
    private location: Location, private router: Router, private ds: DataserviceService,
    private toastr: ToastrService, private Activate: ActivatedRoute) {
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
    this.Activate.queryParams.subscribe(res => {
      this.competition_id = res.id;
      // alert(this.competition_id);
      if (this.competition_id) {
        this.showcompetitionimage = true;
      } else {
        this.showcompetitionimage = false;
      }

      this.ds.getmethod('competition/' + this.competition_id, this.logininfo['success']['token']).subscribe(res => {
        if (res['success']['status'] == 'success') {
          let data = res['success']['data'];
          if (data == '') {

          } else {
            // console.log(data.description);
            this.competitionform.controls['competition_id'].setValue(data.id);
            this.competitionform.controls['competition'].setValue(data.competition);
            this.competitionname = data.competition;
            if (data.image == '') {
              this.showselectcompetitionimage = true;
              this.showcompetitionimage = false;
            } else {
              this.showselectcompetitionimage = false;
              this.showcompetitionimage = true;
            }
            this.image_name = data.image;
            let file = this.image_url + data.image;
            this.update_image = this.image_url + data.image;
            this.competitionform.controls['image'].setValue(null);
            this.competitionform.controls['description'].setValue(data.description);
            let sdate = data.draw_start_date_time.split('-');
            let edate = data.draw_end_date_time.split('-');
            let sd_split = sdate[0] + '-' + sdate[1] + '-' + sdate[2];
            let ed_split = edate[0] + '-' + edate[1] + '-' + edate[2];
            let rplace = /^0+/;
            let date = sdate[0].replace(rplace, '');
            let month = sdate[1].replace(rplace, '');
            let ed = edate[0].replace(rplace, '');
            let em = edate[1].replace(rplace, '');
            if (Number(date) - 1 == 0) {
              let actualDate = new Date(Number(new Date(sdate[2] + "-" + month + "-" + date)) - 1);
              this.myDatePickerOptions.disableUntil.day = actualDate.getDate();
              this.myDatePickerOptions.disableUntil.month = actualDate.getMonth() + 1;
              this.myDatePickerOptions.disableUntil.year = actualDate.getFullYear();
            } else {
              this.myDatePickerOptions.disableUntil.day = Number(date) - 1;
              this.myDatePickerOptions.disableUntil.month = Number(month);
              this.myDatePickerOptions.disableUntil.year = Number(sdate[2]);
            }
            this.competitionform.controls['draw_start_date_time'].setValue({
              isRange: false, singleDate: {
                date: {
                  year: sdate[2],
                  month: month,
                  day: date
                }
              }
            });
            this.competitionform.controls['draw_end_date_time'].setValue({
              isRange: false, singleDate: {
                date: {
                  year: edate[2],
                  month: em,
                  day: ed
                }
              }
            });
            this.competitionform.controls['is_featured'].setValue(data.is_featured);
            this.competitionform.controls['is_active'].setValue(data.is_active);
            this.competitionform.controls['is_slider'].setValue(data.is_slider);
            
          }
        }
      });

      this.ds.getmethod('image?competition_id=' + this.competition_id, this.logininfo['success']['token']).subscribe(res => {
        if (res['success']['status'] == 'success') {
          let data = res['success']['data'];
          if (data == '') {
  
          } else {
            data.forEach(async(i) => {
              let url = this.image_url + '/' + this.competition_id + '/' + i.image_url;
              let image = await this.urlToObject('/' + this.competition_id + '/' + i.image_url);
              // console.log("constr - " + i);
              // console.log(image);
              if(image != null)
                this.sliderimage_array.push({ id: i.id, competition_id: i.competition_id, image_url: url, image_str: i.image_url})
            })
            this.competitionimageform.controls['competition_id'].setValue(this.competition_id);
          }
          // console.log(this.sliderimage_array);
          
        }
      });
    });

    this.image_url = this.ds.getiamgeAPI();
    if (!this.logininfo) {
      this.router.navigateByUrl('/login')
    }


  }

  ngOnInit(): void {
    this.competitionform = this.fb.group({
      competition_id: [''],
      image: [''],
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
      ])
    })
   
setTimeout(() => {
 
},2000)
    

    // alert('idt'+this.competitionform.value.draw_start_date_time);
    // alert('idt'+this.competitionform.value.draw_end_date_time);
    // alert('idt'+this.competitionform.value.competition_id);
  }

  get imageControls() { return this.competitionimageform.controls; }
  get competitionformControls() { return this.competitionform.controls; }



 

  upload_images() {
    return this.fb.group({
      image_url: ['', Validators.required],
    });
  }

  addimage_control() {
    let image_control = this.competitionimageform.get('image_array') as FormArray;
    image_control.push(this.upload_images());
  }

  detectFiles(fileInput, index) {
    // console.log(fileInput);
    let fileData = fileInput.target.files[0];
    this.imagesfile = fileData;
    let file = this.imageControls.image_array.value[index];
    file.image_url = this.imagesfile;
    file.index = index;
    // console.log('pushfile' + file.image_url);
    if (this.fileDatas[index]) {
      // this.fileDatas[index] = file;
      this.fileDatas.push(file.image_url);
    } else {
      // this.fileDatas.push({image_file:file.image_url,name:file.image_url.name});
      this.fileDatas.push(file.image_url);
    }

  }

  fileProgress(fileInput: any) {
    // console.log(fileInput)
    let fileData = fileInput.target.files[0];
    this.file = fileData;
    // let arr = fileData.split('/'); 
    // console.log(this.file);
  }

  onDateChanged(event, text_date) {
    // let {date, jsDate, formatted, epoc} = event.singleDate;
    // console.log(event)
    if (text_date == 'start_date') {
      this.competitionform.controls['draw_start_date_time'].setValue(event.singleDate.formatted);
      let start_date = event['singleDate'].date;
      this.myDatePickerOptions2 = {
        dateRange: false,
        dateFormat: 'dd-mm-yyyy',
        disableUntil: { day: start_date.day - 1, month: start_date.month, year: start_date.year }
      };
      // console.log(event.singleDate.formatted);
      var future = new Date(start_date.year + '-' + start_date.month + '-' + start_date.day); // get today date
      future.setDate(future.getDate() + 6); // add 7 days
      var finalDate = future.getFullYear() + '-' + ((future.getMonth() + 1) < 10 ? '0' : '') + (future.getMonth() + 1) + '-' + future.getDate();
      let split_date = finalDate.split('-');

      let rplace = /^0+/;
      let sm = split_date[1].replace(rplace, '');
      let sd = split_date[2].replace(rplace, '');
      // console.log(split_date, sd, sm);
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

  urlToObject = async (imageName) => {
    const response = await fetch((this.image_url + imageName));
    if(response.ok) {
      const blob = await response.blob();
      // console.log(blob)
      // const file = new File([blob], imageName, {type: blob.type});
      return blob;
    } else {
      return null;
    }
  }

   async finishFunction() {
    this.isSubmitted = true;
    // alert(this.sli);
    if (this.competitionimageform.invalid) {
      
      this.canExitStep2 = (direction) => {
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
      this.toastr.error('Please select image', 'Error', {
        progressBar: true
      });
      return false;
    }else if(this.sliderimage_array.length == 0 && this.fileDatas.length == 0 ){
      this.toastr.error('Please select image', 'Error', {
        progressBar: true
      });
      return false;
    } else {
      this.isLoading = true;
      this.competition_id = this.competitionimageform.value.competition_id;
//     let data = [];
// this.sliderimage_array.forEach(img => {
//   data.push({img_str:img.image_str})
// alert(this.competition_id);
// const myimageformdata = new FormData();
//       myimageformdata.append('competition_id', this.competitionimageform.controls['competition_id'].value);
//   let tempArr = this.sliderimage_array;
//   let imgIndex = 0;
//   for(let i=0; i < tempArr.length; i++) {
//     console.log(i);
//    let image = await this.urlToObject("/" + this.competition_id + "/" + tempArr[i].image_str);
//    console.log(image);
//    let data = 'image_url[' + i + ']';
//    imgIndex = i;
//    console.log(tempArr[i].image_str);
//     myimageformdata.append(data, image, tempArr[i].image_str);
//   }

//   this.fileDatas.length > 0 && this.fileDatas.forEach((file, i) => {
//     imgIndex++;
//     myimageformdata.append('image_url[' + imgIndex + ']', file, file.name);
//   });

// }


// console.log(myimageformdata);
// window.fd = myimageformdata;
// console.log(this.fileDatas);
// return;
if(this.fileDatas.length > 0){

  const myimageformdata = new FormData();
  myimageformdata.append('competition_id', this.competitionimageform.controls['competition_id'].value);
  this.fileDatas.length > 0 && this.fileDatas.forEach((file, i) => {
    // imgIndex++;
    myimageformdata.append('image_url[' + i + ']', file, file.name);
  });
      this.ds.postRecords('image', myimageformdata, true).subscribe(imageres => {
        if (imageres['validation_errors']) {
          this.isLoading = false;
          this.toastr.error('The image must be an imagefile then must be a file of type: jpeg, png, jpg, gif, svg.', 'Error', {
            progressBar: true
          });
          return true;
          // for(let i=0;i<=this.Imagearray.value.length-1;i++) {

          //   alert(imageres['validation_errors']['image_url.'+i]);
          // }
          return;

        } else if (imageres['status'] == 'SUCCESS') {
          this.isLoading = false;
          Swal.fire({
            //  title: imageres['status'],
            text: imageres['message'],
            icon: 'success',
            confirmButtonText: 'OK',
          }).then((result) => {
            if (result.value) {

              this.router.navigateByUrl('/competitions');
            } else if (result.dismiss === Swal.DismissReason.cancel) {
            }
          })

        } else {
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
        }
      }, error => {
        this.isLoading = false;
        console.log(error);
      })
    }else{
      this.isLoading = false;
      Swal.fire({
        //  title: imageres['status'],
        text: 'Competition update successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then((result) => {
        if (result.value) {

          this.router.navigateByUrl('/competitions');
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      })
    }
    }









    //   let competition_data =  this.http.post(this.api_url + 'competition',myFormData,headers);
    //  let ticket_data =  this.http.post(this.api_url + 'ticket',this.ticketform.value,headers);
    //  let competition_image_data =  this.http.post(this.api_url + 'image',this.competitionimageform.value,headers);
    //  let competition_vedio_data =  this.http.post(this.api_url + 'video',this.competitionvedioform.value,headers);
    //  forkJoin([competition_data,ticket_data,competition_image_data,competition_vedio_data]).subscribe(result => {
    //    console.log(result);
    //  })

  }

  async save_competition() {
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

    
    // alert(this.competitionform.value.competition_id);
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
    } else if (this.competitionform.value.competition_id == this.competition_id) {
      this.canExitStep1 = (direction) => {
        console.log('dirction' + direction);
        switch (direction) {
          case MovingDirection.Forwards:
            return true;
          case MovingDirection.Backwards:
            return true;
          case MovingDirection.Stay:
            return true;
        }
      };
      
      this.isLoading = true;
      // alert(this.competitionform.value.competition_id)
      let date1 = this.competitionform.value.draw_start_date_time;
      let startd = date1.singleDate.date;
      let rplace = /^0+/;
      let dsd = (startd.day < 10 ? '0' : '') + (startd.day);
      let dem = (startd.month < 10 ? '0' : '') + (startd.month);
      this.competitionform.controls['draw_start_date_time'].setValue(dsd + '-' + dem + '-' + startd.year);
      let date2 = this.competitionform.value.draw_end_date_time;
      let enddate = date2.singleDate.date;
      let sd = (enddate.day < 10 ? '0' : '') + (enddate.day);
      let sm = (enddate.month < 10 ? '0' : '') + (enddate.month);
      this.competitionform.controls['draw_end_date_time'].setValue(sd + '-' + sm + '-' + enddate.year);
      this.isLoading = true;
      const myFormData = new FormData();
      let image = await this.urlToObject(this.image_name);

      if (this.file == '') {
        myFormData.append('image', image, this.image_name);
      } else {
        myFormData.append('image', this.file, this.file.name);
      }
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
      console.log(myFormData);
      // window.fd = myFormData;
      // return;
      this.ds.postRecords('competition/' + this.competitionform.value.competition_id, myFormData, true).subscribe(competitionres => {
        this.isLoading = false;
        console.log(competitionres)
        if (competitionres['success'].status == 'success') {
          this.wizard.goToStep(2);
          this.wizard.goToNextStep();
          this.competition_id = '';
          // alert(competitionres['data']['id']);
          this.competition_id = competitionres['data']['id'];
  this.competitionform.value.competition_id = '';
          this.competitionform.controls['competition_id'].setValue('');
          this.competitionform.reset();
          this.competitionimageform.controls['competition_id'].setValue(competitionres['data']['id']);
          this.canExitStep1 = (direction) => {
            console.log('dirction' + direction);
            switch (direction) {
              case MovingDirection.Forwards:
                return true;
            }
          };

        } else {
          this.isLoading = false;
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
      }, error => {
        this.isLoading = false;
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

  close_image(i) {
    // console.log(this.Imagearray);
    let image = this.competitionimageform.controls['image_array'] as FormArray;
    let controls = image.controls;
    controls.splice(i, 1);
    // this.Imagearray.removeAt(i);
  }

  removearray_image(url, index) {
    console.log(this.sliderimage_array.length);
    this.sliderimage_array.splice(index, 1);   
    this.ds.deleterecord('image/' + url.id).subscribe(res => {
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

  clear_notfoundimage(index) {
    // console.log(this.sliderimage_array.length);
    this.sliderimage_array.splice(index, 1);   
   
  }

  deleteImage(): void {
    this.update_image = '';
    this.showcompetitionimage = false;
    this.showselectcompetitionimage = true;
    this.ds.postRecords('competitionimage/' + this.competition_id, this.logininfo['success']['token']).subscribe(res => {
      if (res['success'].status == 'success') {
        Swal.fire({
          title: 'Deleted',
          text: res['success'].message,
          icon: 'success',
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.value) {

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
