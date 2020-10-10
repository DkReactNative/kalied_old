import { Component, OnInit } from '@angular/core';
import { MyservicesService } from "../../../myservices.service";
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class ProjectIndexComponent implements OnInit {
  user;
  globalSettings;
  globals = environment;

  pageTitle = "Project"
  pageSlug = "admin/project"
  page = 1;
  perPage = 10;
  totalPages = 1;
  pagination = [];
  data: any = {};
  projecttype
  searchData: any = {
    keyword: '',
    start_date: '',
    end_date: '',
    project_type: '',
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
    this.getRecords(this.myservices.pageIndex ? this.myservices.pageIndex : 1);
  }

  getRecords = (page) => {
    this.page = page
    this.myservices.pageIndex = page;
    var searchData = this.searchData;
    var newFormData = new FormData();
    newFormData.append("page", page);
    newFormData.append("keyword", searchData.keyword);
    newFormData.append("start_date", (searchData.start_date));
    newFormData.append("end_date", (searchData.end_date));
    newFormData.append("project_type", (searchData.project_type));
    this.myservices.post('admin/projectManage/list/' + this.page, newFormData, response => {
      this.data = response.response;
      this.projecttype = response.response.project_type;
      this.perPage = response.response.perPage
      this.totalPages = response.response.totalPages
      this.pagination = Array.from({ length: response.response.totalPages }, (v, k) => k + 1);
    }, err => { }, true)
  }

  StatusUpdate = async (Id, indexIs, statuss) => {
    let confirmMessage = "Are you sure you want to Change status?";
    if (confirm('Are you sure you want to Change status?')) {
      const newformData = new FormData();
      newformData.append('id', Id);
      newformData.append('status', statuss);
      await this.myservices.post('admin/projectManage/project/changStatus', newformData, response => {
        if (response.status == 1) {
          this.data.terms[indexIs].status = statuss;
          this.toster.success(response.message);
        } else {
          this.toster.success('There was an error please try after some time!!');
        }
      }, err => { }, true);
    }
  }

  // deleteRecord = async (Id, Indexis) => {
  //   if (confirm('Are you sure you want to Delete record?')) {
  //     await this.myservices.delete('admin/userManage/project/' + Id, response => {
  //       if (response.status == 1) {
  //         if (Indexis !== -1) {
  //           this.data.terms.splice(Indexis, 1);
  //         }
  //         this.toster.success(response.message);
  //       } else {
  //         this.toster.error('There was a error please try after some time');
  //       }
  //     }, err => { }, true)
  //   }
  // }
  Reset() {
    this.searchData = {
      keyword: '',
      start_date: '',
      end_date: '',
      project_type: '',
    }
    this.getRecords(1);
  }

}
