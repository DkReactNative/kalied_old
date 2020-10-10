import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { MyservicesService } from "../../../myservices.service";
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { NgxUiLoaderService} from 'ngx-ui-loader';

@Component({
  selector: 'app-admin-client-view',
  templateUrl: './admin-client-view.component.html',
  styleUrls: ['./admin-client-view.component.css']
})
export class AdminClientViewComponent implements OnInit {

   user;
  globalSettings;
  globals = environment;

  pageTitle = "Client"
  pageSlug = "admin/userManage/search"
  user_id;
  imageUrl;
  record;
  newRecordB

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ngxService: NgxUiLoaderService,
    private myservices: MyservicesService,
    private toastr: ToastrService,
  ) {
    this.user_id = this.route.snapshot.params.userId;    
    this.user = JSON.parse(localStorage.getItem('CFadminuserData'));
    this.globalSettings = JSON.parse(localStorage.getItem('CFglobalSettings'));
   }
   async ngOnInit() {
    this.myservices.checkAdminLogin();
    if (this.user_id) {
      //let formData = new FormData();
     // formData.append("user_id", this.user_id);
      await this.myservices.get("admin/userManage/" +this.user_id, response =>{              
        this.record = response.response;
      },err =>{},true)
    }
  } 
}