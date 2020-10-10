import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone,
  ViewEncapsulation,
  TemplateRef,
} from "@angular/core";
import { GlobalService } from "../../global.service";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { MapsAPILoader, MouseEvent } from "@agm/core";
import { Http, Headers, RequestOptions } from "@angular/http";
import "rxjs/add/operator/map";
import { Options, LabelType } from "ng5-slider";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { DomSanitizer } from "@angular/platform-browser";
declare var $: any;
@Component({
  selector: "app-hidden-tab",
  templateUrl: "./hidden-tab.component.html",
  styleUrls: ["./hidden-tab.component.css"],
})
export class HiddenTabComponent implements OnInit {
  modalRef: BsModalRef;
  profileModalRef: BsModalRef;
  list: any = null;
  keyword: any = null;
  userList: any = [];
  pageArray: any = null;
  primarySkill: any = [];
  secondarySkill: any = [];
  editingStyle: any = [];
  graphicSpecialties: any = [];
  awards: any = [];
  projectType: [];
  genereType: [];
  industryType: [];
  selectedPortfolio: any = null;
  portFolioFilterOption: any = {
    projectType: "",
    industryType: "",
    genereType: "",
  };
  originalSelectedUser = [];
  experience_level: any = [
    { value: 1, name: "Entry level" },
    { value: 1, name: "Intermediate" },
    { value: 1, name: "Expert" },
  ];
  selectedUser: any = null;
  formBody: any = {};

  constructor(
    private route: Router,
    private router: ActivatedRoute,
    public global: GlobalService,
    public http: Http,
    private ngxService: NgxUiLoaderService,
    private sanitizer: DomSanitizer,
    public modalService: BsModalService
  ) {
    if (!this.global.user || this.global.user.role != 2) {
      this.route.navigate(["/user/login"]);
    }
  }

  ngOnInit() {
    this.getFolderTabs(1);
    this.disabledEmojiSpace();

    setTimeout(() => {
      $("input[name='keyword']").on("blur", () => {
        this.getFolderTabs(1);
      });
    }, 2000);

    this.getProfileContent();

    $(document).ready(() => {
      this.applyCarousel();
    });

    $(document).ready(() => {
      $("#profile-video-close").on("click", (evt) => {
        console.log("Profile closed");
        //this.getFolderTabs();
      });
      $("#video-module-close").on("click", (evt) => {
        console.log("video-module closed");
        var src = $("#v1").attr("src");
        $("#v1").attr("src", "");
        $("#v1").attr("src", src);
      });
    }, 2000);
  }

