import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { GlobalService } from "../global.service";
import { Location } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-thanks-register',
  templateUrl: './thanks-register.component.html',
  styleUrls: ['./thanks-register.component.css']
})
export class ThanksRegisterComponent implements OnInit {

  email = null;
  lastScreen = null;
  constructor(private route: Router, public global: GlobalService, public location: Location, private router: ActivatedRoute,private ngxService: NgxUiLoaderService) { 
    this.global.hideNavBars=true; 
    let me = this;
     this.router.paramMap.subscribe(params => {
      console.log(params.get("id"),atob(params.get("id")));
      let str=(atob(params.get("id"))).split(":");
      console.log(str)
      me.email=str[1]
      me.lastScreen=str[0]
    });
    


    }

  ngOnInit() {
		  if(this.lastScreen && this.lastScreen!='register'){
		  this.goToHome();
		  }
  }

  navigate(){
    let user:any = localStorage.getItem(btoa("user-kc")) ? localStorage.getItem(btoa("user-kc")) : null;
    user = user  ? JSON.parse(user) : null;
    let AuthToken = localStorage.getItem(btoa("AuthToken-kc")) ? localStorage.getItem(btoa("AuthToken-kc")) : null;
    if (user) {
      this.global.user = user;
      this.global.AuthToken = AuthToken;
      this.global.isLogin = true;
      this.global.loginTime=new Date()
    }
    if(this.global.user && this.global.isLogin){
      if(!this.global.user.profile_setup && this.global.user.role==3){
        let num = this.global.user.current_step ? this.global.user.current_step:1;
        this.route.navigate(['/user/freelancer/set-up/'+num])
     } else{
         this.route.navigate(["user"],{ replaceUrl: true });
     }
    } else {
      this.global.showToast("Please check your mail for verification link");
    }
  //this.route.navigate(["user/verify-otp/"+btoa("register:"+this.email)],{replaceUrl:true})
  }

  goToHome(){
   this.route.navigate(["user/home/"],{replaceUrl:true})
  }

}
