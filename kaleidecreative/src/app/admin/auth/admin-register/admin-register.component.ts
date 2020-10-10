import { Component, OnInit } from '@angular/core';
import { MyservicesService } from "../../../myservices.service";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
import {environment} from '../../../../environments/environment';

@Component({
	selector: 'app-admin-register',
	templateUrl: './admin-register.component.html',
	styleUrls: ['./admin-register.component.css']
})
export class AdminRegisterComponent implements OnInit {
	registerUser = {
		name:'',
		email: '',
		password: '',
		confirm_password: ''
	}
	constructor(
		private router: Router,
		private myservices: MyservicesService,
    private toastr: ToastrService,
    private ngxService: NgxUiLoaderService
	) {
    this.myservices.checkAdminLogout();
  }

	ngOnInit() {
	}

	submit = async (formData) => {
		if(formData.password == formData.confirm_password){
      this.ngxService.start();
			var response = await this.myservices.adminApiCall("register",formData).then((response) => {
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
