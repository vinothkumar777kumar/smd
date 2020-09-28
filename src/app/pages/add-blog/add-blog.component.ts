import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
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
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
// import Base64UploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/base64uploadadapter';

class UploadAdapter {
  loader;  // your adapter communicates to CKEditor through this
  url;
  t;
  constructor( loader, url, t ) {
    this.t = t; // Translate function
    this.loader = loader;
    this.url = url; // Endpoint URL
}

  upload() {
    return new Promise((resolve, reject) => {
      console.log('UploadAdapter upload called', this.loader, this.url);
      console.log('the file we got was', this.loader.file);
      resolve({ default: 'http://localhost:8080/image/1359' });
    });
  }

  abort() {
    console.log('UploadAdapter abort');
  }
}
@Component({
  selector: 'app-add-blog',
  templateUrl: './add-blog.component.html',
  styleUrls: ['./add-blog.component.css']
})
export class AddBlogComponent implements OnInit {
  public editorConfig = {
    extraPlugins: [  ]
  };
  isLoading:boolean =false;
  title = "Add Blog";
  action_btn = "Save";
  isSubmitted:boolean = false;
  addblogform:FormGroup;
  file :any = [];
  public date = new Date();
  logininfo:any;
  blogid:any;
  blog_image_url:any;
  blog_image:any;
  blog_image_name:any;
  shownoeditimage:boolean = true;
  showblogimage:boolean = false;
  public blogsDetails = <any>{};
  public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd-mm-yyyy',
    disableUntil: {day: this.date.getDate()-1,month: this.date.getMonth()+1,year: this.date.getFullYear(),}
  };

  public Editor = ClassicEditor;
  loader: any;
//   public onChange( { editor }: ChangeEvent ) {
//     const data = editor.getData();

//     console.log( data );
// }

public onReady(eventData) {
  console.log(eventData);
  eventData.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
    // Configure the URL to the upload script in your back-end here!
    return this.imageUploadAdapter(loader);
};
}

imageUploadAdapter(loader: any) {
  this.loader = loader;

  const uploadInterface = {
      upload: () => { return this.uploadImage(this); },
      abort: () => { return this.abortImageUpload(this); }
  };
  console.log(uploadInterface);

  return uploadInterface;
}

uploadImage(that: any) {
  return that.loader.file
      .then( file => new Promise( ( resolve, reject ) => {
        var myReader= new FileReader();
        myReader.onloadend = (e) => {
           resolve({ default: myReader.result });
        }

        myReader.readAsDataURL(file);
        
      } ) );

      
}

