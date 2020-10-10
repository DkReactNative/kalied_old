import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MyservicesService } from "../../../myservices.service";
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-user-edit',
  templateUrl: './admin-user-edit.component.html',
  styleUrls: ['./admin-user-edit.component.css']
})
export class AdminUserEditComponent implements OnInit {
  user;
  globalSettings;
  globals = environment;

  pageTitle = "User"
  pageSlug = "user"
  user_id;
  imageUrl;
  data;
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
    this.user_id = this.route.snapshot.params.userId;
    this.user = JSON.parse(localStorage.getItem('CFadminuserData'));
    this.globalSettings = JSON.parse(localStorage.getItem('CFglobalSettings'));
  }

  async ngOnInit() {
    this.myservices.checkAdminLogin();
    if (this.user_id) {
      let formData = new FormData();
      formData.append("user_id", this.user_id);
      await this.myservices.adminApiCall(this.pageSlug + "/view", formData).then((response) => {
        console.log(response);
        this.data = response.response;
        this.newRecordByAdmin = response.response.records;
        this.newRecordByAdmin.password = "";
      });
    }
  }

  uploadFile(event) {
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      this.imageUrl = <File>event.target.files[0];
    }
  }

  newRecordSubmit = async (formData) => {
    var newFormData = new FormData();
    newFormData.append("user_id", this.user_id)
    newFormData.append("name", formData.name)
    newFormData.append("email", formData.email)
    newFormData.append("password", formData.password)
    newFormData.append("confirm_password", formData.confirm_password)
    if (this.imageUrl) { newFormData.append('image', this.imageUrl); }
    this.ngxService.start();
    await this.myservices.adminApiCall(this.pageSlug + "/update", newFormData).then((response) => {
      this.ngxService.stop();
      if (response.status == 1) {
        this.router.navigate(['/admin/' + this.pageSlug]);
        this.toastr.success(response.message);
      } else {
        this.toastr.error(response.message);
      }
    });
  }
}
