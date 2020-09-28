import { Component, OnInit, ViewChild } from '@angular/core';
import {FormGroup,FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {IAngularMyDpOptions, AngularMyDatePickerDirective} from 'angular-mydatepicker';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-daily-sale-report',
  templateUrl: './daily-sale-report.component.html',
  styleUrls: ['./daily-sale-report.component.css']
})
export class DailySaleReportComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger:Subject<any> = new Subject();
  isloading:boolean =false;
  emptysalediscountdata: boolean = false;
  isSubmitted:boolean =false;
  isLoading:boolean =false;
  salereportform:FormGroup;
  bodyData:any;
  dataUrlbase64:any;
  start_date:AngularMyDatePickerDirective;
  end_date:any;
  competitionarray = [];
  salediscountarray = [];
  competition:any;
  public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd-mm-yyyy'
    
  
  };
  public myDatePickerOptions1: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd-mm-yyyy'
    
  
  };
  logininfo:any;
  constructor(private Activate: ActivatedRoute,private fb:FormBuilder,private location: Location,private router: Router,private ds: DataserviceService,private toastr: ToastrService) {
    this.logininfo = JSON.parse(sessionStorage.getItem('login_details'));
    this.getcompetitons_data();
    this.getsalediscount_competition_data();
   }

  ngOnInit(): void {
  
    this.salereportform = this.fb.group({
      competition:['',Validators.required],
      start_date:['',Validators.required],
      end_date:['',Validators.required],
    });

  }

  toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      var reader = new FileReader();
      reader.onloadend = function() {
        callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }

  get formControls() { return this.salereportform.controls; }

  getcompetitons_data(){
    this.ds.apigetmethod('competitions').subscribe(res => {
      if(res['success']['status'] == 'success'){
        let data = res['success']['data'];
        console.log(data);
        data.forEach(u => {
          if(u.is_featured == 1){
          this.competitionarray.push({id:u.id,image:u.image,competition:u.competition,description:u.description,
            draw_start_date_time:u.draw_start_date_time,draw_end_date_time:u.draw_end_date_time,draw_month:u.draw_month,
            draw_year:u.draw_year});
          }
        })
// this.competitionarray = competitionarray;
      }
    },error => {

    });
  }

  getsalediscount_competition_data(){
    this.isloading = true;
    this.emptysalediscountdata = false;
    this.ds.getmethod('salesdiscountreports',this.logininfo['success']['token']).subscribe(res => {
      this.isloading = false;
      if(res['status'] == 'SUCCESS'){
        let data = res['data'];
        console.log(data);
        if(data == ''){
this.emptysalediscountdata = true;
        }else{
        data.forEach(f => {
          this.salediscountarray.push({competition_id:f.competition_id,competition:f.competition,draw_end_date_time:f.draw_end_date_time,draw_start_date_time:f.draw_start_date_time,
            no_of_tickets:f.no_of_tickets,ticket_count:f.ticket_count,ticket_price:f.ticket_price});
          
        })
        if(this.salediscountarray.length <= 0){
this.emptysalediscountdata = false;
        }
        this.dtTrigger.next();
      }
// this.competitionarray =competitionarray;
      }
    },error => {

    });
  }
  viewsale_report(data){
    const navigationExtras = {
      queryParams: {
        competition_id: data.competition_id  
      }
  };
  this.router.navigate(['/view-salediscountreport'], navigationExtras);
  }

  get_report(){


  }

  
  generatePdf(action = 'open') {
    this.isSubmitted =true;
    if(this.salereportform.invalid){
      return;
    }else{
      this.ds.getmethod('report/'+this.salereportform.value.competition,this.logininfo['success']['token']).subscribe(res => {
        if(res['status'] == "SUCCESS"){
let data = res['data'];
this.competition = res['competition'];
this.start_date = res['startDate'];
this.end_date = res['endDate'];
res['endDate'];
var dataRow = [];
data.forEach((x,i)=> {  
  dataRow.push({Sno:i+1,date:x.date,totalTickets:x.totalTickets,dailySold:x.dailySold,dailyUnsold:x.dailyUnsold});
  i++;
});

this.bodyData = dataRow;
console.log(this.bodyData);
let start_date= this.salereportform.value.start_date;
let end_date= this.salereportform.value.end_date;
//  console.log(report_date.singleDate.formatted);
 // console.log(this.salereportform.value);

const documentDefinition = this.getDocumentDefinition();
switch (action) {
 case 'open': pdfMake.createPdf(documentDefinition).open();    
 break;
 case 'print': pdfMake.createPdf(documentDefinition).print(); 
 break;
 case 'download':     
 pdfMake.createPdf(documentDefinition).download(); 
 break;
 default: pdfMake.createPdf(documentDefinition).open(); 
 break;
}
}
        })
      }

 }

 table(data, columns) {
  return {
    width: 'auto',
      table: {
          headerRows: 1,
          body: this.buildTableBody(data, columns),
          widths: ['18.6%', '18.6%', '18.6%', '18.6%', '18.6%']
      },
      alignment: "center"
  };
}

 getDocumentDefinition() {
//  let data= this.toDataURL('assets/img/smd/logo.png', function(dataUrl) {
//    console.log(dataUrl);
// });

  return {
    content: [
      { width: '*', text: '' },
    {
    columns: [
      [
        {  
        image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH0CAYAAADL1t+KAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAACAASURBVHic7d15XFXV/v/xDwqCFBKhkak4YJqmqeGckkPOE5lDUem9mlnadLPhm3btplbX6tq3vJk23coUS8sxy3lAr2MaSioqoqiIoiCiiB5g/f7wy/kJnAN7b85hWLyej8d6PODsvdZeZzO8z57W8hARJQAAoFyrVNodAAAAxUegAwCgAQIdAAANEOgAAGiAQAcAQAMEOgAAGiDQAQDQAIEOAIAGCHQAADRAoAMAoAECHQAADRDoAABogEAHAEADBDoAABog0AEA0ACBDgCABgh0AAA0QKADAKABAh0AAA0Q6AAAaIBABwBAAwQ6AAAaINABANAAgQ4AgAYIdAAANECgAwCgAQIdAAANEOgAAGiAQAcAQAMEOgAAGiDQAQDQAIEOAIAGCHQAADRAoAMAoAECHQAADRDoAABogEAHAEADBDoAABog0AEA0ACBDgCABgh0AAA0QKADAKABAh0AAA0Q6AAAaIBABwBAAwQ6AAAaINABANAAgQ4AgAYIdAAANOBZ2h1wFaVUaXcBAFAGnDhxQurWrWt4fQ8PDzf2puRwhA4AgAYIdAAANECgAwCgAQIdAAANEOgAAGiAQAcAQAMEOgAAGiDQAQDQAIEOAIAGCHQAADRAoAMAoAFtxnI3S5exewEAecXFxZV2F0oFR+gAAGiAQAcAQAMEOgAAGiDQAQDQAIEOAIAGCHQAADRAoAMAoAECHQAADRDoAABogEAHAEADBDoAABog0AEA0ACBDgCABgh0AAA0QKADAKABAh0AAA0Q6AAAaIBABwBAAwQ6AAAaINABANAAgQ4AgAYIdAAANECgAwCgAQIdAAANEOgAAGiAQAcAQAMEOgAAGiDQAQDQAIEOAIAGCHQAADRAoAMAoAECHQAADRDoAABogEAHAEADBDoAABog0AEA0ACBDgCABgh0AAA0QKADAKABAh0AAA0Q6AAAaIBABwBAAwQ6AAAaINABANAAgQ4AgAYIdAAANECgAwCgAQIdAAANEOgAAGiAQAcAQAMEOgAAGiDQAQDQAIEOAIAGCHQAADRAoAMAoAECHQAADRDoAABogEAHAEADBDoAABog0AEA0ACBDgCABgh0AAA0QKADAKABAh0AAA0Q6AAAaIBABwBAAwQ6AAAaINABANAAgQ4AgAYIdAAANECgAwCgAQIdAAANEOgAAGiAQAcAQAMEOgAAGiDQAQDQAIEOAIAGCHQAADRAoAMAoAECHQAADRDoAABogEAHAEADBDoAABog0AEA0ACBDgCABgh0AAA0QKADAKABAh0AAA0Q6AAAaIBABwBAAwQ6AAAaINABANAAgQ4AgAYIdAAANECgAwCgAQIdAAANEOgAAGiAQAcAQAMEOgAAGiDQAQDQAIEOAIAGCHQAADRAoAMAoAECHQAADRDoAABogEAHAEADBDoAABog0AEA0ACBDgCABgh0AAA0QKADAKABAh0AAA0Q6AAAaIBABwBAAwQ6AAAaINABANAAgQ4AgAYIdAAANECgAwCgAQIdAAANEOgAAGiAQAcAQAMEOgAAGiDQAQDQAIEOAIAGCHQAADRAoAMAoAECHQAADRDoAABogEAHAEADBDoAABog0AEA0ACBDgCABgh0AAA0QKADAKABAh0AAA0Q6AAAaIBABwBAAwQ6AAAaINABANAAgQ4AgAYIdAAANECgAwCgAQIdAAANEOgAAGiAQAcAQAMEOgAAGiDQAQDQAIEOAIAGCHQAADRAoAMAoAECHQAADRDoAABogEAHAEADBDoAABog0AEA0ACBDgCABgh0AAA0QKADAKABAh0AAA0Q6AAAaIBABwBAAwQ6AAAaINABANAAgQ4AgAYIdAAANECgAwCgAQIdAAANEOgAAGiAQAcAQAMEOgAAGiDQAQDQAIEOAIAGCHQAADRAoAMAoAECHQAADRDoAABogEAHAEADBDoAABog0AEA0IBnaXcAN7Rq1UpatWoltWvXFn9/f/Hx8RGbzSYZGRmSlJQkJ06ckJ07d8qZM2dKu6sAgDKIQC8lXl5eMmLECBk4cKB07NhRqlevXmQdpZScOnVK9u3bJzt27JDffvtNdu3alWcdHx8f+eGHH2TKlCny+++/O2ynW7du8s4777jkfeTk5Ej//v0lNTW1WO20b99ePvroI5f06dy5czJo0CAREZk0aZL079/fJe3eLCcnR2w2m1y/fl1sNpukpaXJhQsXJDk5WeLj42Xfvn0SHR3t8u0CgDMEeil4+eWX5aWXXpI6deqIiMjZs2flm2++kV27dkl0dLScPXtWMjMzpVGjRtK0aVPp27evdO7cWW699VapU6eO1KlTR/r16ydTpkyRxMREiY6Olv3790tiYqKEh4dLly5dZM6cOU63n5WVJRkZGfbva9SoIc2bN7f8fvr37y9z5861XF9EpGfPntK+fXtLdbOzs2XTpk327zMzM+1fX79+Pc97FRFp166d3HLLLaa3s2HDBlFKSZUqVcTHx0cCAwOlZs2aUq1aNYfrX7lyRQ4dOiR79+6VLVu2yM8//yzp6emmtwsARikdilml0cdmzZqp7du32/uQnp6uJk+erHx8fIqsW69ePRUZGamysrIMvb+hQ4ca7teLL75oev/d7Msvvyz2vlm+fLnl7V+9etXUtuLj4y1tx8/Pz2F7jRo1Ui+++KJaunSpysjIcFo/LS1NrVixQg0bNqzU/14oFJ1LXFycqb/t0u6vC0upd8AlxayS7l/Pnj3VuXPn7Nu/cOGC6tKli+l2wsPD1YULF4p8fyNGjDDcZnEDfd++fcXePwkJCZa3X9qBfnOpV6+e+umnn4ps69ChQ+r5558v9b8bCkXHQqCX82JWSfatS5cu6uLFi/Zt5+TkqOHDh1tur02bNkWG0jPPPGO4vdxAX7lypcrJyTG9L202m6pVq5bl99O4cWOVk5Ojjh49mmc/GVWWAj23vPXWW4ba3LNnj+rWrVup//1QKDqVihroPLbmZvXr15d58+aJv7+//bVNmzbJDz/8YLnNXbt2SXh4eKF3vPv4+Jhu9/z583LkyBHT9Tw9PYt141mvXr3Ew8NDduzYITabzXI7Zcnbb78tX331VZHrtWrVSlauXClTpkwpgV4B0BmB7mZffvml3HXXXXle++WXX4rdbnR0tAwfPtzp3eVVq1a11O727dst1evcubOleiIibdu2FRGRHTt2WG6jLJowYYKcOnWqyPW8vb3l73//u3z77bcl0CsAuiLQ3eipp56Sbt26FXh93759Lmk/KipKXnjhBcnOzi6wzMoRuojI+vXrLdVr06aNpXoiN45SRUTWrFljuY2yKC0tTWbMmGF4/REjRsj333/vxh4B0BmB7kYvv/yyw9eTk5Ndto3vv/9eZs6cWeB1q4G+bNmyPI99GXX33XdLw4YNTdcLDAyURo0aycmTJ+XgwYOm65d1c+bMkQsXLhhe//HHH5eJEye6sUcAdEWgu8ngwYOlSZMmDpcFBwe7dFt/+9vfCpwqt3rKPTU11dKAKB4eHpauo/fu3Vs8PT21HYQlIyPD9CWWyZMnS7t27dzUIwC6ItDd5JFHHnG67MEHH3T59saNGyeXL1+2f2/1CF1EZOvWrZbqderUyXSdjh07iojI7t27LW2zPFi7dq2p9b29vWX69Olu6g0AXRHobtK6dWuny4YPHy5BQUEu3d7evXvl/ffft3/v7e1tua1Vq1ZZqlfYe3bm/vvvFxHJM9KbblauXCnXrl0zVefBBx+Uhx9+2E09AqAjAt0NfHx8pH79+k6X33XXXfLdd9+Jr6+vS7c7depU+w13xTlCX716tZw/f950vbp165oaQtbLy0uaNWsmFy9elI0bN5reXnlx4cIFOXz4sOl6zz77rBt6A0BXBLobNGnSRLy8vApdp2fPnhIVFVWsu8MdmTRpkuTk5BQr0EWkwKQvRvXr18/wut27d5dbb71V9u/fb2lb5Ul8fLzpOl27drV0oyGAiolAd4OAgABD691///0SFRUl33zzjTRt2tQl216xYoV8/PHHEhMTU6x2Nm/ebKle7jVxI3KfXXc2K5xO4uLiTNfx9PSU4cOHu6E3AHREoJcyb29vGTlypOzZs0dWrFghERERxW7z5ZdflkmTJhWrjWXLlsmNERHNMXPGIfea+3//+1/T2ylvjh07Zqle9+7dXdwTALoi0N3AyhSZ3t7e0q9fP5k3b54kJyfL4sWL5fnnn3f5I25GHThwwNJR5Z133ikdOnQwtO59990n165dk9WrV5veTnlz7tw5S/WKM60tgIqFQHeDY8eOWTq6zVW9enUJDw+XTz75RI4dOybR0dEya9asYo2XbsW2bdss1evVq1eR67Rq1UruvPNOOXTokKSlpVnaTnmSmJhoqV716tUJdQCGEOhucOHCBUlJSXFJW5UrV5b77rtPnn32WVm+fLkkJSXJ3LlzpU+fPi5pvzBW7zw3ch39oYceEpEbj9tVBAkJCZbrtm/f3oU9AaArAt1NYmNj3dJuUFCQPPHEE7Jy5Uo5cuSITJ061eXPtOdaunSp6eenRURCQ0OLXCf3WrtuE7I442wSHSNq167twp4A0BWB7iYlEVQNGzaUN998U2JjY+Xdd98t9qNq+V24cMHSkKy333679OjRo9B1WrZsKUopy4PYlDfp6emWL8Pkn60PABwh0N3kxx9/LNZ1dDP8/f3ljTfekG3bttlnLnMVq3eg555Sd6R27doSEhIi8fHxlp7PLq+uX79uqV5gYKCLewJARwS6m2zfvr3EH8dq2bKlrFmzRgYNGuSyNq0eQRd23bdXr15SqVIlbSdkcSYrK8tSPVefeQGgJwLdjd555x2Hc5W7U2BgoMyfP1/Cw8Nd0t5vv/1mavrPXK1atXIaRLlhb3U0uoqmOOPyA6g4CHQ3+vXXX+Xrr78u8e36+vrKN99847LHnawEr5+fn/Ts2dPhstzLAhs2bChWvyoKT0/P0u4CgHKAQHez8ePHy5o1a0p8u/7+/vLxxx+7pK2oqChL9RyNcubr6ytNmzaV8+fPF5jDHY5ZedIAQMVDoLuZzWaTgQMHSmRkZIlvu0uXLtK7d+9it2N1GNh27doVeK1nz55StWrVCnf9vDgyMzNLuwsAygECvQRkZmZKRESEjB8/vkRHRfPw8JDx48cXu52YmBhLY5Hfd9994ufnl+e1Bx54QEQqxoQs+VWuXNlSPQIdgBEEegmaNWuWdOzYUX766acSu1kuLCzMJfOuWzk9XrVq1QLTqeZOyLJly5Zi96m8sXotPDk52cU9AaAjAr2EHThwQIYMGSIPPfSQLFu2zO1HX9WqVTM1R7kzVm9g69KlS57vmzdvLlevXpV169YVu0/ljdUj9NOnT7u4JwB0RKCXko0bN8qgQYPk7rvvljfffFO2b98uNpvNLdtq0aJFsdtYtmyZpZuz2rZta//6gQcekMDAQImJiZGMjIxi96k8qV27tnh4eFiqe/z4cdd2BoCWCPRSdurUKXnnnXekQ4cO0rBhQ3nttdfkt99+c+m19pCQkGK3kZycLPv27TNdr1mzZlKjRg0R+f9H63/88Uex+1Pe5O4DKyri/QYAzCPQy5CEhAT54IMPpE+fPnLnnXdKRESEzJ8/X86cOVOsdqtVq+aS/lkZ+c7Ly0sGDBggIv9/QpaSHkGvLLA6gU5iYqLbJvoBoBcC3Q0aNmzodFAVozIzMyUyMlIef/xxqVu3rowcOVLWrFlj6WY6V9wUJyKyevVqS/XCwsJE5Map/+zs7FJ5Lr+0WZ0xLSYmxsU9AaArAt0NhgwZIr/99psMGTLEJe3ZbDb57rvvpGfPntK5c2dZvny5qefCXXVH/cqVKy3N896mTRtp2LCh1K1bV44ePVohb/KyOmPa5s2bXdwTALoi0N3gypUr4uHhIZMnT3Z529u2bZOBAwfKkCFD5OTJk4bquPIGNCvDwDZu3FiGDBkiHh4eFfL6uYhIgwYNTNex2Wwyb948N/QGgI4IdDfIDdDmzZvLyy+/7JZt/Pzzz/LQQw/JgQMHilw3KSnJZdu1Mgxs5cqVZcyYMSJScSdkqVu3ruk6O3bs4A53AIYR6G5w+fJl+9cTJ06Uhg0bumU7hw8flpEjR8qVK1cKXc+Vc46vWLHC0jCwuUeoa9eudVlfypN77rnHdJ05c+a4oScAdEWgu0F6err968DAQJk1a5bbtrV792754YcfCl3H6uQqjkRHR1v+gJCYmFghx3Bv2rSp3Hnnnabq7N+/X77//ns39QiAjgh0N7j5CF1EpEePHjJhwgS3bW/hwoVOl505c8blw6zu2LHDUj0rz7HrYNCgQabWV0rJtGnT3NQbALoi0N3g0qVLBV6bOnVqsR9lc2br1q1OT4O74xExq8PA7t6928U9KR8cTSNbmAULFsiPP/7opt4A0BWB7gYXL14s8FrVqlXl66+/dsmobfmlp6c7vI6enZ3tltP9S5YskevXr5uu58pT/+VFSEiIdO7c2fD6Bw4ckBdffNGNPQKgKwLdDc6dO+fw9Vq1asnChQuLNQyoIz4+Pg4Hj/nll18snx4vTHJysuzfv99UnfT0dMtH9uXZ3/72N6lSpYqhdU+ePCmDBw9mdjUAlhDobpCRkSFZWVkOl7Vq1UqWL18uAQEBLtte+/btpVKlvD/KtLQ0+Z//+R+XbSM/s8O3xsTEuG3ymbKqcePGMnLkSEPrHjp0SAYOHMgwrwAsI9DdpLBpUdu1ayfLli2TwMBAl2xr8ODBeb5XSslrr70mBw8edEn7jpgdBrYiTjDyxRdfyK233lrker/88ot06tSpwg66A8A1CHQ3KWqe806dOsm6deukUaNGxdpOw4YN5Yknnsjz2vTp0+Xzzz8vVrtFWbVqlaSmphpev6JNyBIZGVnktfPExEQZM2aM9O/fXy5cuFBCPQOgKwLdTYoKdJEbk5VERUVJRESEpW3UrFlT5s2bZz99n5OTI++++6688cYbltozw2azGb5r3WazWZ7YpbwJCQmRdevWyaOPPup0nXPnzsl7770nzZo1ky+//LIEewdAZwS6mxgJdBGRO+64Q77//ntZvny5fXpRIwYMGCAbNmyQtm3biojI+fPnZfTo0TJp0iRL/bXC6MQhsbGx2h+BNmnSRD755BP5/fffpVu3bgWW5+TkyI4dO+Tll1+Whg0bysSJE02d4QCAoniWdgd0lRvoSUlJsmfPHqlTp46EhIQ4vBvdw8ND+vfvL71795bNmzfLsmXLZMWKFRIXF5dnvfr160u/fv1k6NCh0rlzZ/Hw8BCbzSaLFi2SSZMmGR7BrXHjxhIeHm7/vkWLFiJyY3jW119/3f76zp07C70zfcWKFTJ16tQit1fYteExY8bI7bffbv/e29u7yPbyq1y5cp5+p6en2x/X69Onj9x333151jdyXduR5557TnJycuz99Pf3l7p160qTJk3knnvuKXBj4tmzZ2Xfvn2yceNGWbRokRw+fNjSdgHAKKVDMcvd/dm5c6dKSUlRTZs2tb/m5eWlOnfurF555RU1d+5ctWvXLpWamuq0j8nJyerIkSPqyJEj6uzZsyonJ8e+7OjRo+rTTz/N077RMmzYMEP76F//+leRbcXHxxfZznPPPee0fmxsrKG+mHH69Gl7+//5z39c3r7NZlNXr15Vly5dUomJierAgQNq69atatGiRerDDz9UzzzzjGrevHmp/01QKBW1xMXFmfqbLu3+uqp4/N8X5Z4yOWGIh4eHm3pyw2effSYJCQny3nvvFblu8+bNpXnz5hISEiK1atWS6tWrS7Vq1cTHx0cqVaok169fl0uXLkliYqIcOnRINm/ezB3RAOBEXFycqSmL3Z0HJYVABwBopaIGOjfFAQCgAQIdAAANEOgAAGiAQAcAQAMEOgAAGiDQAQDQACPFwZBu3brJyJEjpWXLllK9enXx8vKSy5cvy4kTJ2Tbtm0ye/ZsSUhIKO1uAkCFxXPoZVhoaKjcfffdUq9ePalWrZpUrVpVqlSpItevX5erV6/K+fPnJTExUfbt2ycHDhxwSx+8vLzkiy++kBEjRhS6z9LS0mTSpEny6aefuqUfAGBURX0OXaQMDFfnimJWaffXUenWrZuaOXOm2rZtm0pLS3PY7+zsbHX9+vUCr6elpaldu3apL7/8Uo0ZM0bVrl27QPudOnVSixYtMtWnL774wvA+tdlsasSIEaW+HykUSsUuDP1azqlyeoQeFBQkL7zwgkREREi9evUcrrN3715ZuHChrF27Vnbt2iUiIk2bNpXQ0FAZMmSIdOvWrcCEI9nZ2XL06FHZt2+f7N+/X65evSrPPvuseHt7S+3atQ317YEHHpBNmzZJ5cqVDb+f48ePS6NGjcRmsxmuAwCuxBF6OS9mlXZ/fX191fTp09XFixed9jEtLU2NHz++yLYaN26sVq1aZeh9JycnG+7j559/bnq/KqVU3759S33/UiiUilsq6hG6lIEOuKSYVZp9HTBgQJGzlKWkpKiuXbuaanfixIkqKyur0HYvXbpkuL0dO3aY3q9KKfXmm2+W+u8DhUKpuKWiBjqPrZWw9957T3766Senp9dFbpwuf/bZZwudi9yRd999VyZMmCBZWVlO16lSpYrh9vz9/U1tv7j1AADW8dhaCZo7d6488cQTRa63YMEC+eGHHyxt4+OPP5aAgAB56623HC6vUqWKeHl5GbrGnZmZaakP6enpluoBAKzjCL2ELFq0yFCYX7lyRd58881ibesf//iHLFq0yOEyDw8Puf322w21c+LECUvbj4mJsVQPAGAdgV4CZs6cKY888oihdZcuXSrHjx8v9jZHjRolsbGxDpcZPSW+evVq09s9f/68/Pbbb6brAQCKh0B3s1GjRsn48eMNrz937lyXbDc9PV3GjRsn165dK7CsWrVqhtr46quv5OjRo6a2O2vWLMnIyDBVBwDgGqV+Z54rilkl0af69eurc+fOGe7TyZMnXd6HDz74oMB2unTpYrh+9+7dVUpKiqH+mx20hkKhUNxRKupd7lIGOuCSYlZJ9OnHH3801Sd3BKKPj486cuRInu3079/fVBtt2rRRK1euVFevXi3Q55ycHHXo0CH1yiuvlPrvAIVCoYhU3EDnLnc36dChgzz88MOm6uSOAudKmZmZMmnSJFmwYIF9NCRfX1/T/erbt6/4+flJly5dJCgoSDw9PSU1NVV+//1306flAQCuR6C7yeuvvy6enuZ2744dO9zSlx9//FH+8pe/SJ8+fUREpGrVqpbaSU9Pl+XLl7uyawAAF+GmODeoXbu29OzZ01Qdm80m27dvd1OPRN566y25fv26iIjccsstbtsOAKB0EOhu8PTTT5s+Ck5MTLQ8kIsRu3btkp9//llErB+hAwDKLk65u8FDDz1kus7Zs2fd0JO8/vGPf0idOnXk/Pnzbt9WeVejRg3p1KmTNGjQQIKCgsTX11e8vLzk2rVrkp6eLmfOnJHDhw/Lli1b3PaYXqNGjaRZs2YSEhIi1apVk6pVq0rVqlXF09NTrl+/LlevXpXU1FQ5ffq0HDx40C33YOiKfXtDhw4dpF27dhIYGCgBAQGSk5MjFy9elMOHD8vWrVslPj7ead3//d//lV9//VVWrVpVgj1GYQh0F6tRo4bcf//9putduHDBDb3JKzY2Vjp16uR0+SeffCK9evUq1jZOnTol3bt3dzqoTXFMmDBBVqxY4XDZ6tWrpW7duoXWP3z4sAwYMMDp8h49esijjz4qDzzwgDRs2NA+baxSSi5cuCC33HJLgbMb165dk+joaFm3bp18/vnnxRoUKCQkRJ588knp1KmThIaGym233SYiImfOnJFt27ZJRkaGtG/fXho2bOiwfnp6usTExMj69evlq6++cvjPeNq0aTJ06FDLfXSmVatWkpGRIb6+vrJ3716XtDlt2rQC4zL89ttvUr9+/ULrxcfHS+/evfO8VhL79quvvir078usjIwMadWqldPlc+fOlbZt2xbZzocffihffPGF/fvQ0FB55ZVXpGvXrhIUFOS0Xk5Ojhw6dEjWrVsnX3zxhezfv9++bNiwYfLCCy/keQ2lj0B3sZ49e4q3t7fpeikpKW7ojTkxMTF5Jm+59957Tf+Dyq2fO7FMpUqVZNSoUabmVBcRSUtLkwULFuR5rbCzGNu3b5djx47Zv7/ttttk+PDh8ueff8qWLVtE5MaHDUdGjRolL7zwgrRo0aLAsoSEBHnqqadkzZo14ufnJ9OnT5dnn33Wvtzb21vatm0rbdu2lZdeekkiIyNl8uTJcvr0acPvtVGjRvL222/LoEGDCnxg+Pbbb2XcuHH2swBeXl7y66+/Svfu3Qu04+fnJx06dJAOHTrIhAkTZP78+fLaa6/l+bB46NAh+8+mZs2aMnDgQMP9zJWamio//vhjntdy5waw2Wz29hs0aCA9evQw1fbu3bvl999/FxHHP6/t27cX+NA0evRoOX/+vCxdulRERJKSkuzLSnLfRkdH2/fDQw89JCEhIabeu4jIzz//LMnJySIiDgeFutnevXvlypUr9u8rVaoko0ePlsTERPnll1/sr+cO4ezv7y+zZs2SYcOGiaenp1y+fFnmzp0ra9askb1799rXq1evnrRq1UoefPBBGThwoDz//PMybtw42blzp2zcuFE8PDxk7NixWs0hrpNSf3bOFcUsd/Xjww8/NN0XpZSaM2dOqe/D/GXKlCmm30d8fHyBdqKioky3k5OTo9q3b2+571OnTlVKKfXCCy84XSc0NFRt2bLFaR9sNpsKCwsrUG/37t2F9v3kyZOG54QfOnSoOnv2rMN2Ll68qHx8fArUadmypbLZbIb2Y2xsrGrUqJHDbdeoUUNlZGQYaif/fqlVq1aR7y0sLMx025s2bTL1c+7Ro4dSSql58+aVqX07ceJE0+9dKaVmzJhh+Xd+1KhRg3s12wAAIABJREFUTtto3ry5iomJsW9n//79qnHjxkW26e/vr/75z386HINCKaVGjx7t9v9DVkpFfQ5dykAHXFLMclc/Vq5cabovSin1r3/9q9T3Yf7iqkAfO3aspX0ya9Ysy33fuXOnunr1qqpRo4bD5WPGjFFpaWmFbn/9+vUO606bNq3Ivl++fFkNHTq00D5269at0EBNTk52Wjc6Otrwfvzjjz8chpeIqPXr1xtu52bjxo0z9HMwOspgrvT0dKd9dVSmT5+ulFJq7NixZWrfBgUFqStXrph670opFRMTY/l3fsWKFSonJ0e1atWqQF9iY2Pt28jIyFBNmzY11XZYWJg6c+ZMgf4S6GWulHoHXFLMclc/9u3bZ7ovSin1z3/+s9T3Yf7iqkD38vJy+M+gKAkJCZb6HRISomw2m9qwYYPD5RMnTlTZ2dlFbv/vf/+7w/qDBg0y1P+UlBQVGhrqtJ/5R/DLLzs7WwUHBzusu3DhQkN9yPX22287bOfVV1811U6uH374wdDPYuPGjabbHjJkiOGfdVRUlMMzBmVh3y5fvtz0e3cUyEZKYGCgSk9PV3v37i2wbPXq1Xm2sXHjRkt/V61bt1ZJSUl52iLQy1bhsTUXq1GjhqV6WVlZLu5J2WGz2eyPzJlRp04dCQ8PN13vscceE09PT/n1118LLBs3bpxMmzZNKlUq+lf/jz/+cPj6wYMHDfUjICBAPvnkE4fLIiIinN6AlatSpUoSGRkpy5cvl8aNG+dZ5ux+AGdGjx7t8PXIyEj7+ARmtGvXztB6u3fvNt12t27dDK3n6+srrVq1kgMHDuS5Z6Es7VuzPDw85LHHHjNd74knnpBbb701z7VzEZEhQ4YUuI/Bys9b5MbP8plnnrHfJ4Cyh0B3scDAQEv1cnJyXNyTsmX27NmWPrRY+efWu3dvsdlsBW6qa9eunbz//vuGb+Zxdrf24cOHJTs721AbHTt2lIiICId9NFq/f//+MmjQoDyv5944ZVStWrVk8ODBBV4/deqUpUey6tatK6GhoUWul3tDohnt27c3tF6/fv3klltuKTDCYlnZt/Pnz5fExERTbYmIpSdNwsPDJSsrq8BTARMmTCiwbmhoqNSqVcv0NkRElixZInPmzLFUF+5HoLtQQECAeHl5lXY3yqT9+/db+ufes2dP8fPzM7x+7dq1pU2bNrJr1y5JSEjIs2zGjBmGR8m7du1aoUdqZp49HzNmTIHX7rrrLsP1RUTuueeePN+npqaaqi/i/MjX6vz1/fr1K3Kd1atXy9WrV02126xZM6lZs2aR6+W+n40bN+Z5vSztW2ePWRamefPm0rx5c8PrBwcHS4cOHWT37t15HhcNDg6WNm3aFFj/9ttvl4ULFxb6yFphJk+ebOmDCtyPQHchf3//0u5Cmfbtt9+arnPbbbfJ448/bnj9xx9/XKpUqVIgpIYPHy4dO3Y03M7ly5cLXW4mpDp27Ci1a9fO89qtt95quL6I2J+bzlVU/xy59957Hb4eGRlp6eyJkUcaMzIy5MCBA6ba9fLyKnS8gFzt2rWTzMzMAqeZy9K+/c9//iM3LtEa5+Hh4fCsjjNPPvmkeHt7F/jwEB4e7vRx0Q4dOkh0dLS88847po/WU1NTZdasWabqoGQQ6C5kdhazimbevHmmr0+KiDzyyCOG1+3du7dkZ2cXuH75zDPPmNpmUQFn5hJJlSpV7BPj5Lp48aKp/uS/blnUM8qOBAcHO3w9Li7O0mAwbdq0MXRGyspZqwcffLDQ5UFBQdKsWTOJjo6WtLS0PMvK0r7dvn2703sxCmPmtPvAgQPl2rVrBU63N23atNB6QUFBMnHiRImLi5OoqCj55z//6fAZfEf+/e9/l8hgWDCHQHchnW9scwWbzSY//fST6XqdO3d2+g/zZkFBQdK+fXvZu3dvnildg4ODTR2d5/a1MGZ/1vlHD9y3b5+p+vmvE1sJndtvv93pstWrV5tu77bbbivyenWTJk2kWbNmptsu6qa7AQMGiJeXl8MJjcravl28eLHp9lq0aCFNmjQpcr0mTZpIaGiobNu2rcAlpsL6dDNvb2/p1KmTvP7667J27Vo5f/68/PLLL/LKK68UOLOUKy0tTQYPHizr1q0ztA2UDALdhfIfKaCgzz77zPRdst7e3jJy5Mgi13vsscfEx8enQDgNGjQozwh4RhR1mtTsadR69erl+f6rr74yfNr+0KFDMnv27DyvWbmJsrBT0QsWLDD9nkSkyJHghg4dauiJgvwaNGhQ6AeB3CN4R4FS1vbt119/bfo+gkqVKhk67T5y5EipXLmyfZS8m1WrVs3UNnMFBgZK37595YMPPpC4uDjZtGmTwzNcmzdvLtZQx3A9hn51oZSUFFFKWRoS0cw/vfHjxzu8q9aq7Oxs09O9WhUbGysbN240PSRoeHi4TJ06tdB1+vbtK0qpAne3t27d2nQ/Xa169ep5vo+NjZU333xTpk+fLp6ezv8Mjx49KsOGDXPJBDCenp7i5eXl8ANVTEyM7Nu3z+Hwt4Xp0KFDoctzf85xcXGmhkL18PCQ/v37S0xMjMPlbdu2lbS0NIc39JW1fXv69GnZuHFjgcsuRenVq5f8/e9/L3Sdfv36SUZGRoHT7SLW7gXIr0qVKhIWFiZhYWHy6quvymeffSYffvhhsduF+5T6w/CuKGa5qx8XL1403RelzA0s895776mUlJQ8JScnx/Q2L126pFJSUpyOmuWqgWXyl8cff9x0uzk5OYUO0hIQEKAuX76soqOjCyzbunWr6e0VNahNQkKCqfYOHTrksJ2BAweq9evXq/T09Dzv9dixY2rGjBkqICDAYb0BAwaYfk9KKeXn5+f0Pb3//vum27t27ZrT0fhq1Kihrl69qjIzM9XTTz9tuu0VK1Y4bLdRo0YqJyfH6Uh+ZXHfjhgxwnR7WVlZToeWFRHVrl07lZOTo1auXOlw+ezZsy29j6Ls2bNHde/e3W3/Q11RKurAMlIGOuCSYpa7+nH06FHTfVGq+EO/mh1iUymlhg0bVmib7gp0EVHHjx833fbMmTOdtjdu3DillFIffvhhgWVm/7iVUiozM1P9/vvvTktmZqap9g4fPlzo/vDy8lKNGjVSoaGhqmbNmkXuP3eETmhoqKUPhk899ZTD9saPH6+UUioqKkr5+fmZHgr17NmzDtudMGGCUkqpadOmGfpdKwv71svLq8Aoa0a89dZbTtucOXOmUkqpp59+2uHyl156ydL7MCIjI0P95S9/cdv/0eKWihronHJ3sbNnz1qaZcno89G6WLhwobzyyium6vTr10+ef/55p8tERH744YcCy6xcS7x+/Xqhp2LNDsZy8uTJQpfbbDY5fPiwqTZd7ffff5dDhw4ZuhnrZl26dJEvv/yywOu5d2qvXbtW0tPTZffu3RIWFma43TvuuEO6du1qn70tV+7jckbn4S4L+9Zms8mKFSucjirnTO/eveXtt992uKxv376SlpbmdES6yMhIee+998THx8d0f4tStWpV+fzzzyUrK0u+//57l7cP60r9U4Urilnu6se3335rui9KKfX9998Xa7vl7Qg9JCTE9FGuUkr179+/QFt+fn4qLS3N6WntoiZhcWT//v2l/jtdWHHHUaSIqE8++cR0m0eOHCnQjpeXl/1SUO5EILkz4Jnh6FLU6dOnVVJSUrnbt506dTJ9BsRms6n69esXaCt3lrmffvqp0G0uXbrU0nsx6uTJkyowMLDU/x7yF47Q4RLObuIpSkBAgIt7UrbFxcXJ+vXrTd8oFBERUWAAjWHDhkm1atXku+++c1hHWbh7u7TUrFlT2rdvLw0bNpRatWrJ7bffLtWqVRNfX1/x8vKSypUri4eHh+nBU4z68ccfnZ4FcSYkJESaNWuW53f/4YcfloCAAImJibEPLLN06VJ58803TbX9wAMP5Pm+Xbt2ctdddxUYTMaI0t63W7Zskf3798t9991nuI6np6dERETIO++8k+f13Dvgi3oMdMKECdK5c2e3/X+pXbu2vPHGG6bPtsE9CHQX27x5s6V6VseAL8+++eYb04Hes2dP8fHxkczMTPtruaOKOfvnZuW5YitPKlj16KOPyqBBg6RNmzbSoEGDQrd94sQJ2bJli3h6ekrLli1d3pctW7bI0aNHi5zc5GYeHh4yYMCAPIGeewnk5mFZd+/eLcePHy/wCF9hWrZsKb6+vvbLH7m/L1u3bjVUvyztW5Ebz6SbCXSRG+85f6D37NlTkpOTZeHChYXWPXr0qDz//PMye/Zst31QKaknZGBMqZ8mcEUxy519sXLDl9FT1c5KeTvlnlus3ER4801YPj4+KiUlRR07dszpNg4fPmx6G7GxsW7/nR08eHCR03zebO7cufa5t911WlhE1Jw5c0y3m/9O6xMnTiilVIG7oefNm2e67Zvnlc+dCrRFixblct8GBwebvtR07dq1PFO9Dh06VCll7jJd9+7dTT+ZYVROTo5q3Lix2/9ezJSKesqdgWXcwMokJDVr1qyQE7sUdYThyJAhQ/J8HRAQIGvXrnW6/tmzZ01vw9vb23QdM95//31ZuHCh4SPhAwcOyJNPPpnnzIS7WBnN7+ZJQMLCwiQ4OFhOnTpVYOAXKyOL3TwcaevWreX48eMSHR3tdP2yvG8TEhJk06ZNpupUqVIlzyAzQ4cOFZEbl0eMWrdunbRo0UL+/e9/u+T59Jt5eHg4HcseJYtAdwNHgzwUxdvbu0wMgFLSPvvsM9OjaIWFhdln4xo4cKCIFD685rFjx0z3y52BPnbsWHnllVdMDSY0f/58t/Unv9WrVxd5V35+1atXtw8ikzvokaPLT4sXLzb9886dTrV3794SEBBQ6BMGZX3fijh+EqMouZcafHx85KGHHpJTp07JsmXLTLWRmpoqzz//vNx7770yc+ZMSUpKMt0PZ4zMjgf3I9DdYNWqVfLnn3+arlfU+NU6SkhIkDVr1piqU7VqVfnrX/8qXl5e0rVrVzl9+rT8+uuvTte3MjmGO29SfP31101fo7cy1npxWDmSzn1MrWvXriIiDm9cS01NNT0RzL333iu1atWyf2CIiopyum552Ldz586Vc+fOmarTrl07qVWrljz++OMSEBBgaMrbdevWyaRJkwq8npCQIC+88IIEBwfLyJEjZcmSJXL+/HlT/cmvot3UW1YR6G7y2Wefma5TEY/QRW6MdW1WeHi4hIeHS/Xq1YsMn2XLlkl2drap9r29vYucrcqozp07209JP/zww1K/fn1T9bOysix9KDGiRo0a8uSTTxZ43cqEIg888IB9Mpa0tDT5+eefHa5n9sZRT09PGTBggHTs2FFycnKczjFeXvatzWaTlStXmmrL29tbHnvsMfvZD2fPnueXewbLEZvNJt999508/PDDUqNGDenTp4+89957smbNGrl06ZKp/qWnp5taH+5T6hfyXVHMKok+RUdHm+pTcW7EKq83xeWWQ4cOmdpOdna2WrVqlVJKqcGDBxfZ/s6dO02/FyPtGin79+9XS5cuVSKi3n33XdP9SEtLK9Cmq27c6tGjh7p48aLDfp85c8ZU2xkZGfZnzZ0NRyoiqkOHDqb7vXDhQpWRkaEOHDjgtN3ytG/DwsJMt79lyxZ1+fJlh8/9Oyrr1q1TWVlZqlmzZqZ/Z318fNSIESPUqlWrlM1mK7JvERERLvlbcVXhpji43GuvvWZqZrG77747z81FFYmZG3xEbkxm07NnTzl37pzTI8Gb5Z+wxQhXXALp0KGD3HvvvfbZsO68807TbTg6u+CqGyhr1qwpqampDpflH6GtKFWrVpWxY8eKSOGnsbdt22b6Gn3//v2latWqsnPnTqfrlKd9u3nzZtOX5R544AG55ZZbCr28lF/lypXlpZdeMrUdEZHMzEz57rvvpFevXtKhQ4cin/s/cuSI6W3A9Qh0N1q1apXMnDnT8PoeHh4yYsQIN/ao7JozZ46lWa+Mhs7s2bPlxIkTptrOP4e5Fa+++qqcO3fO/oHCys12jq4JW50aM7969eo5vX7qaErOotSoUUOuX79e5NML27ZtM9Vu7vClNz/Xnl952rci1i5rKKVk3rx5puoMHz7c1LP/+e3evVv69+/v9DJiYmKi6aGQ4R4EuptNmDDB1N2oQ4cOFV9fXzf2qGw6ffq0oRt98lu+fLmh9TIyMuS9994z1Xa7du2KNeBP586dZcCAAXk+rKSkpJhup3LlygVeCw4OttSn/ON6N2nSRI4ePepw3Z9//tnSzVJ79uyR06dPF7qOlZvurl+/XuiRYnnatyI37h0xO+jRn3/+KTt27DBV59Zbby1y6mEjJk2a5PCRN7MfzuA+BHoJeOyxxwwfSQYFBckbb7xhehvufm66JDia4KMwqamppp6ZnjNnjqkPV35+fjJmzBhTfbq57uzZs+XUqVN55o+2cmrS0eQaVkcyyx9W999/v+zbt8/hujabzfQz0yLGwnrx4sWmwywmJkaSk5OdLi9P+1ZEJD4+vtA79h0xezNdroiICBk+fLilurlSU1MLPOqWnZ0tn376abHahWuV+oV8VxSzSrp/Xl5eKjIy0lDfUlNTTd3IEhQUZGnay7J0U1xu+fPPPw1va/HixabbDwwMNHWz4qlTpwxNuXlz8fHxUb/++qvKzMxUvXv3zrMsODjY0E1G+d08Upi/v79KSkqydCPkhAkT7O306tVLZWVlFTrq2siRI021n5OTo1q2bGloP23fvt1U259++mmh7ZW3fSsiasyYMYbbz87ONvV/Yd26dXnqJyUlqfbt2xfr7/PChQt52sy92bOslYp6U5yUgQ64pJhVWv18+eWX1cWLF4vs3549e1RAQIChNocNG2b6/StVNgP9zTffNLwtZ/NwF1WCg4PVnj17DG9n5cqVytfX11DbTZo0UVFRUSo7O1u9/vrrDtdZtGiR6f06fPhwe/33339frV271tLMfidOnFBhYWGqZcuW6sCBA2r79u2Fvh9fX19Dv6+5nM1456h88MEHpvo+ZMiQItssT/tW5MaHv+TkZEPt79y509Tvef5AV+pGqHfr1s3S382IESPytHX48OE8H4bKUiHQy3kxqzT72qxZM7VkyRKVlZVVaB+3bdum6tWrV2R7S5YsMf3+lSqbgV6jRg2Vnp5e5HYuXbpkaOxsZyUgIEBFRkYaPrOxe/du1aNHD6ftNW7cWM2cOVNdvHhR2Wy2PEdrjtY9ffq0qf26d+9e1bdvX/XWW2+py5cvq7CwMBUSEqLOnz9vqp2bZWdnq4cffrjIfbVs2TLDbX722WeGfwZdunQx3O7ly5cNfagqb/tWxPiUy5MnTzb1O+4o0JW6MTb8zJkzVVBQkOG2unbtqpKSkuxtxMfHq+bNmxf7f6G7CoFezotZpd1fkRv/0BYuXFhogCUnJ6t//OMfDk/71qtXT82ePdthKGVkZKidO3eqzz//XI0fP171799fPfXUU+rnn39W2dnZSqmCgd60aVM1duxYe1mwYIHp/ZqUlJSnjZuPfowWI9st7DlnM2Xw4MGmjtYPHjyoVqxYob7++ms1d+5ctWLFCnXkyBH7Po2Oji40+HNL+/btVXx8vOn9m5OToyZOnGhvp2fPnurs2bOW2vnoo48M7aOxY8cabrdPnz6m9n9iYqKhdqOiogy3WZ72rciNiVOKcv36dYfzohdWcgP99OnT6plnnlHdu3dXixcvVteuXVNKKZWenq4WLFignn32WdWwYcMC9YODg9WTTz6pFi1aZJ9QJicnRy1YsEDVqFGjRP5HWi0EejkvZpV2f28uQUFB6qWXXlLLly/P8yn4ZjabTcXGxqqdO3eqPXv2qPj4+DxH+JcuXVL//e9/1cyZM9XQoUMLPZoZPXq0SklJUeHh4XleHz9+vOn9WBQrg+UY+Qf33HPPufRn0KdPHxUZGWn66E4ppTIzM9Xq1avVmDFjlJeXl+Ft+vv7q48//tjwNnP/Medvp169eurbb79VaWlphto5fvy4ev75503108hZkzNnzpje70ZPkb///vum2i0v+za3HDhwoNB2N2/ebLrNdevWqZSUFNW6des8rzdp0kR9+umnBWajy8zMVMnJyers2bPq0qVLeZZdvnxZ/fjjj6pr164u/btzV6moge7xf1+Uezd+JsaV5HzXZjVu3Fg6deokDRo0kLvuukuqV68uPj4+4u3tLR4eHpKZmSmpqaly5swZOXLkiPz+++88OuJCoaGh0qFDB7n77rvlzjvvlICAAPH29pZKlSrJ1atX5cqVK3Lp0iWJi4uTP/74Q6KiopwOIGLUwIEDpXXr1tKoUSPx9/eXW265RURELl++LCdOnJD//ve/8tNPPxX6rL6fn5/07dtXWrduLfXq1ZPbbrtNfHx8JCsrSy5duiTHjx+XrVu3yuLFi00NeFTeled9++2338qIESPktddekw8++MBU3ZkzZ8rBgwdl1qxZTtcJDQ2VsLAwadq0qdSsWVNuueUWqVSpkqSnp9vf17Zt22TdunWWxokoLXFxcdKgQQPD65flPDCDQAeAMsjLy0tOnjwp1apVk5CQEDlz5kxpd6ncqKiBznPoAFAGDRkyRIKCgmTLli2EOQwh0AGgDBo6dKiIiCxZsqSUe4LyglPuAOAGtWrVkpCQEMnJyZH4+Pgih8O9mb+/v5w4cUIqVaokderUkbS0NDf2VD+ccgcAFFtERITs2bNHEhISZNOmTRIVFSUnT56UI0eOyLRp0xwON5vfqFGjxN/fXzZs2ECYw5RSv9XeFcWs0u4vhULRr0yaNMk+JoEzq1evLrKdbdu2KaWKHvyJ4rhU1MfWpAx0wCWFQKdQKKVZ2rRpYx+0pShjxoxx2k779u1VdnZ2sUddrMilogY6p9wBwAXGjh0rVapUMbRu7969nS578cUXpVKlSrJo0SJXdQ0VBIEOAC7QqlUrw+sGBQU5fL1hw4YyaNAguXTpknz88ceu6hoqCAIdAFzg9ttvN7yus1HXpk6dKlWrVpX58+fLqVOnXNU1VBAEOgC4gJkhX2NjYwu8FhYWJo888oikpqbK9OnTXdk1VBCepd0BANDB8ePH5e6773a6/PDhwzJjxgwREdm6dWueZb6+vjJr1izx8vKSadOmyfHjx93ZVWis1O/Mc0XhLncKhVKaZdy4cYX+z5k/f77TurlTBht5pI1SdOEudwCAZbNmzZLt27c7Xe7t7V3gNT8/P5k/f74MHz5coqOj5bHHHnNnF1EBlPqnClcUjtApFEppl9q1a6s//vjD4f+clJQUNXDgQCUiqmHDhurVV19VsbGxSiml1q9fr4KDg0u9/7qUinqELmWgAy4pBDqFQikLxdfXV3300UcqJSXF4f8em81m/zohIUG98cYbpd5n3UpFDXQmZwEAN/Dz85NHH31U2rRpI/Xr1xc/Pz+pVKmSXLx4UY4fPy7r16+XJUuWSGZmZml3VTsVdXIWAh0AoJWKGujcFAcAgAYIdAAANECgAwCgAQIdAAANEOgAAGiAQAcAQAMEOgAAGiDQAQDQAIEOAIAGCHQAADRAoAMAoAECHQAADRDoAABogEAHAEADBDoAABog0AEA0ACBDgCABgh0AAA0QKADAKABAh0AAA0Q6AAAaIBABwBAAwQ6AAAaINABANAAgQ4AgAYIdAAANECgAwCgAQIdAAANEOgAAGiAQAcAQAMEOgAAGiDQAQDQAIEOAIAGCHQAADRAoAMAoAECHQAADRDobjB8+HCJjY2Vq1evSnx8vDz77LMO14uIiBCllERERBRYNnr0aFFKyZ9//ml/bfz48aKUEj8/vwLr9+3bV6KjoyUjI0MSEhJk4sSJhW4zf3HUh8K0a9dOdu7cKVeuXJHExESZMWOG03X79Olj79vp06dl+vTpJd4uAFQESodilrv6UbNmTXXx4kUVFxen/vWvf6mdO3eq69evq9DQ0ALrRkREKKWUioiIKLBs9OjRSimlcnJyVNOmTZWIqPHjxyullPLz88uzbmBgoDp37pw6efKkmjFjhtqwYYPKyclRffr0cbrN7777Tk2ZMsVemjdvbup9xsTEqKSkJPXRRx+pdevWKaWUGjt2bIH1AgICVFJSkjp9+rT66KOP1IYNG5RSSj399NMl2i6FQqk4JS4urkzkQSmUUu+AS0pZCfSnnnpKKaXUkCFDlIio2rVrK5vNpqZOnVpgXaOB/tZbbykR54H+xBNPKKWUGjlypBIR5evrq1JTU9UXX3xhaptGS2hoqFJKqeeee06JiPLy8lLJycnql19+cbq9UaNGKRFRPj4+6ty5cw7XdVe7FAqlYpWKGuiccnexoKAgERGJj48XEZFTp07Jrl275MbvjHmHDx+W7t27F7pOrVq1RETkwIEDIiKSkZEhSUlJcuedd1raZlEaNGggImK/HGCz2SQxMVFq1KhRYN06derkWTczM1NOnTrlsG/uahcAKgIC3cWOHz8uIiK9evWyv9axY0eZPHmypfY2bdokbdq0kcDAQKfreHp6iojk+dCwc+dOe8C72oULF2T9+vVy/vx5+2uBgYGSmprqtG/Z2dn215RSUrly5RJrFwAqAgLdxX766Sc5ePCgvP7669K5c+dit7dixQrx8fGRoUOHmqo3cuRIef31150uv+OOO6R169bSunVrCQ4ONtX2+vXrpXv37rJ//34RERkyZIjUqlVL1qxZY6qdkmoXACoCAt3FMjMzZdy4cZKdnS1Lly6V8PDwYrV39OhROXr0aJ4jflf46KOPZNeuXbJr1y6nd8Qb4evrK1OmTJFjx47Jv//9b5f1z13tAoCuPEu7AzrauHGjhIeHy4IFC2T+/Pny17/+VX744QfL7W3atEkGDRoka9eudVkfP/74Yzl48KCISJ5H48yaO3euNGjQQIYOHSqZmZmu6p7b2gUAXXGE7iabN2+WXr16yaVLl+RuU+KiAAAEOElEQVTjjz+W2rVrW25rxYoVUr16dWnRooXhOp06dZLQ0FCny3fu3Clz5syROXPmyJYtWyz1a/r06TJ48GCZPHmyLF++3FIbJdkuAOiMQHexli1bysMPPywiIvv375e//e1vEhQUJKNGjbLc5pIlS+T8+fMSFhZmuM7nn38uU6dOtbzNogwYMEAmTJgg//nPf+T9998v8+0CgO4IdBd78skn5fvvv7d/HxkZKdnZ2fbHrKzaunWrNGrUyOGyrKwsERHx8PCwv1apUqU8d4C72qRJk+T48ePy4osvFrpebt9uvvvcw8PDad/c1S4A6I5Ad7EzZ86Ir6+vNGnSREREWrRoIZUrV5bk5ORitbtq1ao8gX2zkydPiohI06ZNReTGDWVBQUFy5syZYm3TmSZNmkjbtm3lm2++kfT09ELXTUhIsNcREfHy8pJatWpJUlJSibULABUBN8W52LJly2TKlCkSGRkpa9eulR49ekhWVpYsXry4WO0uWrRIZsyYIT4+PgWW/frrr5KcnCxTp06V++67T+6//37x9/cvdJu9e/eWe+65x/79woUL7Y+LFaVJkybi4eEhjRo1kilTpthfP3jwoERGRuZZd+XKlXL27FmZNm2a3HfffdKiRQu54447ZMmSJSXWLgBUFKU+XJ0rSlkZ+lVE1F/+8hd15MgRlZmZqeLj4+1DmeYvRoZ+bdKkif21qKgoh0O/iogaMGCA+vPPP9XVq1fVyZMn1cSJEwvdZn5mhoJ11saSJUscrt+nTx+1b98+lZGRoU6fPq2mT59eou1SKJSKVSrq0K8e//dFuadMDq3q7PQ1AKB8i4uLsw8lbYQuecA1dAAANECgAwCgAQIdAAANEOgAAGiAQAcAQAMEOgAAGiDQAQDQAIEOAIAGCHQAADRAoAMAoAECHQAADRDoAABogEAHAEADBDoAABrwLO0OuEpiYqKp9Tds2OCmngAAStOVK1dMZ4IOKux86AAAPZ04cULq1q1reH3mQwcAAGUGgQ4AgAYIdAAANECgAwCgAQIdAAANEOgAAGiAQAcAQAMEOgAAGiDQAQDQAIEOAIAGtBn6FQCAiowjdAAANECgAwCgAQIdAAANEOgAAGiAQAcAQAMEOgAAGiDQAQDQAIEOAIAGCHQAADRAoAMAoAECHQAADRDoAABogEAHAEADBDoAABog0AEA0ACBDgCABgh0AAA0QKADAKABAh0AAA0Q6AAAaIBABwBAAwQ6AAAaINABANAAgQ4AgAYIdAAANECgAwCgAQIdAAANEOgAAGiAQAcAQAMEOgAAGiDQAQDQAIEOAIAGCHQAADRAoAMAoAECHQAADRDoAABogEAHAEADBDoAABog0AEA0ACBDgCABgh0AAA0QKADAKABAh0AAA0Q6AAAaIBABwBAAwQ6AAAaINABANAAgQ4AgAYIdAAANPD/AEKG/MBcUSzSAAAAAElFTkSuQmCC",
        width: 100,
        height: 100,
        alignment:'center',
        margin: [10,10,10,10]
      },
      { text: 'Daily Sales Report ', fontSize: 18 ,bold:true,alignment:'center'},
      { width:'50%',text: 'Competition :'+this.competition},  
      { width:'50%',text: 'Competition Date :'+this.start_date+' To '+ this.end_date},
      this.table(this.bodyData, ['Sno','date', 'totalTickets','dailySold','dailyUnsold']),
    ]
     ]
    }
  ],
    styles: {
      name: {
        fontSize: 16,
        bold: true
    }
  }
};

 

}

buildTableBody(data, columns) {
  var body = [];

  // body.push(columns);
  body.push(['Sno','Date', 'Total Tickets','DailySold','DailyUnsold']) 
  data.forEach(function(row) {
      var dataRow = [];
    
      columns.forEach(function(column) {
          dataRow.push(row[column].toString());
      })

      body.push(dataRow);
  });

  return body;
}



  change_competition(e){

  }

  onDateChanged(event,text_date) {
    // let {date, jsDate, formatted, epoc} = event.singleDate;
    // console.log(event['singleDate'])
    if(text_date == 'start_date'){
      // this.competitionform.controls['draw_start_date_time'].setValue(event.singleDate.formatted);
      let start_date = event['singleDate'].date;
      // this.myDatePickerOptions2 = {
      //    dateRange: false,
      //    dateFormat: 'dd-mm-yyyy',
      //    disableUntil: {day:start_date.day - 1,month: start_date.month,year: start_date.year}
      //  };
    }else if(text_date == 'end_date'){
      // this.competitionform.controls['draw_end_date_time'].setValue(event.singleDate.formatted);
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
    // let copy = this.getCopyOfOptions();
    // copy.dateRange = checked;
    // this.myDatePickerOptions = copy;
  }

}
