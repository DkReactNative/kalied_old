import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MyservicesService } from "../../../myservices.service";
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-client-add',
  templateUrl: './admin-client-add.component.html',
  styleUrls: ['./admin-client-add.component.css']
})
export class AdminClientAddComponent implements OnInit {
  user;
  globalSettings;
  globals = environment;

  pageTitle = "Client"
  pageSlug = "admin/client"
  user_id;
  imageUrl;
  newRecordByAdmin:any = {
    name: '',
    email: '',
    companyname:'',
    password: '',
    confirm_password: '',
    image: '',
    businesstype: '',
    business_summary:'',
    address:'',
  };
  

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ngxService: NgxUiLoaderService,
    private myservices: MyservicesService,
    private toastr: ToastrService,
  ) {
    this.user = JSON.parse(localStorage.getItem('CFadminuserData'));
    this.globalSettings = JSON.parse(localStorage.getItem('CFglobalSettings'));
  }

  async ngOnInit() {
    this.myservices.checkAdminLogin();
  }

  uploadFile(event) {
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      this.imageUrl = <File>event.target.files[0];
    }
  }

  newRecordSubmit = async (formData) => {
    if (formData.password == formData.confirm_password) {
      var newFormData = new FormData();
      newFormData.append("name", formData.name)
      newFormData.append("email", formData.email)
      newFormData.append("companyname",formData.companyname)
      newFormData.append("appearas",formData.appearas)
      newFormData.append("phoneno",formData.phoneno)
      newFormData.append("businesstype",formData.businesstype)
      newFormData.append("business_summary",formData.business_summary)
      newFormData.append("address",formData.address)
      newFormData.append("password", formData.password)
      newFormData.append("confirm_password", formData.confirm_password)
      newFormData.append("role", '2')
      if (this.imageUrl) { newFormData.append('image', this.imageUrl); }
      this.ngxService.start();
      await this.myservices.post(this.pageSlug +"/create", newFormData,response =>{
      this.ngxService.stop();
        if (response.status == 1) {
          this.router.navigate([this.pageSlug]);
          this.toastr.success(response.message);
        } else {
          this.toastr.error(response.message);
        }
      },err =>{},true)
    } 
  }
}
