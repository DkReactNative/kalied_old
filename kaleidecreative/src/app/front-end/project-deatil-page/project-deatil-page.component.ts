import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { GlobalService } from "../global.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { paymentType, freelancerType } from "../../app.global";
@Component({
  selector: "app-project-deatil-page",
  templateUrl: "./project-deatil-page.component.html",
  styleUrls: ["./project-deatil-page.component.css"],
})
export class ProjectDeatilPageComponent implements OnInit {
  paymentType = paymentType;
  freelancerType = freelancerType;
  projectId;
  projectInformation;
  constructor(
    private route: Router,
    public global: GlobalService,
    private ngxService: NgxUiLoaderService,
    private router: ActivatedRoute
  ) {
    this.router.paramMap.subscribe((params) => {
      let str = params.get("id") ? atob(params.get("id")) : "";
      if (str) {
        this.projectId = str;
        this.getProjectInfo();
      }
    });
  }
  ngOnInit() {}
  getProjectInfo() {
    this.ngxService.start();
    this.global.get(
      this.global.user
        ? "work/project-info/" + this.projectId
        : "work-auth/project-info/" + this.projectId,
      (data) => {
        this.ngxService.stop();
        console.log(data);
        if (data.status) {
          this.projectInformation = data.response;
        } else {
          this.global.showDangerToast("", data.message);
        }
      },
      (err) => {
        this.ngxService.stop();
        this.global.showDangerToast("", err.message);
      },
      true
    );
  }

  getMultipleNameByValue(arr) {
    if (arr.length == 0) return "NA";
    arr = arr.map((ele) => ele.name);
    arr = arr.join(", ");
    return arr;
  }
}
