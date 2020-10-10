import { Component, OnInit } from "@angular/core";
import { GlobalService } from "../../global.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { Router } from "@angular/router";
import * as moment from "moment";
import { projectstatus } from "../../../../app/app.global";
declare var $: any;
@Component({
  selector: "app-client-my-project",
  templateUrl: "./client-my-project.component.html",
  styleUrls: ["./client-my-project.component.css"],
})
export class ClientMyProjectComponent implements OnInit {
  projectstatus = projectstatus;
  formData: any = [];
  currentPage: any = 1;
  totalPages: any = 0;
  records: any = [];
  constructor(
    private route: Router,
    public global: GlobalService,
    private ngxService: NgxUiLoaderService
  ) {}
  ngOnInit() {
    this.filterList(1);
  }

  onCheckboxChange(e, flag = false) {
    if (e.target.checked) {
      if (!flag) {
        this.formData.push(+e.target.value);
      } else {
        this.formData.push(...e.target.value.split(",").map((ele) => +ele));
      }
    } else {
      if (flag) {
        this.formData = this.formData.filter((ele) => ele != 3 && ele != 4);
      } else {
        this.formData = this.formData.filter((ele) => ele != e.target.value);
      }
    }
    this.filterList(1);
  }

  onClickAll(e) {
    if (e.target.checked) {
      this.formData.push(...e.target.value.split(",").map((ele) => +ele));
      console.log(e.target.value, this.formData);
    } else {
      console.log(this.formData);
      this.formData = [];
    }
    this.filterList(1);
  }

  checkStatus(key, flag = false) {
    if (!flag && this.formData.includes(+key)) {
      return true;
    } else if (
      flag &&
      (this.formData.includes(3) || this.formData.includes(4))
    ) {
      return true;
    }
    return false;
  }

  filterList(page = 1) {
    let newFormData = new FormData();
    newFormData.append("page", page + "");
    newFormData.append("categories", JSON.stringify(this.formData));
    console.log(JSON.stringify(newFormData));
    this.ngxService.start();
    this.global.post(
      "project/myProject-client/",
      newFormData,
      (data) => {
        this.ngxService.stop();
        console.log(data);
        3;
        if (data.status) {
          this.records = data.response;
          this.currentPage = data.response.currentPage;
          this.totalPages = data.response.totalPages;
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
  Btoa(id) {
    return btoa(id);
  }
}