  getFolderTabs(page) {
    let newFormData = new FormData();
    if (this.keyword) newFormData.append("keyword", this.keyword);

    if (page) newFormData.append("page", page);

    newFormData.append("user_id", this.global.user._id);
    this.ngxService.start();
    this.global.post(
      "findfreelancer/hidenList",
      newFormData,
      (data) => {
        this.ngxService.stop();
        console.log(data);
        if (data.status) {
          this.userList = data.response;
          this.applyCarousel();
          this.pageArray = Array.from(
            { length: this.userList.totalPages },
            (v, k) => k + 1
          );
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

  getGenereIndustryTypes(id) {
    this.ngxService.start();
    this.global.get(
      this.global.user
        ? "profileContent/industry-genre-all/" + id
        : "profileContent-auth/industry-genre-all/" + id,
      (data) => {
        this.ngxService.stop();
        console.log(data);
        if (data.status) {
          let user = data.response;

          this.genereType = user.genereType;

          this.industryType = user.industryType;
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

  getProfileContent() {
    this.ngxService.start();
    this.global.get(
      "profileContent/allContent",
      (data) => {
        this.ngxService.stop();
        console.log(data);
        if (data.status) {
          let user = data.response;

          this.primarySkill = user.primarySkills;

          this.secondarySkill = user.secondarySkills;

          this.editingStyle = user.editingStyle;

          this.graphicSpecialties = user.graphicSpecalities;

          this.awards = user.awards;

          this.projectType = user.projectType;

          this.genereType = user.genereType;

          this.industryType = user.industryType;
        } else {
          //this.global.showDangerToast("", data.message);
        }
      },
      (err) => {
        this.ngxService.stop();
        this.global.showDangerToast("", err.message);
      },
      true
    );
  }
  applyCarousel() {
    setTimeout(() => {
      $(".Portfolio-slider-carousel").owlCarousel({
        loop: true,
        nav: true,
        dot: true,
        responsive: {
          0: {
            items: 1,
          },
          600: {
            items: 1,
          },
          1000: {
            items: 1,
          },
        },
      });
    }, 2000);
  }
  OpenModal(
    template: TemplateRef<any>,
    user = null,
    portfolio = null,
    css = ""
  ) {
    console.log("called");
    if (user) {
      this.selectedUser = user;
      this.originalSelectedUser = user.portfolios;
    }
    if (portfolio) {
      this.selectedPortfolio = this.getVimeoId(portfolio.video_url);
    }
    const config = {
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: false,
      class: css,
    };
    if (css == "model-dialog2") {
      this.profileModalRef = this.modalService.show(template, config);
    } else {
      this.modalRef = this.modalService.show(template, config);
    }
  }
  changePortFoliFilter(e, key) {
    if (key == "projectType") {
      this.portFolioFilterOption.projectType = e.target.value;
      this.portFolioFilterOption.industryType = "";
      this.portFolioFilterOption.genereType = "";
      this.genereType = [];
      this.industryType = [];
      if (e.target.value) this.getGenereIndustryTypes(e.target.value);
    } else {
      if (key == "industryType") {
        this.portFolioFilterOption.industryType = e.target.value;
      }
      if (key == "genereType") {
        this.portFolioFilterOption.genereType = e.target.value;
      }
    }
    this.filterPortFolio();
  }

  filterPortFolio() {
    let array = this.selectedUser.portfolios.filter((ele) => {
      if (this.portFolioFilterOption.projectType != "") {
        if (
          this.portFolioFilterOption.industryType == "" &&
          this.portFolioFilterOption.genereType == ""
        ) {
          if (ele.project_type == this.portFolioFilterOption.projectType)
            return ele;
        } else if (
          this.portFolioFilterOption.industryType != "" &&
          this.portFolioFilterOption.genereType == ""
        ) {
          if (
            ele.project_type == this.portFolioFilterOption.projectType &&
            ele.industry == this.portFolioFilterOption.industryType
          )
            return ele;
        } else if (
          this.portFolioFilterOption.industryType == "" &&
          this.portFolioFilterOption.genereType != ""
        ) {
          if (
            ele.project_type == this.portFolioFilterOption.projectType &&
            ele.genre == this.portFolioFilterOption.genereType
          )
            return ele;
        } else {
          if (
            ele.project_type == this.portFolioFilterOption.projectType &&
            ele.genre == this.portFolioFilterOption.genereType &&
            ele.industry == this.portFolioFilterOption.industryType
          )
            return ele;
        }
      } else {
        return ele;
      }
    });
    this.originalSelectedUser = array;
  }

  getVimeoId(url) {
    if (!url) return;
    var match = url.match(/^.+vimeo.com\/(.*\/)?([^#\?]*)/);
    url = "https://player.vimeo.com/video/";
    return match
      ? this.sanitizer.bypassSecurityTrustResourceUrl(url + match[2]) ||
          this.sanitizer.bypassSecurityTrustResourceUrl(url + match[1])
      : null;
  }

  tranformPatClient(client = []) {
    let clientName: any = [];
    client.filter((ele) => {
      if (ele.client_name) clientName.push(ele.client_name);
    });
    clientName = clientName.join(", ");
    return clientName;
  }

  getImages(arr = []) {
    return arr[0] ? arr[0].images : [];
  }

  getNameByValue(arr, id) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].value == id) {
        return arr[i].name;
        break;
      }
    }
    return "NA";
  }

  getMultipleNameByValue(arr, skills) {
    let arraySkills: any = [];
    for (let i = 0; i < arr.length; i++) {
      if (skills.indexOf(arr[i].value) != -1) {
        arraySkills.push(arr[i].name);
      }
    }
    if (arraySkills.length == 0) return "NA";
    arraySkills = arraySkills.join(", ");
    return arraySkills;
  }

  availabilityName(value) {
    if (value == 1) return "Weekdays";
    if (value == 2) return "Evenings";
    if (value == 3) return "Weekends";
    return "NA";
  }

  unHideFreelancer(id) {
    if (confirm("Are you sure to remove the freelancer from list!")) {
      let newFormData = new FormData();
      newFormData.append("user_id", this.global.user._id);

      if (id) {
        newFormData.append("freelancer_id", id);
      } else {
        alert("Please select a user to unhide");
      }

      this.ngxService.start();
      this.global.post(
        "findfreelancer/hiddenListRemove",
        newFormData,
        (data) => {
          this.ngxService.stop();
          console.log(data);
          if (data.status) {
            $("#profile-video-close").trigger("click");
            this.global.showToast("", data.message);
            this.getFolderTabs(this.userList.currentPage);
          } else {
            alert(data.message);
          }
        },
        (err) => {
          this.ngxService.stop();
          alert(err.message);
        },
        true
      );
    }
  }

  openAddNoteModel() {
    if (
      this.selectedUser &&
      this.selectedUser.freelancer_note &&
      this.selectedUser.freelancer_note[0] &&
      this.selectedUser.freelancer_note[0].note
    ) {
      this.formBody.freelancer_note = this.selectedUser.freelancer_note[0].note;
    }
  }

  addNoteToFavourite(formdata) {
    let newFormData = new FormData();
    newFormData.append("user_id", this.global.user._id);

    if (this.formBody.freelancer_note) {
      newFormData.append("note", this.formBody.freelancer_note);
    } else {
      alert("Please insert note about freelancer.");
      return;
    }

    if (this.selectedUser._id) {
      newFormData.append("freelancer_id", this.selectedUser.freelancer_id);
    } else {
      alert("Please select a user to add note.");
      return;
    }
    this.ngxService.start();
    this.global.post(
      "findfreelancer/addNote",
      newFormData,
      (data) => {
        this.ngxService.stop();
        console.log(data);
        if (data.status) {
          this.getFolderTabs(
            this.userList.currentPage ? this.userList.currentPage : 1
          );
          alert(data.message);
          $("#add-note-close").trigger("click");
        } else {
          alert(data.message);
        }
      },
      (err) => {
        this.ngxService.stop();
        alert(err.message);
      },
      true
    );
  }

  copyLink() {
    $("#profile-video-close").trigger("click");
    $("#copy-click").trigger("click");
  }

  copyToClipboard(text = "") {
    text =
      this.global.websiteUrl +
      "user/freelancer-profile/" +
      this.selectedUser._id;
    var input = document.createElement("input");
    input.setAttribute("value", text);
    document.body.appendChild(input);
    input.select();
    var result = document.execCommand("copy");
    document.body.removeChild(input);
    setTimeout(() => {
      $("#model-open-copy" + this.selectedUser._id).trigger("click");
    }, 200);
    if (result) {
      this.global.showToast("Profile link copied");
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
  modifiyName(fName, lName) {
    let name = fName.charAt(0).toUpperCase() + fName.slice(1);
    if (lName) {
      name = name + " " + lName.charAt(0).toUpperCase() + ".";
    }
    return name;
  }

  modifyAddressName(city, state) {
    let name = city ? city + ", " : "";
    if (city.length > 10) {
      name = city.slice(0, 7) + "..., ";
    }
    if (state) {
      name += state;
    }
    return name;
  }
}
