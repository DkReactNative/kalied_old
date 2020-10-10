import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../global.service';
import { Router } from "@angular/router";
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private route: Router,public global:GlobalService) { }

  ngOnInit() {
  }

  navigate(path){
    this.route.navigate(["/user/"+path], { replaceUrl: true });
  }

}
