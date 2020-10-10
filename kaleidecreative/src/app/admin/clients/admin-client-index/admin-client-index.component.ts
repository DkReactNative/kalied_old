import { Component, OnInit } from '@angular/core';
import { MyservicesService } from "../../../myservices.service";
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-client-index',
  templateUrl: './admin-client-index.component.html',
  styleUrls: ['./admin-client-index.component.css']
})
export class AdminClientIndexComponent implements OnInit {
  user;
  globalSettings;
  globals = environment;
  pageTitle = "Client"
  pageSlug = "admin/userManage/"
  page = 1;
  perPage = 10;
  totalPages = 1;
  pagination = [];
  data: any = {};
  searchData:any = {
    keyword: '',  
    start_date:'',  
    end_date:'',
    businesstype:'',
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
    newFormData.append("role", '2');
    newFormData.append("keyword", (searchData.keyword));
    newFormData.append("start_date", (searchData.start_date));
    newFormData.append("end_date", (searchData.end_date));
    newFormData.append("businesstype", (searchData.businesstype));
    this.myservices.post(this.pageSlug+'search', newFormData, response => {                 
      this.data = response.response;
      this.perPage = response.response.perPage
      this.totalPages = response.response.totalPages
      this.pagination = Array.from({ length: response.response.totalPages }, (v, k) => k + 1);
    },err=>{},true)
  }

  StatusUpdate = async (Id, indexIs, statuss) => {    
    if (confirm('Are you sure you want to Change status?')) {
      const newformData = new FormData();
      newformData.append('id', Id);
      newformData.append('status', statuss);
      await this.myservices.post(this.pageSlug + "changStatus", newformData,response =>{        
        if (response.status == 1) {
          this.data.records[indexIs].status = statuss;
          this.toster.success(response.message);
        } else {
          this.toster.success('There was an error please try after some time!!');
        }
      },err=>{},true)
    } 
  }

  deleteRecord = async (Id, Indexis) => {
    if (confirm('Are you sure you want to Delete record?')) {
      const newformData = new FormData();
      newformData.append('_id', Id);
      await this.myservices.delete(this.pageSlug + Id,response =>{
        if (response.status == 1) {
          if (Indexis !== -1) {
            this.data.records.splice(Indexis, 1);
          }
          this.toster.success(response.message);
        } else {
          this.toster.error('There was a error please try after some time');
        }
      },err =>{},true)
    } else {
      return false;
    }
  }

  ApproveUser(Id,indexIs,status){
   if (confirm('Are you sure you want to approve client?')) {
  var newFormData = new FormData();
    newFormData.append("approve", status );
    newFormData.append("id", Id );
  this.myservices.post(this.pageSlug+'approve', newFormData, response => {                 
     if (response.status == 1) {
          this.data.records[indexIs].approved = status;
          this.toster.success(response.message);
        } else {
          this.toster.success('There was an error please try after some time!!');
        }
    },err=>{},true)
  }
}
  Reset(){
  this.searchData= {
    keyword: '',  
    start_date:'',  
    end_date:'',
    businesstype:'',
  }
  this.getRecords(1)
  }
}
