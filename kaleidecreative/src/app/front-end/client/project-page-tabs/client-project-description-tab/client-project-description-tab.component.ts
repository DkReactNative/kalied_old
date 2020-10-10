import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { GlobalService } from "../../../global.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { paymentType, freelancerType } from "./../../../../app.global";
@Component({
  selector: "app-client-project-description-tab",
  templateUrl: "./client-project-description-tab.component.html",
  styleUrls: ["./client-project-description-tab.component.css"],
})
export class ClientProjectDescriptionTabComponent implements OnInit {
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

  ngOnInit() { }

  getProjectInfo() {
    this.ngxService.start();
    this.global.get(
      "project/" + this.projectId,
      (data) => {
        this.ngxService.stop();
        console.log(data);
        if (data.status) {
          // console.log("data : ", data);
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

  Btoa(id) {
    return btoa(id);
  }
}
