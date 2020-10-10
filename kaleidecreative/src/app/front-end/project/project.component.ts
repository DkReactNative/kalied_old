import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { GlobalService } from "../global.service";
@Component({
  selector: "app-project",
  templateUrl: "./project.component.html",
  styleUrls: ["./project.component.css"],
})
export class ProjectComponent implements OnInit {
  constructor(private route: Router, public global: GlobalService) {
    this.global.hideNavBars = false;
    let user: any = localStorage.getItem(btoa("user-kc"))
      ? localStorage.getItem(btoa("user-kc"))
      : null;
    user = user ? JSON.parse(user) : null;
    if (!user || user.role != 2) {
      this.route.navigate(["/user"], { replaceUrl: true });
    }
  }

  ngOnInit() {}
}
