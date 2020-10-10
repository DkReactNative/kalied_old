import { Component, OnInit } from '@angular/core';
import { MyservicesService } from "../../../myservices.service";
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
import {environment} from '../../../../environments/environment';


@Component({
  selector: 'app-admin-password-reset',
  templateUrl: './admin-password-reset.component.html',
  styleUrls: ['./admin-password-reset.component.css']
})
export class AdminPasswordResetComponent implements OnInit {
  resetUser = {
		password: '',
		confirm_password: ''
  }
  slug;
  user_id;
  otp;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
		private myservices: MyservicesService,
    private toastr: ToastrService,
    private ngxService: NgxUiLoaderService
  ) {
    if(this.route.snapshot.queryParams){      
      this.slug = this.route.snapshot.params.slug;      
      this.slug = atob(this.slug).split(":");
      if(this.slug instanceof Array){
        this.user_id = this.slug[0];
        this.otp = this.slug[1];
        this.checkData();
      }else{
        this.toastr.error("Wrong Url!!");
        this.router.navigate(['/admin/login'])
      }
    }else{
      this.toastr.error("Wrong Url!!");
      this.router.navigate(['/admin/login'])
    }
    this.myservices.checkAdminLogout();
  }

  ngOnInit() {
  }

  checkData = async () => {    
    var newFormData = new FormData();
    newFormData.append("user_id",this.user_id)
    newFormData.append("otp",this.otp)
    await this.myservices.adminApiCall("verifyOTP",newFormData).then((response) => {      
      this.ngxService.stop();
      if(response.status == 1){}else{
        this.toastr.error("Invalid Url");
        this.router.navigate(['/admin/login']);
      }
    },(error) => {      
      this.toastr.error("Invalid Url");
      this.router.navigate(['/admin/login']);
    });
  }

  submit = async (formData) => {
		if(formData.password == formData.confirm_password){
      var newFormData = new FormData();
      newFormData.append("user_id",this.user_id)
      newFormData.append("password",formData.password)
      newFormData.append("confirm_password",formData.confirm_password)
      this.ngxService.start();
			await this.myservices.adminApiCall("reset_password",newFormData).then((response) => {
        this.ngxService.stop();
        if(response.status == 1){
          this.toastr.success(response.message);
          this.router.navigate(['/admin/login']);
        }else{
          this.toastr.error(response.message);
        }
      });
		}
	}
}
