import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { MyservicesService } from "../../../myservices.service";
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-admin-emailtemplate-view',
  templateUrl: './admin-emailtemplate-view.component.html',
  styleUrls: ['./admin-emailtemplate-view.component.css']
})
export class AdminEmailtemplateViewComponent implements OnInit {
  user;
  globalSettings;
  globals = environment;

  record_id: string;
  record: any;
  data;
  pageTitle = "Email Template";
  pageSlug = "admin/emailtemplate";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private myservices: MyservicesService,
    private toster: ToastrService
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
    const newformData = new FormData();
    newformData.append('id', Id);
    await this.myservices.post(this.pageSlug+"/view", newformData, response =>{      
      if (response.status == 1) {      
        this.data = response.response;
        this.record = response.response;
      } else {
        this.toster.error(response.message);
        this.router.navigate([this.pageSlug]);
      }
    },err =>{},true)
  }
}
