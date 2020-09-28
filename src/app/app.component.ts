import { Component } from '@angular/core';
import { DataserviceService } from './dataservice/dataservice.service';
import { ApiconfigService } from './dataservice/apiconfig.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'elitecompetition';

  constructor(private ds: DataserviceService,private acs: ApiconfigService) { 
  }
  onActivate(event: Event) {
    window.scrollTo(0, 0);
  }
}
