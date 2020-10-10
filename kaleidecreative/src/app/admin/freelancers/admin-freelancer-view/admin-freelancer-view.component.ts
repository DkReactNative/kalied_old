import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { MyservicesService } from "../../../myservices.service";
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DomSanitizer } from '@angular/platform-browser';
import { constant } from '../../../app.global';
import { globals } from '../../../app.global';

@Component({
  selector: 'app-admin-freelancer-view',
  templateUrl: './admin-freelancer-view.component.html',
  styleUrls: ['./admin-freelancer-view.component.css']
})
export class AdminFreelancerViewComponent implements OnInit {
  constant = constant;
  record;
  user_id
  user;

  globalSettings;
  globals = environment;
  global = globals;
  expertise;
  projecttype;
  industrytype;
  generaltype;
  dynamicUrl;
  pageTitle = "Freelancer"
  pageSlug = "admin/userManage/search"

  // showModal: Boolean;
  // content: string;
  title: string;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ngxService: NgxUiLoaderService,
    private myservices: MyservicesService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer

  ) {
    this.user_id = this.route.snapshot.params.userId;
    this.user = JSON.parse(localStorage.getItem('CFadminuserData'));
    this.globalSettings = JSON.parse(localStorage.getItem('CFglobalSettings'));
  }
  ngOnInit() {
    this.myservices.checkAdminLogin();
    if (this.user_id) {
      //let formData = new FormData();
      // formData.append("user_id", this.user_id);
      this.myservices.get("admin/userManage/" + this.user_id, response => {
        console.log("response: ", response);
        this.record = response.response
        this.projecttype = response.response.project_type;

        this.industrytype = response.response.industry_type;

        this.generaltype = response.response.general_type;

        console.log(this.global.uploadUrl)

      }, err => { }, true)
    }
  }
  url(dynamicUrl) {
    this.dynamicUrl = dynamicUrl;
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