import { Component, OnInit } from "@angular/core";
import { GlobalService } from "../../global.service";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import "lodash";
declare var _: any;
import * as moment from "moment";
declare var $: any;
import { paymentType, freelancerType } from "../../../app.global";

@Component({
  selector: "app-step-five",
  templateUrl: "./step-five.component.html",
  styleUrls: ["./step-five.component.css"],
})
export class ProjectStepFiveComponent implements OnInit {
  paymentType = paymentType;
  freelancerType = freelancerType;
  projectId;
  projectInformation;
  allSkills: any = [];
  inviteFreelancers: any = [];
  formBody: any = [];
  inviteeMessage: any =
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum";

  constructor(
    private route: Router,
    public global: GlobalService,
    private router: ActivatedRoute,
    private ngxService: NgxUiLoaderService
  ) {
    this.router.paramMap.subscribe((params) => {
      console.log(params.get("id"), atob(params.get("id")));
      let str = params.get("id") ? atob(params.get("id")) : "";
      console.log(str);
      this.projectId = str;
    });
  }

  ngOnInit() {
    this.getProjectInfo();
    this.getInviteFreelancerList();
    this.disabledEmojiSpace();
  }

  getProjectInfo() {
    this.ngxService.start();
    this.global.get(
      "project/" + this.projectId,
      (data) => {
        this.ngxService.stop();
        console.log(data);
        if (data.status) {
          let response = data.response;
          this.projectInformation = response;
          if (response.current_step == 5) {
            if (response.project_setup) {
              this.InvitedFreelancerList();
            }
          } else if (response.project_setup == 0 && response.current_step < 5) {
            this.route.navigate(
              [
                "/user/project/create" +
                response.current_step +
                "/" +
                btoa(this.projectId),
              ],
              {
                replaceUrl: true,
              }
            );
          } else {
            this.route.navigate(["/user"], {
              replaceUrl: true,
            });
          }
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

  postProject() {
    let newFormData = new FormData();
    newFormData.append("project_id", this.projectId);
    newFormData.append("invited_freelancer", JSON.stringify(this.formBody));
    newFormData.append("message", this.inviteeMessage);

    this.ngxService.start();
    this.global.post(
      "project/post-project",
      newFormData,
      (data) => {
        this.ngxService.stop();
        console.log(data);
        if (data.status) {
          if (data.response.status == 1) {
            this.global.showToast("", data.message);
            this.route.navigate(["/user/project/create1"], {
              replaceUrl: true,
            });
          } else if (data.response.status == 2) {
            this.route.navigate(
              [
                "/user/project/create1" +
                "/" +
                btoa(data.response.current_step),
              ],
              {
                replaceUrl: true,
              }
            );
          } else if (data.response.status == 3) {
            this.global.showDangerToast("", data.message);
          } else {
            this.global.showDangerToast("", data.message);
          }
        } else {
          this.global.showDangerToast("", data.message);
          let message = "";
          data.response.map((ele) => {
            message += Object.values(ele) + ". ";
          });
          this.global.showDangerToast("", message);
          console.log(data.message);
        }
      },
      (err) => {
        this.ngxService.stop();
        this.global.showDangerToast("", err.message);
      },
      true
    );
  }

  getInviteFreelancerList() {
    this.ngxService.start();
    this.global.post(
      "project/favourite-freelancer",
      "",
      (data) => {
        this.ngxService.stop();
        console.log(data);
        if (data.status) {
          this.inviteFreelancers = data.response;
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

  InvitedFreelancerList() {
    let newFormData = new FormData();
    newFormData.append("project_id", this.projectId);
    this.ngxService.start();
    this.global.post(
      "project/invited-freelancer",
      newFormData,
      (data) => {
        this.ngxService.stop();
        console.log(data);
        if (data.status) {
          this.formBody = data.response.map((ele) => ele.freelancer_id);
          this.inviteeMessage = data.response[0]
            ? data.response[0].message
            : "";
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

  insertFreelancer(id) {
    if (this.formBody.includes(id)) {
      this.formBody = this.formBody.filter((ele) => {
        if (ele != id) {
          return ele;
        }
      });
    } else {
      this.formBody.push(id);
    }
  }

  disabledEmojiSpace() {
    $(document).ready(function () {
      var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;

      var invalid = new RegExp(regex);
      // on keyup
      $("input").on("keyup", (e) => {
        var response = invalid.test(e.target.value) ? "invalid" : "valid";

        e.target.value = e.target.value.replace(invalid, "");
        let value = e.target.value;

        value = value.trim();
        if (!value) {
          e.target.value = value;
          e.preventDefault();
        }
      });

      $("textarea").on("keyup", (e) => {
        var response = invalid.test(e.target.value) ? "invalid" : "valid";

        e.target.value = e.target.value.replace(invalid, "");
        let value = e.target.value;

        value = value.trim();
        if (!value) {
          e.target.value = value;
          e.preventDefault();
        }
      });

      // on keydown
      $("input").on("keydown", (e) => {
        var response = invalid.test(e.target.value) ? "invalid" : "valid";

        e.target.value = e.target.value.replace(invalid, "");
        let value = e.target.value;
        if (e.which == 32 || value == "on") {
          value = value.trim();
          if (!value) {
            e.target.value = value;
            e.preventDefault();
          }
        }
      });

      $("textarea").on("keydown", (e) => {
        var response = invalid.test(e.target.value) ? "invalid" : "valid";

        e.target.value = e.target.value.replace(invalid, "");
        let value = e.target.value;
        if (e.which == 32 || value == "on") {
          value = value.trim();
          if (!value) {
            e.target.value = value;
            e.preventDefault();
          }
        }
      });

      // on paste
      $("input").on("paste", (e) => {
        var response = invalid.test(e.target.value) ? "invalid" : "valid";

        console.log("paste:", response, e);
        e.target.value = e.target.value.replace(invalid, "");
        let clipboardData = e.originalEvent.clipboardData.getData("text");

        console.log(clipboardData);

        if (invalid.test(clipboardData)) {
          e.preventDefault();
        }
      });

      $("textarea").on("paste", (e) => {
        var response = invalid.test(e.target.value) ? "invalid" : "valid";

        console.log("paste:", response, e);
        e.target.value = e.target.value.replace(invalid, "");
        let clipboardData = e.originalEvent.clipboardData.getData("text");

        console.log(clipboardData);

        if (invalid.test(clipboardData)) {
          e.preventDefault();
        }
      });

      // on blur
      $("textarea").on("blur", (e) => {
        var response = invalid.test(e.target.value) ? "invalid" : "valid";

        e.target.value = e.target.value.replace(invalid, "");
      });

      $("input").on("blur", (e) => {
        var response = invalid.test(e.target.value) ? "invalid" : "valid";

        e.target.value = e.target.value.replace(invalid, "");
      });
    });
  }
}
