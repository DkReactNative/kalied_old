import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";
import { GlobalService } from "../global.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
declare var $: any;
import * as jQuery from "jquery";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  formData;
  disabledBtn = 0;
  formSubmitAttempt = false;
  rememberme: any = false;

  constructor(
    private route: Router,
    public global: GlobalService,
    private formBuilder: FormBuilder,
    private ngxService: NgxUiLoaderService
  ) {
    this.global.hideNavBars = true;
    this.formData = this.formBuilder.group({
      email: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required),
    });
    let user = localStorage.getItem(btoa("user-kc"))
      ? localStorage.getItem(btoa("user-kc"))
      : null;
    user = JSON.parse(user);
    if (user) {
      this.route.navigate(["user"], { replaceUrl: true });
    }
  }

  ngOnInit() {
    this.formData.valueChanges.subscribe((data) =>
      console.log("form changes", data)
    );
    this.disabledEmojiSpace();

    let remember: any = localStorage.getItem(btoa("rememberme"))
      ? JSON.parse(atob(localStorage.getItem(btoa("rememberme"))))
      : null;
    if (remember) {
      this.rememberme = true;
      this.formData.get("email").setValue(remember.email);
      this.formData.get("password").setValue(remember.password);
    }
  }
  login(formdata) {
    console.log(this.rememberme);
    if (this.disabledBtn) {
      return;
    }
    this.disabledBtn = 1;
    this.formSubmitAttempt = true;
    if (!this.formData.valid) {
      console.log(this.formData);
      this.disabledBtn = 0;
      return;
    } else {
      let newFormData = new FormData();
      newFormData.append("email", formdata.email.toLowerCase());
      newFormData.append("password", formdata.password);
      this.ngxService.start();
      this.global.post(
        "login",
        newFormData,
        (data) => {
          this.ngxService.stop();
          this.disabledBtn = 0;
          console.log(data);
          if (data.status) {
            if (data.response.status && data.response.email_confirmed) {
              if (this.rememberme) {
                localStorage.setItem(
                  btoa("rememberme"),
                  btoa(
                    JSON.stringify({
                      email: formdata.email.toLowerCase(),
                      password: formdata.password,
                    })
                  )
                );
              } else {
                localStorage.removeItem(btoa("rememberme"));
              }

              localStorage.setItem(
                btoa("user-kc"),
                JSON.stringify(data.response)
              );
              localStorage.setItem("setupTime-kc", this.global.setupTime + "");
              this.global.user = data.response;
              this.global.isLogin = true;
              localStorage.setItem(btoa("AuthToken-kc"), data.response.token);
              this.global.AuthToken = data.response.token;
              this.global.showToast("", data.message);
              if (
                !this.global.user.profile_setup &&
                this.global.user.role == 3
              ) {
                let num = this.global.user.current_step
                  ? this.global.user.current_step
                  : 0;
                this.route.navigate(["/user/freelancer/set-up/" + num]);
              } else {
                let path =
                  this.global.user.role == 3
                    ? "freelancer"
                    : this.global.user.role == 2
                      ? "client"
                      : "";
                this.route.navigate(["/user/" + path], { replaceUrl: true });
              }
            } else {
              this.global.showToast("", data.message);
              //this.route.navigate(["user/verify-otp/"+btoa("login:"+data.response.email)])
            }
          } else {
            this.global.showDangerToast("", data.message);
          }
        },
        (err) => {
          this.disabledBtn = 0;
          this.global.showDangerToast("", err.message);
        },
        true
      );
    }
  }
  goToHome() {
    this.route.navigate(["user/home/"], { replaceUrl: true });
  }

  disabledEmojiSpace() {
    var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;

    var invalid = new RegExp(regex);
    // on keyup
    $("input").on("keyup", (e) => {
      var response = invalid.test(e.target.value) ? "invalid" : "valid";

      e.target.value = e.target.value.replace(invalid, "");
      let value = e.target.value;

      value = value.trim();
      if (!value) {
        e.target.value = value;
        e.preventDefault();
      }
    });

    // on keydown
    $("input").on("keydown", (e) => {
      var response = invalid.test(e.target.value) ? "invalid" : "valid";

      e.target.value = e.target.value.replace(invalid, "");
      let value = e.target.value;
      if (e.which == 32 || value == "on") {
        value = value.trim();
        if (!value) {
          e.target.value = value;
          e.preventDefault();
        }
      }
    });

    // on paste
    $("input").on("paste", (e) => {
      var response = invalid.test(e.target.value) ? "invalid" : "valid";

      console.log("paste:", response, e);
      e.target.value = e.target.value.replace(invalid, "");
      let clipboardData = e.originalEvent.clipboardData.getData("text");

      console.log(clipboardData);

      if (invalid.test(clipboardData)) {
        e.preventDefault();
      }
    });

    // on blur
    $("input").on("blur", (e) => {
      var response = invalid.test(e.target.value) ? "invalid" : "valid";

      e.target.value = e.target.value.replace(invalid, "");
    });
  }
}
