import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ApiconfigService } from './apiconfig.service';
import { HttpClient, HttpHeaders,HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, retry, tap, debounceTime } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { SocialAuthService } from "angularx-social-login";
import { DataprocessService } from './dataprocess.service';

@Injectable({
  providedIn: 'root'
})
export class DataserviceService {
  counter = 0;
  // private messageSource = new BehaviorSubject('default message'); 
  public _URL: string = "";
competition_details_data:any;
card_data:any;

logininfo:any;
live_drawdata:any;
mySubscription: any;
blogdata:any;
useremail:any;
private msgsource = new BehaviorSubject<string>('this is the default');
telecast = this.msgsource.asObservable();
  constructor(private dps: DataprocessService,private authService: SocialAuthService,private apiser: ApiconfigService,private http:HttpClient,private router: Router) {
  
    if(sessionStorage.getItem('login_details')){
      this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
      }
      // console.log(this.logininfo);
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

  editMsg(newmsg) {
    this.msgsource.next(newmsg);
  }

  getServiceAPI(): string {
    // console.log(sessionStorage.getItem('api_url'));
    return sessionStorage.getItem('api_url');
  }

 

  getiamgeAPI(): string {
    return sessionStorage.getItem('image_url');
  }

  getuseriamgeurl(): string {
    return sessionStorage.getItem('user_image_url');
  }

  getblogamgeurl(): string {
    return sessionStorage.getItem('blog_image_url');
  }

  gettestmoamgeurl(): string {
    return sessionStorage.getItem('testimo_image_url');
  }


  
  seesionuser_info(res){
    sessionStorage.setItem('login_details',JSON.stringify(res));
}


postmethod(Service: string, data: any) {
  this._URL = this.getServiceAPI();
  let headers = {
    headers : new HttpHeaders({ 'Content-Type': 'application/json' })
    }
  let URL = this._URL + Service;
  return this.http.post(URL, data, headers);
}
apigetmethod(Service: string) {
  // console.log(this.logininfo['access_token']);
  this._URL = this.getServiceAPI();
  console.log(this._URL);
  if(sessionStorage.getItem('login_details')){
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
  }
  // console.log(data);
let headers = {
   headers : new HttpHeaders({ 'Content-Type': 'application/json' })
}


  let URL = this._URL + Service;
  console.log('url'+URL)
  return this.http.get(URL,headers);
}


getmethod(Service: string,data: any) {
  // console.log(this.logininfo['access_token']);
  this._URL = this.getServiceAPI();
  if(sessionStorage.getItem('login_details')){
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
  }
  // console.log(data);
let headers = {
   headers : new HttpHeaders({ 'Content-Type': 'application/json' }).set('Authorization', 'Bearer '+data)
}
  let URL = this._URL + Service;
  return this.http.get(URL,headers);
}

getbodymethod(Service: string,data: any) {
  // console.log(this.logininfo['access_token']);
  this._URL = this.getServiceAPI();
  if(sessionStorage.getItem('login_details')){
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
  }
  let headers = {
    headers : new HttpHeaders({ 'Content-Type': 'application/json' }).set('Authorization', 'Bearer '+this.logininfo['success']['token'])
 }
  let URL = this._URL + Service;
  return this.http.get(URL,headers);
}

deletegetmethod(Service: string) {
  // console.log(this.logininfo['access_token']);
  this._URL = this.getServiceAPI();
  if(sessionStorage.getItem('login_details')){
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
  }
  let headers = {
    headers : new HttpHeaders({ 'Content-Type': 'application/json' }).set('Authorization', 'Bearer '+this.logininfo['success']['token'])
 }
  let URL = this._URL + Service;
  return this.http.get(URL,headers);
}




postRecords(Service: string, data: any,isFileUpload=false) {
  this._URL = this.getServiceAPI();
  let httpOptions;
  if(sessionStorage.getItem('login_details')){
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
  }
  // let headers = new Headers({ 'Content-Type': 'application/json' });
  let headers = {
    headers : new HttpHeaders({ 'Content-Type': 'application/json' }).set('Authorization',  'Bearer'+' '+this.logininfo['success']['token'])
    }
  let URL = this._URL + Service;
  if(isFileUpload){
    httpOptions = {
      headers: new HttpHeaders({
      }).set('Authorization',  'Bearer'+' '+this.logininfo['success'].token)
    }
    return this.http.post(URL, data,httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )

  }else{
  return this.http.post(URL, data, headers);
  }
}

resetpostRecords(Service: string, data: any) {
  // this._URL = this.getServiceAPI();
  let httpOptions;
  if(sessionStorage.getItem('login_details')){
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
  }
  // let headers = new Headers({ 'Content-Type': 'application/json' });
  // let headers = {
  //   headers : new HttpHeaders({ 'Content-Type': 'application/json' }).set('Authorization',  'Bearer'+' '+this.logininfo['success']['token'])
  //   }
  let headers = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
  let URL ='https://smdgiveaways.co.uk/v1/api/'+Service;
  
  return this.http.post(URL, data,headers);
  
}

servicepostRecords(Service: string) {
  this._URL = this.getServiceAPI();
  let httpOptions;
  if(sessionStorage.getItem('login_details')){
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
  }
  // let headers = new Headers({ 'Content-Type': 'application/json' });
  let headers = {
    headers : new HttpHeaders({ 'Content-Type': 'application/json' }).set('Authorization',  'Bearer'+' '+this.logininfo['success']['token'])
    }
  let URL = this._URL + Service;

  return this.http.post(URL, httpOptions);
  
}

getresetrecord(Service: string): any {
  // this._URL = 'https://smdgiveaways.co.uk/v1/api/';
  
  //console.log("docme url" + '-' + this._URL);

  let headers = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }
  let URL = 'https://smdgiveaways.co.uk/v1/api/'+Service;
  console.log(URL);
  return this.http.get(URL, headers);
}

deleterecord(Service:any): any {
  this._URL = this.getServiceAPI();
  if(sessionStorage.getItem('login_details')){
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
  }

  let  httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    }).set('Authorization',  'Bearer '+this.logininfo['success']['token'])
  }
  let URL = this._URL + Service;
  return this.http.delete(URL, httpOptions);
}


  getdata(data){
    // console.log(data,'dayaserve cart data');
    this.competition_details_data = data;
    this.card_data = data;
    // console.log(this.card_data,'save ed cart data');
    // this.messageSource.next(data);

  }

 

  competition_details(){
    // console.log(this.card_data,'return data')
    return this.card_data;
    return this.competition_details_data;
  }

  blogdatastore(data){
    this.blogdata = data;
  }

  getblogdata(){
    return this.blogdata;
  }

  live_draw_data(data){
    // console.log(data);
    this.live_drawdata = data;
  }

  storeuseremail(email){
    this.useremail = email;
  }
  getuseremail(){
    return this.useremail;
  }
  get_livedrawe_data(){
    return this.live_drawdata;
  }

  scrollToTop(scrollDuration) {
    var scrollStep = -window.scrollY / (scrollDuration / 15),
      scrollInterval = setInterval(() => {
      if ( window.scrollY != 0 ) {
          window.scrollBy( 0, scrollStep );
      }
      else clearInterval(scrollInterval); 
   },15);
  }



  logout(){
    this.competition_details_data = '';
    sessionStorage.removeItem('login_details');
    this.dps.getdata([]);
    this.dps.competition_details();
   
    localStorage.clear();
    this.router.navigateByUrl('/login', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/login']);
  }); 
  this.signOut();
  }

  signOut(): void {
    this.authService.signOut();
  }

  private handleError(errorResponse: HttpErrorResponse) {
    if (errorResponse.error instanceof ErrorEvent) {
        console.error('client side error :', errorResponse.error.message);
    } else {
      // console.error(errorResponse.error);
        return errorResponse.error;
    }
    return throwError('ther is problem with service');
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

  //   private extractData(res: Response) {
  //     console.log(res);
  //   const body = res.success.json();
  //   console.log(body,'testserv')
  //   return body.data || {};
  // }
}
