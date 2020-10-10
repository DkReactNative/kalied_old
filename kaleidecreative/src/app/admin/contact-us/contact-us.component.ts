import { Component, OnInit } from '@angular/core';
import { MyservicesService } from "../../myservices.service";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
import {environment} from '../../../environments/environment';
declare var $: any;
import * as jQuery from 'jquery'
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {

  user; globalSettings;
  aboutUsUpdateForm :any= {
	title:"",
    title_descrition:"",
    get_in_touch:"",
    support: {
            email: [
                
            ],
            descrition: ""
        },
     customer: {
            phone: [
                
            ],
            descrition: ""
        },
        address: {
            address: [
                
            ],
            descrition: ""
        },    
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
    console.log(this.aboutUsUpdateForm) 
     this.get_about_us(); 
  }
  get_about_us = () => {
     this.myservices.get("admin/staticpage/contact-us",response =>{
      if(response.status == 1){
        this.aboutUsUpdateForm = response.response
      }
    },err =>{},true)
	}

  update_about_us = async (formData) => {
  console.log(formData,this.aboutUsUpdateForm)
    let newFormData = new FormData();
    newFormData.append("title",formData.title.trim());
    newFormData.append("title_descrition",formData.title_descrition);
    newFormData.append("get_in_touch",formData.get_in_touch);
    newFormData.append("support",JSON.stringify(this.aboutUsUpdateForm.support));
    newFormData.append("customer",JSON.stringify(this.aboutUsUpdateForm.customer));
    newFormData.append("address",JSON.stringify(this.aboutUsUpdateForm.address));
    if(this.aboutUsUpdateForm._id){
    newFormData.append("id",this.aboutUsUpdateForm._id);
    }
    this.ngxService.start();
    await this.myservices.post("admin/staticpage/contact-us",newFormData,response =>{
      if(response.status == 1){
        this.toastr.success(response.message);
        this.ngxService.stop();
      }else{
        this.toastr.error(response.message);
      }
    },err =>{},true)
	}

	addMore(key1,key2){
	if(this.aboutUsUpdateForm[key1] && this.aboutUsUpdateForm[key1][key2]){
	this.aboutUsUpdateForm[key1][key2].push("")
	} 
	}

	remove(i,key1,key2){
	if(this.aboutUsUpdateForm[key1] && this.aboutUsUpdateForm[key1][key2]){
	this.aboutUsUpdateForm[key1][key2].splice(i, 1);
	} 
	}
	trackByIndex(index: number, obj: any): any {
    return index;
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
               
               e.target.value = e.target.value.replace(invalid, "").trim();
             });
            });
       }
}
