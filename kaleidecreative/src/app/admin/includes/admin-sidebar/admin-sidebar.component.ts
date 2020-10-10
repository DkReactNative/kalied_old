import { Component, OnInit, Input } from '@angular/core';
import { MyservicesService } from "../../../myservices.service";
import { Router } from '@angular/router';
//import {environment} from '../../../../environments/environment';
import { globals } from '../../../app.global';
declare const $: any;
@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css']
})
export class AdminSidebarComponent implements OnInit {
  @Input() user;
  @Input() globalSettings;
  globals = globals;
  dashboardUrls = ["profile_edit"]
  urlSlug;
  constructor(
    private router: Router,
    private myservices: MyservicesService,
    ) {
      this.urlSlug = this.router.url.split("/");
  }

  ngOnInit() {       
  $(document).ready(() => {
      const trees: any = $('[data-widget="tree"]');
      trees.tree();
    }); 
  }

  updateIndex(){
    this.myservices.pageIndex=1;
  }

}
