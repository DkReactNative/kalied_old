import { Component, OnInit } from '@angular/core';
import { MyservicesService } from "../../../myservices.service";
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class PortFolioIndexComponent implements OnInit {
  user;
  globalSettings;
  globals = environment;

  pageTitle = "Portfolio"
  pageSlug = "admin/portfolio"
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
     this.myservices.post('admin/userManage/portfolio' , newFormData,response=>{       
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
      await this.myservices.post('admin/userManage/portfolio/changStatus', newformData, response =>{        
        if (response.status == 1) {
          this.data.terms[indexIs].status = statuss;
          this.toster.success(response.message);
        } else {
          this.toster.success('There was an error please try after some time!!');
        }
      },err=>{},true);
    } 
  }

  deleteRecord = async (Id, Indexis) => {
    if (confirm('Are you sure you want to Delete record?')) {
      await this.myservices.delete('admin/userManage/portfolio/'+Id,response =>{
        if (response.status == 1) {
          if (Indexis !== -1) {
            this.data.terms.splice(Indexis, 1);
          }
          this.toster.success(response.message);
        } else {
          this.toster.error('There was a error please try after some time');
        }
      },err=>{},true)
    } 
  }
}
