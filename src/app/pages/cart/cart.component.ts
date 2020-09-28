import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { FormsModule, FormControl, FormArray, FormGroup, Validator, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2'
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import * as $ from 'jquery';
import { error } from 'protractor';
import { DataprocessService } from 'src/app/dataservice/dataprocess.service';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  isSubmitted: boolean = false;
  couponloading: boolean = false;
  secquesloading: boolean = false;
  checkoutloading: boolean = false;
  logininfo: any;
  cartdetails: any = [];
  cart_data = [];
  checkout_data = [];
  couponarraylist = [];
  freeticketusers = [];
  questionarraydata = [];
  competitiontotal: any;
  image_url: any;
  freeticket = 0;
  competition_id: any;
  mySubscription: any;
  user_id: any;
  freeticket_dis: any;
  total_ticket_price: any;
  discountotal: any;
  discountotalprice: any;
  showfreeticket: boolean = false;
  ticket_price: any;
  coupon_discount: boolean = false;
  coupon_dscount_value = 0;
  coupon_id = 0;
  securityform: FormGroup;
  applaystatus: boolean = false;
  removecouponbtn: boolean = false;
  question: string = '';
  optiona: any;
  optionb: any;
  optionc: any;
  optiond: any;
  optione: any;
  answer = ''
  crctanswer: any;
  question_id: number;
  constructor(private fb: FormBuilder, private router: Router, private ds: DataserviceService,
    private toastr: ToastrService,private dps:DataprocessService) {
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
    this.image_url = this.ds.getiamgeAPI();
    if (!this.logininfo) {
      this.router.navigateByUrl('/login')
    }
    this.ds.getmethod('myaccount', this.logininfo['success']['token']).subscribe(res => {
      if (res['status'] == 'success') {
        this.user_id = res['data'].id;

        // this.myaccountform.setValue(res['data']);
      }
    }, error => {
      if (error['error']) {
        this.toastr.error(error['error'].message, 'Error', {
          progressBar: true
        });
        return;
      }

    })
    this.getcouponlist();
    let data:any = this.dps.competition_details();
    if(data == undefined || data == ''){
this.cart_data = [];
return;
    }else{
      let cart_toatl = 0;
      data.forEach(e => {
        cart_toatl += +e.sale_price;
        // console.log(e);
        this.competition_id = e.competition_id;
        this.cart_data.push({
          booking_number: e.booking_number, image: e.image, competition: e.competition, competition_id: e.competition_id,
          id: e.id, sale_price: e.sale_price, status: e.status, ticket_price: e.ticket_price, user_id: e.user_id
        })
      });
      console.log(this.cart_data,'cart data length');
      this.total_ticket_price = cart_toatl.toFixed(2);
      this.ticket_price = this.cart_data[0].ticket_price;
      // console.log(this.cart_data);
      this.ds.getmethod('freetickets/' + this.competition_id, this.logininfo['success']['token']).subscribe(res => {
        console.log(res);
        if (res['success']['status'] == 'success') {
          // alert('test');
          let data = res['success'].data;
          if (data == '') {

          } else {
            // this.freeticket = Number(data.total_free_tickets) - Number(data.used_free_tickets);
            let free_ticarray = [];
            let used_free_tickets = 0;
            data.forEach(u => {
              console.log(this.user_id, +'- ' + u.user_id);

              if (Number(u.used_free_tickets) == null) {
                used_free_tickets = 0;
              } else {
                used_free_tickets += +Number(u.used_free_tickets)
              }
            });
            let tt = Number(data[0].total_free_tickets);
            if (Number(tt) <= Number(used_free_tickets)) {
              this.freeticket = 0;
            } else {
              this.freeticket = Number(data[0].total_free_tickets) - Number(used_free_tickets);
            }
            setTimeout(() => {
              this.cart_calculation();
            }, 3000)
          }
          // this.competitiontotal = this.competitiontotal - this.freeticket_dis;

        }
      });
      setTimeout(() => {
        this.cart_calculation();
      }, 3000)

    }


    // console.log(this.cart_data);

    // this.router.navigateByUrl('/home');


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
    this.securityform = this.fb.group({
      secans: ['', Validators.required]
    })

  }


  get formControls() { return this.securityform.controls; }

  getcouponlist() {
    this.ds.getmethod('coupon', this.logininfo['success']['token']).subscribe(res => {
      if (res['success']['status'] == 'success') {
        let data = res['success']['data'];
        data.forEach(c => {
          this.couponarraylist.push({
            id: c.id, coupon: c.coupon, code: c.code, valid_from: c.valid_from, valid_to: c.valid_to,
            coupon_type: c.coupon_type, coupon_value: c.coupon_value, min_cart_amount: c.min_cart_amount,
            max_redeem_amount: c.max_redeem_amount, is_active: c.is_active
          })
        })
        console.log(this.couponarraylist);
      } else {
        this.toastr.error('No Data', 'Error', {
          progressBar: true
        });
        return;
      }
    })
  }



  gotoaddress_select() {
    this.isSubmitted = true;
    if (this.securityform.invalid) {
      this.toastr.info('Please Answer The Question', 'Info', {
        progressBar: true
      });
      return;
    } else {
      this.cart_data.forEach(e => {
        // console.log(e);
        this.checkout_data.push({
          booking_number: e.booking_number, image: e.image, competition: e.competition, competition_id: e.competition_id,
          id: e.id, sale_price: e.sale_price, discount_amount: parseFloat(this.competitiontotal).toFixed(2), status: e.status, ticket_price: e.ticket_price, user_id: e.user_id
        })
      });
      let now = new Date();
      let date = now.getDate();
      let month = now.getMonth() + 1;
      let year = now.getFullYear();
      // console.log(this.cart_data);
      // console.log(now.getDate()+'-'+now.getMonth()+'-'+now.getFullYear());
      // return;
      let total_price = 0;
      this.cart_data.forEach(c => {
        let s = c.ticket_price;
        total_price += +s;
      })
      /*alert(Number(this.freeticket));*/
      let use_no_of_freeticket = 0;
      if (Number(this.freeticket) <= Number(this.cart_data.length)) {
        use_no_of_freeticket = this.freeticket;
      } else if (Number(this.freeticket) >= Number(this.cart_data.length)) {
        use_no_of_freeticket = Number(this.cart_data.length);
      }
      let writeanswer = 0;
      if (this.crctanswer == this.securityform.value.secans) {
        writeanswer = 1;
      } else {
        writeanswer = 0;
      }
      console.log(this.freeticket + '-' + this.cart_data.length);
      let bookdata = {
        user_id: this.cart_data[0].user_id,
        competition_id: this.cart_data[0].competition_id,
        no_of_tickets: this.cart_data.length,
        booking_date: date + '-' + month + '-' + year,
        sale_price: this.cart_data[0].sale_price,
        total_price: this.discountotalprice,
        is_paid: 1,
        data: this.checkout_data,
        coupon_id: this.coupon_id,
        free_tickets: use_no_of_freeticket,
        question_id: this.question_id,
        answer: this.securityform.value.secans,
        correct_answer: writeanswer
      }
      console.log(bookdata);
      //  return;
      this.checkoutloading = true;
      this.ds.postRecords('cart', bookdata).subscribe(res => {
        this.checkoutloading = false;
        // console.log('res',res);
        if (res['validation errors']) {
          if (res['validation errors']['email']) {
            this.toastr.error(res['validation errors']['email'], 'Error', {
              progressBar: true
            });
          } else if (res['validation errors']['password']) {
            this.toastr.error(res['validation errors']['password'], 'Error', {
              progressBar: true
            });
          }
        } else {
          if (res['success']['status'] == 'success') {
            $('.modal').removeClass('in');
            $('.modal').attr('aria-hidden', 'true');
            $('.modal').css('display', 'none');
            $('.modal-backdrop').remove();
            $('body').removeClass('modal-open');
            this.cart_data = [];
            this.dps.getdata(this.cart_data);
            this.router.navigateByUrl('thankyou');
            // Swal.fire({
            //   title: 'Success',
            //   text: res['success'].message,
            //   icon: 'success',
            //   confirmButtonText: 'OK',
            // }).then((result) => {
            //   if (result.value) {
            //     this.cart_data = [];
            //     this.ds.getdata(this.cart_data);
            //     this.router.navigateByUrl('/my-ticket');
            //   } else if (result.dismiss === Swal.DismissReason.cancel) {
            //     this.router.navigateByUrl('/my-ticket');
            //   }
            // })

          }
        }
      }, error => {
        this.checkoutloading = false;
        if (error['status'] == 0) {
          this.toastr.error('net::ERR_INTERNET_DISCONNECTED', 'Error', {
            progressBar: true
          });
          return;
        } else if (error['validation errors']) {
          //  console.log(error['validation errors'].email);
        }
      })
    }
    // this.router.navigateByUrl('/address-select');
  }

  remove_data(i) {
    console.log(this.cart_data.length +'-'+this.freeticket +' '+'removecartdata');
    if (this.cart_data.length < this.freeticket) {
      this.freeticket_dis = '';
    }
    console.log(this.cart_data);
    this.cart_data.splice(i, 1);
    console.log(this.cart_data);
    this.dps.getdata(this.cart_data);
    this.router.navigate(['/cart']);
    this.toastr.success('Ticket removed from cart', 'success', {
      progressBar: true
    });
    this.cart_calculation();
  }

  cart_calculation() {
    // alert(this.freeticket+'freeticket');
    if (this.freeticket > 0) {
      this.showfreeticket = true;
      if (this.cart_data.length > this.freeticket) {
        // alert('lessthe freeticket');
        let calculate_freeticket = this.cart_data[0].sale_price * this.freeticket
        this.freeticket_dis = (calculate_freeticket).toFixed(2);
        let discount_price = this.total_ticket_price - this.freeticket_dis;
        // alert(discount_price);
        this.discountotalprice = discount_price.toFixed(2);
        return false;
      } else {
        // alert('grethen freeticket');
        let calculate_freeticket = this.cart_data[0].sale_price * this.cart_data.length;
        this.freeticket_dis = calculate_freeticket.toFixed(2);
        // alert(this.total_ticket_price+' '+this.freeticket_dis);
        let discount_price = this.total_ticket_price - this.freeticket_dis;

        this.discountotalprice = discount_price.toFixed(2);
        return false;
      }
      //       if(this.cart_data.length < this.freeticket){
      // this.competitiontotal = this.ticket_price * this.cart_data.length;
      // let discount_price = this.competitiontotal - this.cart_data.length;
      //     this.discountotalprice = discount_price.toFixed(2);
      //       }else{
      //       console.log(parseInt(this.total_ticket_price));
      //    let discount_price = this.total_ticket_price - this.freeticket_dis;
      //     this.discountotalprice = discount_price.toFixed(2);
      //       }
    } else {
      this.showfreeticket = false;
      let basic = 0;
      this.cart_data.forEach(d => {
        let x = d.sale_price;
        basic += +x;
      })
      // console.log(basic);
      this.competitiontotal = basic.toFixed(2);
      this.discountotalprice = this.competitiontotal;
    }
  }

  checkcouponavailable() {
    let code = $('#code').val();
    if (code == '') {
      this.toastr.error('Enter Coupon Code', 'Info', {
        progressBar: true
      });
      return;
    } else {
      this.couponloading = true;
      this.ds.getmethod('coupon/' + this.competition_id + '/' + code, this.logininfo['success']['token']).subscribe(res => {
        this.couponloading = false;
        if (res['message']) {
          this.toastr.info(res['message'], 'Info', {
            progressBar: true
          });
          return;
        } else if (res['success'].status == 'success') {
          let data = res['success'].data;
          if (data == '') {
            this.toastr.error('Enter valid coupon code', 'Info', {
              progressBar: true
            });
            return;
          } else if (data != '') {
            console.log(Math.round(this.discountotalprice))
            if (Math.round(this.discountotalprice) == 0) {
              this.toastr.info('your total price is zero so coupon not applied.', 'Info', {
                progressBar: true
              });
              return
            }
            this.applaystatus = true;
            this.removecouponbtn = true;
            this.coupon_discount = true;
            this.coupon_id = data[0].id;
            this.coupon_dscount_value = data[0].coupon_value;
            if (data[0].coupon_type == '2') {
              let percentage = this.discountotalprice * data[0].coupon_value;
              let discount_value = percentage / 100;
              this.competitiontotal = this.competitiontotal;
              var discount_total = this.discountotalprice - discount_value;
              if (Math.round(discount_total) <= 0) {
                this.discountotalprice = Number(0).toFixed(2);;
              } else {
                this.discountotalprice = discount_total.toFixed(2);
              }
              this.toastr.success('Coupon have applied', 'Info', {
                progressBar: true
              });

            } else if (data[0].coupon_type == '1') {

              this.competitiontotal = this.competitiontotal;
              let discount_total = this.discountotalprice - data[0].coupon_value;

              if (Math.round(discount_total) <= 0) {
                // alert(Math.round(discount_total));
                this.discountotalprice = Number(0).toFixed(2);
              } else {
                this.discountotalprice = discount_total.toFixed(2);
              }
              this.toastr.success('Coupon have applied', 'Info', {
                progressBar: true
              });
            }
          }
        }
      }, error => {
        console.log(error);
        this.couponloading = false;
      })
      return;
      let selectcouponarray = this.couponarraylist.filter(c => c.code == code);

      if (selectcouponarray.length > 0) {
        this.applaystatus = true;
        this.removecouponbtn = true;
        this.coupon_discount = true;
        this.coupon_id = selectcouponarray[0].id;
        this.coupon_dscount_value = selectcouponarray[0].coupon_value;
        if (selectcouponarray[0].coupon_type == '2') {
          // alert(this.discountotalprice+' '+selectcouponarray[0].coupon_value);
          let percentage = this.discountotalprice * selectcouponarray[0].coupon_value;
          let discount_value = percentage / 100;
          // alert(percentage);
          this.competitiontotal = this.competitiontotal;
          let discount_total = this.discountotalprice - discount_value;
          this.discountotalprice = discount_total.toFixed(2);
          // if(percentage <= selectcouponarray[0].max_redeem_amount){
          //            Swal.fire({
          //             // title: 'Success',
          //             text: "This coupon gives only maximum amount £ "+selectcouponarray[0].max_redeem_amount,
          //             icon: 'success',
          //             confirmButtonText: 'OK',
          //           }).then((result) => {
          //             if (result.value) {
          //               this.competitiontotal  = parseInt(total) - percentage;
          //             } else if (result.dismiss === Swal.DismissReason.cancel) {
          //               // this.router.navigateByUrl('/my-ticket');
          //             }
          //           })

          // }else{
          //   Swal.fire({
          //     title: 'Success',
          //     text: "This coupon gives only maximum amount"+selectcouponarray[0].max_redeem_amount,
          //     icon: 'success',
          //     confirmButtonText: 'OK',
          //   }).then((result) => {
          //     if (result.value) {
          //       this.competitiontotal  = parseInt(total) -  parseInt(selectcouponarray[0].min_cart_amount);
          //     } else if (result.dismiss === Swal.DismissReason.cancel) {
          //       // this.router.navigateByUrl('/my-ticket');
          //     }
          //   })

          // }
          // this.competitiontotal = parseInt(total) - percentage;

        } else if (selectcouponarray[0].coupon_type == '1') {
          // let percentage =parseInt(total) / selectcouponarray[0].coupon_value;
          this.competitiontotal = this.competitiontotal;
          // alert(this.competitiontotal+' '+selectcouponarray[0].coupon_value);
          let discount_total = this.discountotalprice - selectcouponarray[0].coupon_value;;
          this.discountotalprice = discount_total.toFixed(2);
          // let coupon_value = parseInt(total) - selectcouponarray[0].coupon_value;
          //  this.competitiontotal =  coupon_value.toFixed(2);
          //     if(percentage <= selectcouponarray[0].max_redeem_amount){
          //       Swal.fire({
          //        // title: 'Success',
          //        text: "This coupon gives only maximum amount £ "+selectcouponarray[0].max_redeem_amount,
          //        icon: 'success',
          //        confirmButtonText: 'OK',
          //      }).then((result) => {
          //        if (result.value) {
          //          this.competitiontotal  = parseInt(total) - percentage;
          //        } else if (result.dismiss === Swal.DismissReason.cancel) {
          //          // this.router.navigateByUrl('/my-ticket');
          //        }
          //      })

          // }else{
          //   Swal.fire({
          //     title: 'Success',
          //     text: "This coupon gives only maximum amount"+selectcouponarray[0].max_redeem_amount,
          //     icon: 'success',
          //     confirmButtonText: 'OK',
          //   }).then((result) => {
          //     if (result.value) {
          //       this.competitiontotal  = parseInt(total) -  parseInt(selectcouponarray[0].min_cart_amount);
          //     } else if (result.dismiss === Swal.DismissReason.cancel) {
          //       // this.router.navigateByUrl('/my-ticket');
          //     }
          //   })
          // }
          // this.toastr.success('Coupon applied', 'Applied', {
          //   progressBar:true
          // });
          // return;
        }
      } else {
        this.toastr.error('Enter valid coupon code', 'Info', {
          progressBar: true
        });
        return;
      }


    }


  }

  getquestion() {
    this.secquesloading = true;
    // this.emptyquestiondata = false;
    this.ds.getmethod('pickquestion', this.logininfo['success']['token']).subscribe(res => {
      this.secquesloading = false;
      if (res['success']['status'] == 'success') {
        let data = res['success']['data'][0];
        if (data == '') {
          // this.emptyquestiondata = true;
        } else {
          let couponarray = [];
          // data.forEach(q => {     
          //   this.questionarraydata.push({id:q.id,question:q.question,answer:q.answer,competition_id:q.competition_id,
          //     option_a:q.option_a,option_b:q.option_b,option_c:q.option_c,option_d:q.option_d,option_e:q.option_e});
          // })

          // let item = this.questionarraydata[Math.floor(Math.random() * this.questionarraydata.length)];
          this.question_id = data.id;
          this.question = data.question;
          this.optiona = data.option_a;
          this.optionb = data.option_b;
          this.optionc = data.option_c;
          this.optiond = data.option_d;
          this.optione = data.option_e;
          this.crctanswer = data.answer;
          jQuery('#faqmodel').modal('show');
          if (this.questionarraydata.length <= 0) {
            // this.emptyquestiondata = true;
          }
          // this.dtTrigger.next();
        }

      }
    }, error => {
      this.secquesloading = false;
      // this.emptyquestiondata = true;
      console.log(error);
    })
  }

  removecoupon() {
    this.applaystatus = false;
    this.removecouponbtn = false;
    this.coupon_discount = false;
    this.coupon_dscount_value = 0;
    this.discountotalprice = Number(this.total_ticket_price).toFixed(2);
    this.cart_calculation();
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
      this.cart_data = [];
    }
  }

}
