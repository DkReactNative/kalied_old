import { Component, OnInit } from "@angular/core";
import { GlobalService } from "../global.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  constructor(private route: Router, public global: GlobalService) {}

  ngOnInit() {}
  logout() {
    localStorage.removeItem(btoa("AuthToken"));
    localStorage.removeItem(btoa("user-kc"));
    this.global.isLogin = false;
    this.global.AuthToken = null;
    this.global.user = null;
    this.route.navigate(["user/login"]);
  }

  goToMyProfile() {
    if (this.global.user.role == 3) {
      if (!this.global.user.profile_setup) {
        let num = this.global.user.current_step
          ? this.global.user.current_step
          : 0;
        this.route.navigate(["/user/freelancer/set-up/" + num]);
      } else {
        this.route.navigate(["/user/freelancer/profile"]);
      }
    } else if (this.global.user.role == 2) {
      this.route.navigate(["/user/client/profile"]);
    }
  }
}
