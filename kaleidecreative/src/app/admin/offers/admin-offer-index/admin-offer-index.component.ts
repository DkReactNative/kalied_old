import { Component, OnInit } from '@angular/core';
import { MyservicesService } from "../../../myservices.service";
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-offer-index',
  templateUrl: './admin-offer-index.component.html',
  styleUrls: ['./admin-offer-index.component.css']
})
export class AdminOfferIndexComponent implements OnInit {
  user;
  globalSettings;
  globals = environment;

  pageTitle = "Offer"
  pageSlug = "offer"
  page = 1;
  perPage = 10;
  totalPages = 1;
  pagination = [];
  data: any = {};
  searchData = {
    title: '',
  }

  constructor(
    private myservices: MyservicesService,
    private toster: ToastrService
  ) {
    this.user = JSON.parse(localStorage.getItem('CFadminuserData'));
    this.globalSettings = JSON.parse(localStorage.getItem('CFglobalSettings'));
  }

  ngOnInit() {
    this.myservices.checkAdminLogin();
    this.getRecords(1);
  }

  getRecords = async (page) => {
    this.page = page
    var newFormData = new FormData();
    newFormData.append("page", page);
    newFormData.append("searchForm", JSON.stringify(this.searchData));
    await this.myservices.adminApiCall(this.pageSlug, newFormData).then((response) => {
      this.data = response.response;
      this.perPage = response.response.perPage
      this.totalPages = response.response.totalPages
      this.pagination = Array.from({ length: response.response.totalPages }, (v, k) => k + 1);
    });
  }

  StatusUpdate = async (Id, indexIs, statuss) => {
    let confirmMessage = "Are you sure you want to Change status?";
    if (confirm('Are you sure you want to Change status?')) {
      const newformData = new FormData();
      newformData.append('_id', Id);
      newformData.append('status', statuss);
      await this.myservices.adminApiCall(this.pageSlug + "/change_status", newformData).then((response) => {
        if (response.status == 1) {
          this.data.records[indexIs].status = statuss;
          this.toster.success(response.message);
        } else {
          this.toster.success('There was an error please try after some time!!');
        }
      });
    } else {
      return false;
    }
  }

  deleteRecord = async (Id, Indexis) => {
    if (confirm('Are you sure you want to Delete record?')) {
      const newformData = new FormData();
      newformData.append('_id', Id);
      await this.myservices.adminApiCall(this.pageSlug + "/delete", newformData).then((response) => {
        if (response.status == 1) {
          if (Indexis !== -1) {
            this.data.records.splice(Indexis, 1);
          }
          this.toster.success(response.message);
        } else {
          this.toster.error('There was a error please try after some time');
        }
      });
    } else {
      return false;
    }
  }
}
