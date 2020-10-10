import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MyservicesService } from "../../../myservices.service";
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-user-add',
  templateUrl: './admin-user-add.component.html',
  styleUrls: ['./admin-user-add.component.css']
})
export class AdminUserAddComponent implements OnInit {
  user;
  globalSettings;
  globals = environment;

  pageTitle = "User"
  pageSlug = "user"
  user_id;
  imageUrl;
  newRecordByAdmin = {
    name: '',
    email: '',
    password: '',
    confirm_password: '',
    image: '',
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
      newFormData.append("password", formData.password)
      newFormData.append("confirm_password", formData.confirm_password)
      if (this.imageUrl) { newFormData.append('image', this.imageUrl); }
      this.ngxService.start();
      await this.myservices.adminApiCall(this.pageSlug +"/create", newFormData).then((response) => {
        this.ngxService.stop();
        if (response.status == 1) {
          this.router.navigate(['/admin/' + this.pageSlug]);
          this.toastr.success(response.message);
        } else {
          this.toastr.error(response.message);
        }
      });
    } else {
      return false;
    }
  }
}