abortImageUpload(that: any) {
  console.log('Abort image upload.')
}


  
  constructor(private cdRef:ChangeDetectorRef,private Activate: ActivatedRoute,private fb:FormBuilder,private location: Location,private router: Router,private ds: DataserviceService,private toastr: ToastrService) { 
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
    this.blog_image_url = this.ds.getblogamgeurl();
    this.Activate.queryParams.subscribe(res => {
      this.blogid = res.id;
      if(this.blogid){
        this.title = "Edit Blog";
        this.action_btn ="Update";
      }else{
        this.title = 'Add Blog';
        this.action_btn ="Save";
      }
    this.ds.getmethod('blog/'+res.id, this.logininfo['success']['token']).subscribe(res => {
      if(res['success']['status'] == 'success'){
        let data = res['success']['data'];
        if(data == ''){

        }else{
          this.addblogform.controls['id'].setValue(data.id);
          this.blog_image_name = data.image;
          if(data.image != ''){
            this.blog_image = this.blog_image_url+data.image;
            this.showblogimage = true;
            this.shownoeditimage = false;
          }else{
            this.showblogimage = false;
            this.shownoeditimage = true;
          }
          this.addblogform.get('image').clearValidators();
          this.addblogform.get('image').updateValueAndValidity();
            this.addblogform.controls['title'].setValue(data.title);
            this.addblogform.controls['description'].setValue(data.description);
          let pd = data.published_at.split('-');
          let vf = pd[0] +'-'+pd[1]+'-'+pd[2];
          let rplace = /^0+/;
          let d = pd[0].replace(rplace,'');
          let m = pd[1].replace(rplace,'');
            
            if (Number(d) - 1 == 0) {
              let actualDate = new Date(Number(new Date(pd[2] + "-" + m + "-" + d)) - 1);
              this.myDatePickerOptions.disableUntil.day = actualDate.getDate();
              this.myDatePickerOptions.disableUntil.month = actualDate.getMonth() + 1;
              this.myDatePickerOptions.disableUntil.year = actualDate.getFullYear();
            } else {
              this.myDatePickerOptions.disableUntil.day = Number(d) - 1;
              this.myDatePickerOptions.disableUntil.month = Number(m);
              this.myDatePickerOptions.disableUntil.year = Number(pd[2]);
            }
            this.addblogform.controls['published_at'].setValue({isRange: false, singleDate: {date: { 
              year: pd[2], 
              month: m, 
              day: d
            }}});
        }
      
      }
    });
    });
  }

  ngOnInit(): void {
    this.blogsDetails.image='';
this.addblogform = this.fb.group({
  id:[''],
  image:[''],
  title:['',Validators.required],
  description:['',[Validators.required]],
  published_at:['',Validators.required]
})

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
} else {
  this.myDatePickerOptions.disableUntil.day = Number(this.date.getDate()) - 1;
  this.myDatePickerOptions.disableUntil.month = Number(this.date.getMonth() + 1);
  this.myDatePickerOptions.disableUntil.year = Number(this.date.getFullYear());
}
  }

  TheUploadAdapterPlugin(editor) {
    console.log('TheUploadAdapterPlugin called');
  
    editor.plugins.get( 'FileRepository' ).createUploadAdapter = loader => {
      return new UploadAdapter( loader, editor.config.get( 'uploadUrl' ), editor.t );
    }
  }

  public onChange( event: any ) {
    console.log( event.editor.getData() );
  }

  get formControls() { return this.addblogform.controls; }

 



  fileProgress(fileInput: any) {
    console.log(fileInput)
    let fileData = fileInput.target.files[0];
    this.file=fileData;
    // let arr = fileData.split('/'); 
    console.log(this.file);
  }

  onDateChanged(event,text_date) {
    if(text_date == 'publishdate'){
      this.addblogform.controls['published_at'].setValue(event.singleDate.formatted);
      let start_date = event['singleDate'].date;
      this.myDatePickerOptions = {
         dateRange: false,
         dateFormat: 'dd-mm-yyyy',
         disableUntil: {day:start_date.day - 1,month: start_date.month,year: start_date.year}
       };
       console.log(event.singleDate.formatted);
       var future = new Date(start_date.year+'-'+start_date.month+'-'+start_date.day); // get today date
future.setDate(future.getDate() + 6); // add 7 days
var finalDate = future.getFullYear() +'-'+ ((future.getMonth() + 1) < 10 ? '0' : '') + (future.getMonth() + 1) +'-'+future.getDate();

    }
  
  
  }

 async addblog(value){
  // console.log(this.addblogform.value.description);
  // return;
    this.isSubmitted = true;
    if(this.addblogform.invalid){
      console.log('invalid');
      return;
    }else{
      console.log(this.addblogform.value);
      this.isLoading =true;
      if(this.addblogform.value.id){
        let pudate = this.addblogform.value.published_at;
      
        let pd = pudate.singleDate.date;
    let d= (pd.day < 10 ? '0' : '')+(pd.day);
    let m = (pd.month < 10 ? '0' : '')+(pd.month);
    console.log(pudate);
        this.addblogform.controls['published_at'].setValue(d+'-'+m+'-'+pd.year);
        const myFormData = new FormData();
        let image = await this.urlToObject(this.blog_image_name);
        if (this.file == '') {
          myFormData.append('image', image, this.blog_image_name);
        } else {
          myFormData.append('image', this.file, this.file.name);
        }
        myFormData.append('title',  this.addblogform.value.title);
        myFormData.append('description',  this.addblogform.value.description);
        myFormData.append('published_at', this.addblogform.value.published_at);
        myFormData.append('status', '0');
        this.ds.postRecords('blog/'+this.addblogform.value.id,myFormData,true).subscribe(res => {
          this.isLoading = false;
          if(res['success']['status'] == 'success'){
            Swal.fire({
              title: 'Updated',
              text: res['success']['message'],
              icon: 'success',
              confirmButtonText: 'OK',
            }).then((result) => {
              if (result.value) {
                this.router.navigateByUrl('/blog-list');
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
    
        let pudate = this.addblogform.value.published_at;
      
        let pd = pudate.singleDate.date;
    let d= (pd.day < 10 ? '0' : '')+(pd.day);
    let m = (pd.month < 10 ? '0' : '')+(pd.month);
    console.log(pudate);
        this.addblogform.controls['published_at'].setValue(d+'-'+m+'-'+pd.year);
        const myFormData = new FormData();
        console.log(this.file == []);
        if(this.file == ''){
          myFormData.append('image', '');
        }else{
          myFormData.append('image', this.file,this.file.name);
        }
        myFormData.append('title',  this.addblogform.value.title);
        myFormData.append('description',  this.addblogform.value.description);
        myFormData.append('published_at', this.addblogform.value.published_at);
        myFormData.append('status', '0');
        this.ds.postRecords('blog',myFormData,true).subscribe(res => {
          this.isLoading = false;
          if(res['status'] == 'SUCCESS'){
            Swal.fire({
              title: 'Success',
              text: res['message'],
              icon: 'success',
              confirmButtonText: 'OK',
            }).then((result) => {
              if (result.value) {
                this.router.navigateByUrl('/blog-list');
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

  urlToObject = async (imageName) => {
    const response = await fetch((this.blog_image_url + imageName),{
      mode:'no-cors',
      headers: {'Content-Type': 'multipart/form-data'}});
    console.log(response);
    if(response.ok) {
      const blob = await response.blob();
      // console.log(blob)
      // const file = new File([blob], imageName, {type: blob.type});
      return blob;
    } else {
      return null;
    }
  }

  deleteblogImage(){
    this.showblogimage = false;
    this.shownoeditimage = true;
    this.blog_image = '';
    this.ds.postRecords('blogimage/' + this.blogid,this.logininfo['success']['token']).subscribe(res => {
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


  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

}
