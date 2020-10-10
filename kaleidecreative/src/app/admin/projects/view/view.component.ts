import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { MyservicesService } from "../../../myservices.service";
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import * as moment from 'moment';
import { globals } from '../../../app.global';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})

export class ProjectViewComponent implements OnInit {

  user;
  globalSettings;
  //globals = environment;
  global = globals
  projecttype
  moments = moment

  record_id: string;
  record: any;
  data;
  pageTitle = "Project"
  pageSlug = "admin/project"

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private myservices: MyservicesService,
    private toster: ToastrService,
    private sanitizer: DomSanitizer,
    private ngxService: NgxUiLoaderService,
  ) {
    this.user = JSON.parse(localStorage.getItem('CFadminuserData'));
    this.globalSettings = JSON.parse(localStorage.getItem('CFglobalSettings'));
  }

  ngOnInit() {
    this.myservices.checkAdminLogin();
    this.record_id = this.route.snapshot.params.id;
    this.getUser(this.record_id);
  }



  getUser = async (Id) => {
    this.ngxService.start();
    await this.myservices.get("admin/projectManage/view/" + Id, response => {
      this.ngxService.stop();
      if (response.status == 1) {
        this.data = response.response[0];
        console.log("data ------ : ", this.data);
        this.projecttype = response.response[0].projectype;

      } else {
        this.toster.error(response.message);
        this.router.navigate(['/admin/project']);
      }
    }, err => { }, true)
  }


  getVimeoId(url) {

    if (!url) return;
    var match = url.match(/^.+vimeo.com\/(.*\/)?([^#\?]*)/);
    url = "https://player.vimeo.com/video/";

    return match
      ? this.sanitizer.bypassSecurityTrustResourceUrl(url + match[2]) ||
      this.sanitizer.bypassSecurityTrustResourceUrl(url + match[1])
      : null;

  }


}

