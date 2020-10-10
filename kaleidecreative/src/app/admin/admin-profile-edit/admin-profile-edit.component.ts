import { Component, OnInit } from '@angular/core';
import { MyservicesService } from "../../myservices.service";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
//import {environment} from '../../../environments/environment';
import { globals } from '../../app.global';
declare var $: any;
import * as jQuery from 'jquery';
@Component({
  selector: 'app-admin-profile-edit',
  templateUrl: './admin-profile-edit.component.html',
  styleUrls: ['./admin-profile-edit.component.css']
})
export class AdminProfileEditComponent implements OnInit {
  user; globalSettings;
  globals = globals;
  profileUpdateUser = {
		name: '',
		email: '',
    image: '',
  }
  passwordUpdateUser = {
		old_password: '',
		password: '',
		confirm_password: ''
  }
  constructor(
    private router: Router,
		private myservices: MyservicesService,
    private toastr: ToastrService,
    private ngxService: NgxUiLoaderService
  ) {
  }

  ngOnInit() {
    this.disabledEmojiSpace()
    this.myservices.checkAdminLogin();
    this.user = JSON.parse(localStorage.getItem('CFadminuserData'));    
    this.globalSettings = JSON.parse(localStorage.getItem('CFglobalSettings'));
    this.profileUpdateUser = {
      name: this.user.name,
      email: this.user.email,
      image: this.user.image,
    }
  }

  imageUrl;
  uploadFile(event) {
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      this.imageUrl = <File>event.target.files[0];
    }
  }

  update_profile = async (formData) => {
    const newformData = new FormData();
    newformData.append('user_id', atob(localStorage.getItem("CFadminuser")));
    newformData.append('name', formData.name);
    if (this.imageUrl){ newformData.append('profile_image', this.imageUrl); }
    this.ngxService.start();
    await this.myservices.post("admin/update_profile",newformData,response =>{
      this.ngxService.stop();
      if(response.status == 1){
        this.toastr.success(response.message);
        localStorage.setItem("CFadminuserData",JSON.stringify(response.response))
        this.user = response.response;
      }else{
        this.toastr.error(response.message);
      }
    },err =>{},true)
	}

  change_password = async (form) => {
    var formData = form.value
		if(formData.password == formData.confirm_password){
      const newformData = new FormData();
      newformData.append('user_id', atob(localStorage.getItem("CFadminuser")));
      newformData.append('old_password', formData.old_password);
      newformData.append('password', formData.password);
      newformData.append('confirm_password', formData.confirm_password);
      formData.user_id = atob(localStorage.getItem("CFadminuser"));
      this.ngxService.start();
			await this.myservices.post("admin/update_password",newformData,response =>{
        this.ngxService.stop();
        if(response.status == 1){
          // this.passwordUpdateUser = { old_password: '', password: '', confirm_password: '' }
          form.resetForm();
          this.toastr.success(response.message);
        }else{
          this.toastr.error(response.message);
        }
      },err =>{},true)
		}
	}
  disabledEmojiSpace(){
          $(document).ready(function(){

           var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
         
             
             var invalid = new RegExp(regex);
             // on keyup
             $('input').on("keyup", (e)=> {
               var response = invalid.test(e.target.value) ? "invalid" : "valid";
              
               e.target.value = e.target.value.replace(invalid, "");
               let value = e.target.value;
                        
                         value = value.trim();
                         if(!value){
                          e.target.value=value;
                          e.preventDefault()
                         }
             });

              $('textarea').on("keyup", (e)=> {
               var response = invalid.test(e.target.value) ? "invalid" : "valid";
              
               e.target.value = e.target.value.replace(invalid, "");
               let value = e.target.value;
                        
                         value = value.trim();
                         if(!value){
                          e.target.value=value;
                          e.preventDefault()
                         }
             });

            // on keydown
             $('input').on("keydown", (e)=> {
               var response = invalid.test(e.target.value) ? "invalid" : "valid";
               
               e.target.value = e.target.value.replace(invalid, "");
               let value = e.target.value;
               if(e.which==32 || value=='on'){
                        
                         value =value.trim();
                         if(!value){
                          e.target.value=value;
                          e.preventDefault()
                         }
                       
                       }
                
             });

             $('textarea').on("keydown", (e)=> {
               var response = invalid.test(e.target.value) ? "invalid" : "valid";
               
               e.target.value = e.target.value.replace(invalid, "");
               let value = e.target.value;
               if(e.which==32 || value=='on'){
                        
                         value =value.trim();
                         if(!value){
                          e.target.value=value;
                          e.preventDefault()
                         }
                       
                       }
                
             });

             // on paste
             $('input').on("paste", (e)=> {
               var response = invalid.test(e.target.value) ? "invalid" : "valid";
                
                console.log("paste:", response,e);
                e.target.value = e.target.value.replace(invalid, "");
                let clipboardData = e.originalEvent.clipboardData.getData('text');

                console.log(clipboardData)

                if(invalid.test(clipboardData)){ 

                e.preventDefault()
                
                }
               
             });

             $('textarea').on("paste", (e)=> {
               var response = invalid.test(e.target.value) ? "invalid" : "valid";
                
                console.log("paste:", response,e);
                e.target.value = e.target.value.replace(invalid, "");
                let clipboardData = e.originalEvent.clipboardData.getData('text');

                console.log(clipboardData)

                if(invalid.test(clipboardData)){ 

                e.preventDefault()
                
                }
               
             });

             

             // on blur
             $('textarea').on("blur", (e)=> {
               var response = invalid.test(e.target.value) ? "invalid" : "valid";
               
               e.target.value = e.target.value.replace(invalid, "");
             });

             $('input').on("blur", (e)=> {
               var response = invalid.test(e.target.value) ? "invalid" : "valid";
               
               e.target.value = e.target.value.replace(invalid, "");
             });
            });
       }

}
