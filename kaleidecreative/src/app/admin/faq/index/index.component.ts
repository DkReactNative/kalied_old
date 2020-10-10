import { Component, OnInit } from '@angular/core';
import { MyservicesService } from "../../../myservices.service";
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class FaqIndexComponent implements OnInit {
  user;
  globalSettings;
  globals = environment;

  pageTitle = "Faq"
  pageSlug = "admin/staticpage/faq/"
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
     this.myservices.get(this.pageSlug+page ,response=>{       
     this.data = response.response;
     this.perPage = response.response.perPage
     this.totalPages = response.response.pages
     this.pagination = Array.from({ length: response.response.pages }, (v, k) => k + 1);
    },err=>{},true)
  }

  deleteRecord = async (Id, Indexis) => {
    if (confirm('Are you sure you want to Delete record?')) {
      await this.myservices.delete(this.pageSlug +Id,response =>{
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
