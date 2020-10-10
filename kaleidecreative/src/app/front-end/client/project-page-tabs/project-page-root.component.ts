import { Component, OnInit } from "@angular/core";
import { GlobalService } from "../../global.service";
import { Router, ActivatedRoute } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
@Component({
  selector: "app-project-page-root",
  templateUrl: "./project-page-root.component.html",
  styleUrls: ["./project-page-root.component.css"],
})
export class ProjectPageRootComponent implements OnInit {
  projectId;
  projectInfo;
  constructor(
    private route: Router,
    public global: GlobalService,
    private router: ActivatedRoute
  ) {
    this.global.hideNavBars = false;
    let user: any = localStorage.getItem(btoa("user-kc"))
      ? localStorage.getItem(btoa("user-kc"))
      : null;
    user = user ? JSON.parse(user) : null;
    var url = window.location.href;
    console.log(url);
    if (!user || user.role != 2) {
      this.route.navigate(["/user"], { replaceUrl: true });
    }
    url = url.split("/").pop();
    if (url) {
      this.projectId = atob(url);
      this.getProjectInfo();
    }
  }

  ngOnInit() {}

  getProjectInfo() {
    this.global.get(
      "project/" + this.projectId,
      (data) => {
        console.log(data);
        if (data.status) {
          this.projectInfo = data.response;
        } else {
          this.global.showDangerToast("", data.message);
        }
      },
      (err) => {
        this.global.showDangerToast("", err.message);
      },
      true
    );
  }

  Btoa(id) {
    return btoa(id);
  }
}
