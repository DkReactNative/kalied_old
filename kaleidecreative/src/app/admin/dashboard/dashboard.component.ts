import { Component, OnInit } from '@angular/core';
import { MyservicesService } from "../../myservices.service";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user; globalSettings;
  dashboardData = {
    userCount:0,
    offerCount:0
  };
  constructor(
    private router: Router,
		private myservices: MyservicesService,
    private toastr: ToastrService,
    private ngxService: NgxUiLoaderService
  ) {
  }

  ngOnInit() {
    this.myservices.checkAdminLogin();
    this.user = JSON.parse(localStorage.getItem('CFadminuserData'));
    this.globalSettings = JSON.parse(localStorage.getItem('CFglobalSettings'));
    //this.myservices.adminApiCall("get_dashboard_data",{}).then( (response) => { this.dashboardData = response.response; } )
  }

}
