import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { GlobalService } from "../global.service";
import { Location } from "@angular/common";
import { NgxUiLoaderService } from "ngx-ui-loader";
declare var $: any;
import * as jQuery from "jquery";
@Component({
  selector: "app-verify-link",
  templateUrl: "./verify-link.component.html",
  styleUrls: ["./verify-link.component.css"],
})
export class VerifyLinkComponent implements OnInit {
  email = null;
  token = null;
  formSubmitAttempt = false;

  constructor(
    private route: Router,
    public global: GlobalService,
    public location: Location,
    private router: ActivatedRoute,
    private ngxService: NgxUiLoaderService
  ) {
    this.global.hideNavBars = true;
    let me = this;
    this.router.paramMap.subscribe((params) => {
      console.log(params.get("id"), atob(params.get("id")));
      let str = atob(params.get("id")).split(":");
      console.log(str);
      me.email = str[0];
      me.token = str[1];
    });
  }

  ngOnInit() {
    this.verifyOtp();
  }

  verifyOtp() {
    let newFormData = new FormData();
    newFormData.append("token", this.token);
    newFormData.append("email", this.email);
    this.ngxService.start();
    this.global.post(
      "verifyOtp",
      newFormData,
      (data) => {
        this.ngxService.stop();
        console.log(data);
        if (data.status) {
          this.global.showToast("", data.message);
          localStorage.setItem(btoa("user-kc"), JSON.stringify(data.response));
          localStorage.setItem("setupTime-kc", this.global.setupTime + "");
          this.global.user = data.response;
          this.global.isLogin = true;
          localStorage.setItem(btoa("AuthToken-kc"), data.response.token);
          this.global.AuthToken = data.response.token;
          if (!this.global.user.profile_setup && this.global.user.role == 3) {
            let num = this.global.user.current_step
              ? this.global.user.current_step
              : 0;
            this.route.navigate(["/user/freelancer/set-up/" + num]);
          } else {
            this.route.navigate(["user"], { replaceUrl: true });
          }
        } else {
          this.formSubmitAttempt = false;
          this.global.showDangerToast("", data.message);
          this.route.navigate(["user"], { replaceUrl: true });
        }
      },
      (err) => {
        this.global.showDangerToast("", err.message);
        this.route.navigate(["user"], { replaceUrl: true });
      },
      true
    );
  }
}
