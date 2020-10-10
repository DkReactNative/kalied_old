import { Component, OnInit, Input } from "@angular/core";
import { GlobalService } from "../../global.service";
import { Router } from "@angular/router";
@Component({
  selector: "app-profile-side-menu",
  templateUrl: "./profile-side-menu.component.html",
  styleUrls: ["./profile-side-menu.component.css"],
})
export class ProfileSideMenuComponent implements OnInit {
  @Input() user;
  @Input() active;
  constructor(private route: Router, public global: GlobalService) { }

  ngOnInit() { }

  logout() {
    localStorage.removeItem(btoa("AuthToken"));
    localStorage.removeItem(btoa("user-kc"));
    this.global.isLogin = false;
    this.global.AuthToken = null;
    this.global.user = null;
    this.route.navigate(["/user/login"], { replaceUrl: true });
  }
}
