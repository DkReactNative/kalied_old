import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { MyservicesService } from "../../../myservices.service";
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-top-client-view',
  templateUrl: './top-client-view.component.html',
  styleUrls: ['./top-client-view.component.css']
})
export class TopClientViewComponent implements OnInit {
  user;
  globalSettings;
  globals = environment;

  record_id: string;
  record: any;
  data;
  pageTitle = "Top Clients"
  pageSlug = "admin/homeslider/toptier/"

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
    
    await this.myservices.get(this.pageSlug+"view/"+Id, response =>{      
      if (response.status == 1) {      
        this.data = response.response;
        this.record = response.response;
      } else {
        this.toster.error(response.message);
        this.router.navigate(['/admin/tierclients']);
      }
    },err =>{},true)
  }
}
