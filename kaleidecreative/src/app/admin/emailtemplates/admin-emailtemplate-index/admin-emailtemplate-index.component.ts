import { Component, OnInit } from '@angular/core';
import { MyservicesService } from "../../../myservices.service";
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-emailtemplate-index',
  templateUrl: './admin-emailtemplate-index.component.html',
  styleUrls: ['./admin-emailtemplate-index.component.css']
})
export class AdminEmailtemplateIndexComponent implements OnInit {
  user;
  globalSettings;
  globals = environment;

  pageTitle = "Email Template"
  pageSlug = "admin/emailtemplate"
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
    this.getRecords(this.myservices.pageIndex?this.myservices.pageIndex:1);
  }
 
  getRecords =  (page) => {
    this.page = page
    this.myservices.pageIndex=page;
    var searchData = this.searchData;    
     var newFormData = new FormData();
     newFormData.append("page", page);
     newFormData.append("searchForm",searchData.title);    
     this.myservices.post(this.pageSlug , newFormData,response=>{       
     this.data = response.response;
     this.perPage = response.response.perPage
     this.totalPages = response.response.totalPages
     this.pagination = Array.from({ length: response.response.totalPages }, (v, k) => k + 1);
    },err=>{},true)
  }

  StatusUpdate = async (Id, indexIs, statuss) => {
    let confirmMessage = "Are you sure you want to Change status?";
    if (confirm('Are you sure you want to Change status?')) {
      const newformData = new FormData();
      newformData.append('id', Id);
      newformData.append('status', statuss);
      await this.myservices.post(this.pageSlug + "/change_status", newformData, response =>{        
        if (response.status == 1) {
          this.data.records[indexIs].status = statuss;
          this.toster.success(response.message);
        } else {
          this.toster.success('There was an error please try after some time!!');
        }
      },err=>{},true);
    } 
  }

  deleteRecord = async (Id, Indexis) => {
    if (confirm('Are you sure you want to Delete record?')) {
      const newformData = new FormData();
      newformData.append('_id', Id);
      await this.myservices.post(this.pageSlug + "/delete", newformData,response =>{
        if (response.status == 1) {
          if (Indexis !== -1) {
            this.data.records.splice(Indexis, 1);
          }
          this.toster.success(response.message);
        } else {
          this.toster.error('There was a error please try after some time');
        }
      },err=>{},true)
    } 
  }
}
