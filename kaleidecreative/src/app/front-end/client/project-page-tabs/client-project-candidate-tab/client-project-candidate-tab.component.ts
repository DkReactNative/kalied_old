import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { GlobalService } from "../../../global.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
@Component({
  selector: "app-client-project-candidate-tab",
  templateUrl: "./client-project-candidate-tab.component.html",
  styleUrls: ["./client-project-candidate-tab.component.css"],
})
export class ClientProjectCandidateTabComponent implements OnInit {
  projectId;
  projectInfo;
  constructor(
    private route: Router,
    public global: GlobalService,
    private router: ActivatedRoute,
    private ngxService: NgxUiLoaderService
  ) {
    this.router.paramMap.subscribe((params) => {
      let str = params.get("id") ? atob(params.get("id")) : "";
      if (str) {
        this.projectId = str;
      }
    });
  }

  ngOnInit() {}
}
