import { Component, OnInit } from '@angular/core';
import { MyservicesService } from "../myservices.service";
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  user; globalSettings:any = JSON.parse(localStorage.getItem('CFglobalSettings'));
  globals = environment;
  constructor(
    private router: Router,
    private myservices: MyservicesService,
  ) {
    if(!this.globalSettings){
      this.get_global_settings()
    } else if (this.globalSettings && this.globalSettings.today_date != new Date().toLocaleDateString("en") ) {
      this.get_global_settings()
    }
  }
  get_global_settings = () => {    
     this.myservices.post("admin/config",{},response =>{
      if(response.status == 1){
        this.globalSettings = response.response
        localStorage.setItem("CFglobalSettings",JSON.stringify(response.response))
        location.reload()
      }
    },err =>{},true)
	}
  ngOnInit() {
    console.log("component admin loaded")
  }
}
