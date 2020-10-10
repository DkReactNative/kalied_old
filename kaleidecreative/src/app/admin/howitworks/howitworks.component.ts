import { Component, OnInit } from '@angular/core';
import {MyservicesService} from '../../myservices.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { async } from '@angular/core/testing';
import { Router } from '@angular/router';
@Component({
  selector: 'app-howitworks',
  templateUrl: './howitworks.component.html',
  styleUrls: ['./howitworks.component.css']
})
export class HowitworksComponent implements OnInit {


  user;globalSettings;
  howItWorksForm :any={
    title:"",
    title_description:"",
    description1:"",
    description2:"",
  }
  constructor(
    private myservice : MyservicesService,
    private toastr: ToastrService,
    private ngxService: NgxUiLoaderService,
    private router: Router
  ) { }

  ngOnInit() {
    this.myservice.checkAdminLogin();
    this.user = JSON.parse(localStorage.getItem('CFadminuserData'));
    this.globalSettings = JSON.parse(localStorage.getItem('CFglobalSettings'));
    //console.log(this.howItWorksForm);
    this.get_howitworks();
  }

  get_howitworks = ()=>{
    this.myservice.get("admin/staticpage/how-it-works",response=>{

      if(response.status == 1){         
        this.howItWorksForm = response.response           
      }
    },err =>{},true) 

  }

  

  update_howitWorks = async (fromData)=>{
    let newFormData = new FormData()
    newFormData.append('title',fromData.title)
    newFormData.append('title_description',fromData.title_description)
    newFormData.append('description1',fromData.description1)
    newFormData.append('description2',fromData.description2)
    if(this.howItWorksForm._id){
      newFormData.append("id",this.howItWorksForm._id);
    }
    this.ngxService.start();   
    await this.myservice.post("admin/staticpage/how-it-works",newFormData,response=>{      
      if(response.status == 1){
        this.toastr.success(response.message);
        this.ngxService.stop();
      }else{
        this.toastr.error(response.message);
      }
    },err=>{},true)
  }

}
