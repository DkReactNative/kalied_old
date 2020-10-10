import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { GlobalService } from "../../global.service";
import { Router, ActivatedRoute } from "@angular/router";
@Component({
  selector: "app-project-side-bar",
  templateUrl: "./project-side-bar.component.html",
  styleUrls: ["./project-side-bar.component.css"],
})
export class ProjectSideBarComponent implements OnInit {
  @Input() projectId: any = "";

  constructor(
    private route: Router,
    public global: GlobalService,
    private router: ActivatedRoute
  ) {}

  ngOnInit() {}

  ngOnChanges() {
    console.log("projectId => ", this.projectId);
  }
  checkActiveRoute(word) {
    var url = window.location.href;
    if (url.includes(word)) {
      return "active";
    }
    return "";
  }
}
