import { Component, OnInit, Input } from "@angular/core";
import { GlobalService } from "../../global.service";
import { Router } from "@angular/router";
@Component({
  selector: "app-freelancer-side-menu",
  templateUrl: "./freelancer-side-menu.component.html",
  styleUrls: ["./freelancer-side-menu.component.css"],
})
export class FreelancerSideMenuComponent implements OnInit {
  @Input() user;
  constructor(private route: Router, public global: GlobalService) {}
  active: any;
  ngOnInit() {
    var url = window.location.href;
    console.log(url);
    if (url.includes("profile")) {
      this.active = true;
    } else {
      this.active = false;
    }
  }

  logout() {
    localStorage.removeItem(btoa("AuthToken"));
    localStorage.removeItem(btoa("user-kc"));
    this.global.isLogin = false;
    this.global.AuthToken = null;
    this.global.user = null;
    this.route.navigate(["/user/login"], { replaceUrl: true });
  }
}
