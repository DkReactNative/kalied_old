import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone,
  ViewEncapsulation,
} from "@angular/core";

import { GlobalService } from "../../global.service";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: "app-hidden-folder",
  templateUrl: "./hidden-folder.component.html",
  styleUrls: ["./hidden-folder.component.css"],
})
export class FavouriteFolderComponent implements OnInit {
  folderList: any = null;
  keyword: any = "";
  pageArray: any = [];
  constructor(
    private ngZone: NgZone,
    private route: Router,
    private router: ActivatedRoute,
    public global: GlobalService,
    private ngxService: NgxUiLoaderService
  ) {
    if (!this.global.user || this.global.user.role != 2) {
      this.route.navigate(["/user/login"]);
    }
  }

  ngOnInit() {
    this.getFolderTabs();
    setTimeout(() => {
      $("input[name='keyword']").on("blur", () => {
        this.getFolderTabs();
      });
    }, 2000);
  }

  getFolderTabs() {
    let newFormData = new FormData();
    if (this.keyword) newFormData.append("keyword", this.keyword);

    newFormData.append("user_id", this.global.user._id);
    this.ngxService.start();
    this.global.post(
      "findfreelancer/favouriteTabList",
      newFormData,
      (data) => {
        this.ngxService.stop();
        console.log(data);
        if (data.status) {
          this.folderList = data.response;
          // this.pageArray = Array.from({ length: this.folderList.totalPages }, (v, k) => k + 1);
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

  navigate(list) {
    this.route.navigate([
      "/user/client/favourite-user/" +
        btoa(JSON.stringify({ id: list._id, name: list.name })),
    ]);
  }
}
