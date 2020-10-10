import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from "@angular/router";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from "@angular/forms";
import {
  PasswordValidation,
  RepeatPasswordValidator
} from "../validator.service";
import { GlobalService } from '../global.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
declare var $: any;
import * as jQuery from 'jquery';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  email = null;
  formSubmitAttempt = false;
  formData;
  userId=null
  constructor(
    private route: Router,
    public global: GlobalService,
    private formBuilder: FormBuilder,
    private ngxService: NgxUiLoaderService,
    public router: ActivatedRoute
  ) {
    this.global.hideNavBars=true
    this.formData = this.formBuilder.group(
      {
        password: new FormControl("", PasswordValidation),
        confirmPassword: new FormControl("", PasswordValidation)
      },
      { validator: RepeatPasswordValidator }
    );
    let user = localStorage.getItem(btoa("user-kc")) ? atob(localStorage.getItem(btoa("user-kc"))) : null;
    user = JSON.parse(user);
    if (user) {
      this.route.navigate(["user"], { replaceUrl: true });    
    }
    this.router.paramMap.subscribe(params => {
      console.log(params.get("id"),atob(params.get("id")));
      let str=(atob(params.get("id")))
      console.log(str)
       this.userId=str;
    });
    if (this.global.routeParams &&
      this.global.routeParams["email"] &&
      this.global.routeParams["email"] != {}
    ) {
      this.email = this.global.routeParams["email"];
    } else {
      // this.route.navigate(["/"]);
    }
  }

  ngOnInit() {
         this.disabledEmojiSpace()
  }

  submit(formdata) {
    this.formSubmitAttempt = true;
    if (!this.formData.valid) {
      console.log(this.formData);
      return;
    } else {
      let newFormData = new FormData();
      newFormData.append("user_id",this.userId)
      newFormData.append("password",formdata.password)
    this.ngxService.start(); 
      this.global.post(
        "reset-password",
        newFormData,
        data => {
          this.ngxService.stop();
          console.log(data);
          if (data.status) {
            if (data.status) {
              this.global.showToast("",data.message);
              this.route.navigate(["user/login"],{replaceUrl:true})
            } else {
              this.global.showDangerToast(
                "",
                data.message
              );
            }
          } else {
            this.global.showDangerToast(
              "",
              data.message
            );
          }
        },
        err => {
          this.global.showDangerToast("", err.message);
        },
        true
      );
    }
  }
  goToHome(){
   this.route.navigate(["user/home/"],{replaceUrl:true})
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

