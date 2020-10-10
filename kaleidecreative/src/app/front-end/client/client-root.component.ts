import { Component, OnInit, Input } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { GlobalService } from "../global.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
@Component({
  selector: "app-client-root",
  templateUrl: "./client-root.component.html",
  styleUrls: ["./client-root.component.css"],
})
export class ClientRootComponent implements OnInit {
  @Input() user;
  @Input() active;
  constructor(
    private route: Router,
    public global: GlobalService,
    private ngxService: NgxUiLoaderService
  ) {
    this.global.hideNavBars = false;
    let user: any = localStorage.getItem(btoa("user-kc"))
      ? localStorage.getItem(btoa("user-kc"))
      : null;
    user = user ? JSON.parse(user) : null;
    var url = window.location.href;
    console.log(url);
    if ((!user || user.role != 2) && !url.includes("find-freelancers")) {
      this.route.navigate(["/user"], { replaceUrl: true });
    }
  }

  ngOnInit() {
    console.log("client");
  }
}
