import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { GlobalService } from "../global.service";
import { Location } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';
declare var $: any;
import * as jQuery from 'jquery';
@Component({
  selector: 'app-verif-otp',
  templateUrl: './verif-otp.component.html',
  styleUrls: ['./verif-otp.component.css']
})
export class VerifOtpComponent implements OnInit {
  @ViewChild("input1", { static: true }) input1: ElementRef;
  @ViewChild("input2", { static: true }) input2: ElementRef;
  @ViewChild("input3", { static: true }) input3: ElementRef;
  @ViewChild("input4", { static: true }) input4: ElementRef;
  input;
  email = null;
  lastScreen = null;
  formSubmitAttempt = false;

  constructor(private route: Router, public global: GlobalService, public location: Location, private router: ActivatedRoute,private ngxService: NgxUiLoaderService) { 
    this.global.hideNavBars=true;
    this.input = new Array(4);
    let me=this;
    this.router.paramMap.subscribe(params => {
      console.log(params.get("id"),atob(params.get("id")));
      let str=(atob(params.get("id"))).split(":");
      console.log(str)
      me.email=str[1]
      me.lastScreen=str[0]
    });
  }

  ngOnInit() {
  }

  getCodeBoxElement(index) {
    switch (index) {
      case 1:
        return this.input1.nativeElement;
      case 2:
        return this.input2.nativeElement;
      case 3:
        return this.input3.nativeElement;
      case 4:
        return this.input4.nativeElement;
      default:
        return null;
    }
    
  }

  keypress(event) {
    const eventCode = event.which || event.keyCode;
    if (
      eventCode != 46 &&
      eventCode > 31 &&
      (
        (eventCode < 48 || eventCode > 57) || (eventCode >= 96 && eventCode <= 105))
    ) {
      event.preventDefault();
    }
  }

  onKeyUpEvent(event, index) {
    console.log(event);
    const eventCode = event.which || event.keyCode;
    if (
      eventCode != 46 &&
      eventCode > 31 && (
        (eventCode < 48 || eventCode > 57) || (eventCode >= 96 && eventCode <= 105))
    ) {
    } else {
      if (this.getCodeBoxElement(index).value.length === 1) {
        if (index !== 4) {
          this.getCodeBoxElement(index + 1).focus();
        } else {
          this.getCodeBoxElement(index).blur();
          this.verifyOtp();
          console.log("submit code ");
        }
      }
      if (eventCode === 8 && index !== 1) {
        this.getCodeBoxElement(index - 1).focus();
      }
    }
  }

  onFocusEvent(index) {
    for (let item = 1; item < index; item++) {
      const currentElement = this.getCodeBoxElement(item);
      if (!currentElement.value) {
        currentElement.focus();
        break;
      }
    }
  }

  verifyOtp() {
    console.log("this.lastScreen",this.lastScreen)
    this.formSubmitAttempt = true;
    if (!this.input[0] || !this.input[1] || !this.input[2] || !this.input[3]) {
      return;
    } else {
      let newFormData = new FormData();
      newFormData.append("otp",this.input.join(""))
      newFormData.append("email", this.email)
      this.ngxService.start(); 
      this.global.post(
        "verifyOtp",
        newFormData,
        data => {
          this.ngxService.stop(); 
          console.log(data);
            if (data.status) { 
              if (this.lastScreen == "register") {
                localStorage.setItem(btoa("user-kc"), JSON.stringify(data.response));
                localStorage.setItem("setupTime-kc", this.global.setupTime + "")
                this.global.user = data.response;
                this.global.isLogin = true;
                this.global.AuthToken = data.response.token;
                localStorage.setItem(btoa("AuthToken-kc"), data.response.token);
                this.global.showToast("", data.message);
                if(!this.global.user.profile_setup && this.global.user.role==3){
                    let num = this.global.user.current_step ? this.global.user.current_step:1;
                    this.route.navigate(['/user/freelancer/set-up/'])
                 } else{
                     let path = this.global.user.role == 3 ? 'freelancer': this.global.user.role == 2 ? 'client':""
                     this.route.navigate(["/user/"+path], { replaceUrl: true });
                 }
                  
              } else if (this.lastScreen == "forgot") {
                this.global.showToast("", data.message);
                this.route.navigate(["user/reset-password/"+btoa(data.response._id)],{ replaceUrl: true })
              } 
             else if (this.lastScreen == "login") {
                localStorage.setItem(btoa("user-kc"), JSON.stringify(data.response));
                localStorage.setItem("setupTime-kc", this.global.setupTime + "")
                this.global.user = data.response;
                this.global.isLogin = true;
                localStorage.setItem(btoa("AuthToken-kc"), data.response.token);
                this.global.AuthToken = data.response.token;
                 if(!this.global.user.profile_setup && this.global.user.role==3){
                    let num = this.global.user.current_step ? this.global.user.current_step:1;
                    this.route.navigate(['/user/freelancer/set-up/'+num])
                 } else{
                     this.route.navigate(["user"],{ replaceUrl: true });
                 }
                  
              }
            } else {
              this.formSubmitAttempt = false;
              this.input = [];
              this.input = new Array(4);
              this.global.showDangerToast(
                "",
               data.message
              );
              this.input1.nativeElement.focus();
            }
        },
        err => {
          this.input = [];
          this.input = new Array(4);
          this.global.showDangerToast("", err.message);
        },
        true
      );
    }
  }

  resendOtp() {
    this.formSubmitAttempt = false;
    let body = {};
    let newFormData = new FormData();
    newFormData.append("email", this.email)
    this.ngxService.start();
    this.global.post(
      "resendOtp",
      newFormData,
      data => {
      this.ngxService.stop();
        console.log(data);
        if (data.statuscode === 400) {
          this.global.showDangerToast(data.message);
        } else {
          if (data.status) {
            this.global.showToast("", data.message);
            this.input = [];
            this.input = new Array(4);
          } else {
            this.global.showDangerToast(
              "",
              data.message
            );
          }
        }
      },
      err => {
       this.ngxService.stop();
        this.global.showDangerToast("", err.message);
      },
      true
    );
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
