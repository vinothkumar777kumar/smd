import { Component, OnInit } from '@angular/core';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-activecompetition',
  templateUrl: './activecompetition.component.html',
  styleUrls: ['./activecompetition.component.css']
})
export class ActivecompetitionComponent implements OnInit {
  isloading:boolean = false;
  isshowupcoming:boolean = false;
  isshowfeatured:boolean = false;
  competitiondata = [];
  featuredarraydata = [];
  upcomming = [];
  logininfo:any;
  image_url:any;
  morecompetiton:any;
  public featuredactivecompetitions:any;
public moreactivecompetitions:any;
  constructor(private ds: DataserviceService,private router:Router) {
this.featuredactivecompetitions = [
  {image:'assets/img/smd/win1.jpg',sale:'Sale!',real_rate:'£30.00',currunt_rate:'£24.99'},
  {image:'assets/img/smd/win2.png',sale:'Sale!',real_rate:'£30.00',currunt_rate:'£24.99'},
  {image:'assets/img/smd/win3.jpg',sale:'Sale!',real_rate:'£30.00',currunt_rate:'£24.99'}
];

this.moreactivecompetitions = [
  {image:'assets/img/smd/win3.jpg',sale:'£0.85'},
  {image:'assets/img/smd/win5.jpg',sale:'£3.10'},
  {image:'assets/img/smd/win6.jpg',sale:'£0.80'}
];
this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
this.image_url = this.ds.getiamgeAPI();
this.isloading =true;
this.ds.apigetmethod('competitions').subscribe(res => {
  
  if(res['success']['status'] == 'success'){
    let feature_data = [];
    let data = res['success']['data'];
    data.forEach(c => {
      this.competitiondata.push({id:c.id,image:this.image_url+c.image,ticket_price:c.ticket_price,sale_price:c.sale_price,competition:c.competition,description:c.description,
      draw_start_date_time:c.draw_start_date_time,draw_end_date_time:c.draw_end_date_time,draw_month:c.draw_month,
      draw_year:c.draw_year,is_active:c.is_active,is_cashdraw:c.is_cashdraw,is_draft:c.is_draft,is_drawn:c.is_drawn,
      is_featured:c.is_featured,sold:c.sold,discount_status:c.discount_status,discount_price:c.discount_price,discount_type:c.discount_type}) 
    })  
    
    
    this.competitiondata.forEach(c => {
      let cd = moment().format('YYYY-MM-DD');
      let sd = moment(c.draw_start_date_time,'DD-MM-YYYY').format('YYYY-MM-DD'); 
      console.log(cd,sd);
      console.log((moment(sd).isSameOrBefore(cd)));
      if(c.sold == 'false' && moment(sd).isSameOrBefore(cd) == true && c.is_featured == 1){
        let discountprice;
        // c.is_featured == 1 && moment().format('DD-MM-YYYY') >= c.draw_start_date_time
          if(c.discount_type == '2'){
           let per = c.ticket_price * c.discount_price;
           let div = per/ 100
           let fixed = c.ticket_price - div;
          discountprice = fixed.toFixed(2);
          
           
          // this.saleprice =  data[0].ticket_price - per_val;
          }else{
          let dis_price = c.ticket_price -c.discount_price;
          discountprice = dis_price.toFixed(2);    
        }
this.featuredarraydata.push({id:c.id,image:c.image,ticket_price:c.ticket_price,sale_price:c.sale_price,competition:c.competition,description:c.description,
draw_start_date_time:c.draw_start_date_time,draw_end_date_time:c.draw_end_date_time,draw_month:c.draw_month,
draw_year:c.draw_year,is_active:c.is_active,is_cashdraw:c.is_cashdraw,is_draft:c.is_draft,is_drawn:c.is_drawn,
is_featured:c.is_featured,sold:c.sold,discount_status:c.discount_status,discount_price:discountprice})
      }
    })
    this.isloading =false;
    if(this.featuredarraydata.length == 0){
this.isshowfeatured = false;
    }else{
      this.isshowfeatured = true;
    }

    console.log(this.featuredarraydata,'ngoninit');

    this.competitiondata.forEach(c => {
      let cd = moment().format('YYYY-MM-DD');
      let sd = moment(c.draw_start_date_time,'DD-MM-YYYY').format('YYYY-MM-DD'); 
      console.log(cd,sd);
      console.log((moment(sd).isSameOrAfter(cd)));
      if(moment(sd).isAfter(cd) == true){
        this.upcomming.push({id:c.id,image:c.image,ticket_price:c.ticket_price,sale_price:c.sale_price,competition:c.competition,description:c.description,
          draw_start_date_time:c.draw_start_date_time,draw_end_date_time:c.draw_end_date_time,draw_month:c.draw_month,
          draw_year:c.draw_year,is_active:c.is_active,is_cashdraw:c.is_cashdraw,is_draft:c.is_draft,is_drawn:c.is_drawn,
          is_featured:c.is_featured})
      }
    })

    if(this.upcomming.length == 0){
      this.isshowupcoming = false;
          }else{
            this.isshowupcoming = true;
          }
this.morecompetiton =   this.competitiondata.filter(res => res.is_featured == 0)
// this.competitiondata = feature_data;
  }
},error => {

});
   }

  ngOnInit(): void {
  
  }



  competitions_details(data){
    // this.ds.getdata(data);
    console.log(data);
    const navigationExtras = {
      queryParams: {  
          id: data.id, 
      }
  };
this.router.navigate(['/competition-details'], navigationExtras);
    // this.router.navigateByUrl('/competition-details');
    // console.log(data);
  }

}
