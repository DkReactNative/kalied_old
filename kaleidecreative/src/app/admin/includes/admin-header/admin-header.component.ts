import { Component, OnInit, Input } from '@angular/core';
import { MyservicesService } from "../../../myservices.service";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
//import {environment} from '../../../../environments/environment';
import {globals} from '../../../app.global';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent implements OnInit {
  @Input() globalSettings;
  @Input() user;
  globals = globals;
  siteTitle; siteTitleAcronym
  // user = JSON.parse(localStorage.getItem("CFadminuserData"));
  constructor(
    private router: Router,
		private myservices: MyservicesService,
    private toastr: ToastrService,
    private ngxService: NgxUiLoaderService
  ) {

  }

  ngOnInit(){
    this.siteTitle = this.globalSettings.site_title;
    this.siteTitleAcronym = this.siteTitle.split(/\s/).reduce((response,word)=> response+=word.slice(0,1),'')
  }

  adminLogout = () => {
    if(confirm('Are you sure you want to logout?')){
      this.myservices.adminLogout();
    }else{
      return false;
    }
  }

}
