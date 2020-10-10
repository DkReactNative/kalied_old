import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-project-page-tabs",
  templateUrl: "./project-page-tabs.component.html",
  styleUrls: ["./project-page-tabs.component.css"],
})
export class ProjectPageTabsComponent implements OnInit {
  projectId;
  window = window;
  constructor(
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.paramMap.subscribe((params) => {
      let str = params.get("id") ? atob(params.get("id")) : "";
      if (str) {
        this.projectId = str;
      }
    });
  }

  ngOnInit() { }

  Btoa(id) {
    return btoa(id);
  }
}
