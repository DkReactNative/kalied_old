import { Component, OnInit, TemplateRef } from "@angular/core";
import { GlobalService } from "../../global.service";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { Http, Headers, RequestOptions } from "@angular/http";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { DomSanitizer } from "@angular/platform-browser";

import "rxjs/add/operator/map";

declare var $: any;
@Component({
  selector: "app-favourite-user",
  templateUrl: "./favourite-user.component.html",
  styleUrls: ["./favourite-user.component.css"],
})
export class FavouriteUserComponent implements OnInit {
  profileModalRef: BsModalRef;
  modalRef: BsModalRef;
  list: any = null;
  keyword: any = null;
  userList: any = {};
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
    private sanitizer: DomSanitizer,
    public modalService: BsModalService,
    private ngxService: NgxUiLoaderService
  ) {
    this.list = atob(this.router.snapshot.params.id)
      ? JSON.parse(atob(this.router.snapshot.params.id))
      : null;
    console.log(this.list);
  }

  ngOnInit() {
    if (!this.global.user || this.global.user.role != 2) {
      this.route.navigate(["/user/login"]);
    }
    this.getFolderTabs(1);
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

    if (this.list.id) newFormData.append("list_id", this.list.id);

    if (page) newFormData.append("page", page);

    newFormData.append("user_id", this.global.user._id);
    this.ngxService.start();
    this.global.post(
      "findfreelancer/favourateUser",
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

  confirmRemove(id) {
    if (confirm("Are you sure to remove the freelancer from list!")) {
      this.removeFromList(id, false);
    }
  }

  removeFromList(id, completeDelete = false) {
    let newFormData = new FormData();
    newFormData.append("user_id", this.global.user._id);

    if (id) {
      newFormData.append("freelancer_id", id);
    } else {
      alert("Please select a user to unhide");
    }

    if (this.list) {
      newFormData.append("list_id", this.list.id);
    }

    if (completeDelete)
      newFormData.append("completeDelete", completeDelete ? "1" : "0");

    this.ngxService.start();
    this.global.post(
      "findfreelancer/favourateRemoveUser",
      newFormData,
      (data) => {
        this.ngxService.stop();
        console.log(data);
        if (data.status) {
          $("#profile-video-close").trigger("click");
          this.global.showToast("", data.message);
          this.getFolderTabs(this.userList.currentPage);
          if (this.modalRef) this.modalRef.hide();
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

  hideFreelancer(id) {
    if (
      confirm(
        "Are you sure to add freelancer in hidden list and remove from your favourite list!"
      )
    ) {
      let newFormData = new FormData();
      newFormData.append("user_id", this.global.user._id);

      if (id) newFormData.append("freelancer_id", id);

      if (this.list) {
        newFormData.append("list_id", this.list.id);
      }

      this.ngxService.start();
      this.global.post(
        "findfreelancer/hiddenListAdd",
        newFormData,
        (data) => {
          this.ngxService.stop();
          console.log(data);
          if (data.status) {
            $("#profile-video-close").trigger("click");
            this.global.showToast("", data.message);
            this.removeFromList(id, true);
            if (this.modalRef) this.modalRef.hide();
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

  // close model by ID
  closeModel(closeId) {
    $("#" + closeId).trigger("click");
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

  openAddNoteModel() {
    if (!this.global.user || this.global.user.role != 2) {
      this.route.navigate(["/user/login"]);
    }
    if (
      this.selectedUser &&
      this.selectedUser.freelancer_note &&
      this.selectedUser.freelancer_note[0] &&
      this.selectedUser.freelancer_note[0].note
    ) {
      this.formBody.freelancer_note = this.selectedUser.freelancer_note[0].note;
    }
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

  copyLink() {
    $("#profile-video-close").trigger("click");
    $("#copy-click").trigger("click");
  }

  addNoteToFavourite(formdata) {
    if (!this.global.user || this.global.user.role != 2) {
      this.closeModel("add-note-close");
      this.route.navigate(["/user/login"]);
    }
    let newFormData = new FormData();
    newFormData.append("user_id", this.global.user._id);

    if (this.formBody.freelancer_note) {
      newFormData.append("note", this.formBody.freelancer_note);
    } else {
      alert("Please insert note about freelancer.");
      return;
    }

    if (this.selectedUser._id) {
      newFormData.append("freelancer_id", this.selectedUser._id);
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
          alert(data.message);
          this.modalRef.hide();
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
