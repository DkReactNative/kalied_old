import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { MyservicesService } from "../../../myservices.service";
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})

export class PortFolioViewComponent implements OnInit {

  user;
  globalSettings;
  globals = environment;
  
  projectType : any = [
					  {value:1,name:"Small scale"},
					  {value:2,name:"Government"},
					  {value:3,name:"Manufacturing"},
					  {value:4,name:"Management"},
					  {value:5,name:"Research"}
  ]
  Industry : any = [
					  {value:1,name:"IT"},
					  {value:2,name:"AUTO MOBILE"},
					  {value:3,name:"Medicine"},
					  {value:4,name:"Sports"},
					  {value:5,name:"Music"}
  ]
  Genre : any = [
					  {value:1,name:"Poetry"},
					  {value:2,name:"Drama"},
					  {value:3,name:"Prose"},
					  {value:4,name:"Nonfiction"},
					  {value:5,name:"Media"}
  ]
  
                                        
  record_id: string;
  record: any;
  data;
  pageTitle = "PortFolio"
  pageSlug = "admin/portfolio"

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
    
    await this.myservices.get("admin/userManage/portfolio/"+Id, response =>{      
      if (response.status == 1) {      
        this.data = response.response;
        this.record = response.response;
      } else {
        this.toster.error(response.message);
        this.router.navigate(['/admin/portfolio']);
      }
    },err =>{},true)
  }

  filterName(key,value){
      let name="NA";
      let array = [];
      if(key==1)
        array = this.projectType;
      if(key==2)
        array = this.Industry;
      if(key==3)
        array = this.Genre;   
      console.log(array,key,value)
      for(let i = 0; i < array.length; i++ ){
       if(array[i].value == value ){
        name = array[i].name;
        break;
       }
      }
      return name;
  }
}

