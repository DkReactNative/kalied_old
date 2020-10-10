import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { MyservicesService } from "../../../myservices.service";
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-offer-view',
  templateUrl: './admin-offer-view.component.html',
  styleUrls: ['./admin-offer-view.component.css']
})
export class AdminOfferViewComponent implements OnInit {
  user;
  globalSettings;
  globals = environment;

  record_id: string;
  record: any;
  data;
  pageTitle = "Offer"
  pageSlug = "offer"

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
    newformData.append('record_id', Id);
    await this.myservices.adminApiCall(this.pageSlug + "/view", newformData).then((response) => {
      if (response.status == 1) {
        this.data = response.response;
        this.record = response.response.records;
      } else {
        this.toster.error(response.message);
        this.router.navigate(['/admin/' + this.pageSlug]);
      }
    });

  }
}
