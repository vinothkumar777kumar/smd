import { Component, OnInit } from '@angular/core';
import { DataserviceService } from 'src/app/dataservice/dataservice.service';

@Component({
  selector: 'app-basiclayout',
  templateUrl: './basiclayout.component.html',
  styleUrls: ['./basiclayout.component.css']
})
export class BasiclayoutComponent implements OnInit {

  constructor(private ds: DataserviceService) { }

  ngOnInit(): void {
    this.ds.scrollToTop(2000);
  }

}
