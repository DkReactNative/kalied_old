import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone,
  ViewEncapsulation,
  TemplateRef,
} from "@angular/core";
import { GlobalService } from "../global.service";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { MapsAPILoader, MouseEvent } from "@agm/core";
import { Http, Headers, RequestOptions } from "@angular/http";
import "rxjs/add/operator/map";
import { Options, LabelType } from "ng5-slider";
import { ClipboardService } from "ngx-clipboard";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { DomSanitizer } from "@angular/platform-browser";

declare var $: any;

@Component({
  selector: "app-freelancer-profile",
  templateUrl: "./freelancer-profile.component.html",
  styleUrls: ["./freelancer-profile.component.css"],
})
export class FreelancerProfileComponent implements OnInit {
  @ViewChild("search", { static: false }) searchElementRef: ElementRef;
  modalRef: BsModalRef;
  freelancerId: any;
  copyText: string = "";
  isCopied: boolean;
  mySubscription: any;
  favouriteFolder: any = [];
  selectedUser: any = false;
  primarySkill: any = [];
  secondarySkill: any = [];
  editingStyle: any = [];
  graphicSpecialties: any = [];
  awards: any = [];
  projectType: [];
  genereType: [];
  industryType: [];
  experience_level: any = [
    { value: 1, name: "Entry level" },
    { value: 1, name: "Intermediate" },
    { value: 1, name: "Expert" },
  ];
  selectedPortfolio: any = null;
  portFolioFilterOption: any = {
    projectType: "",
    industryType: "",
    genereType: "",
  };
  originalSelectedUser = [];

  formBody: any = {};

  records: any = [];

  constructor(
    private route: Router,
    private router: ActivatedRoute,
    public global: GlobalService,
    public http: Http,
    private ngxService: NgxUiLoaderService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService
  ) {
    this.freelancerId = this.router.snapshot.params.id;
    this.global.hideNavBars = false;
    this.getUserInfo();
  }

  ngOnInit() {
    this.getProfileContent();
    //this.getPastClients();
    this.getFolderTabs();

    $(document).ready(() => {
      this.applyCarousel();
    });

    setTimeout(() => {
      console.log(this.searchElementRef); // back here through ViewChild set
      //this.mapsAPILoaderFunction();

      $(document).ready(() => {
        $("#profile-video-close").on("click", (evt) => {
          console.log("Profile closed");
          //this.getFolderTabs();
          this.formBody = {};
        });

        $("#add-favorites-close").on("click", (evt) => {
          console.log("add-favorites closed");
          //this.getFolderTabs();
          this.formBody = {};
        });

        $("#video-module-close").on("click", (evt) => {
          console.log("video-module closed");
          var src = $("#v1").attr("src");
          $("#v1").attr("src", "");
          $("#v1").attr("src", src);
        });
      }, 2000);
    });
  }

  getProfileContent() {
    this.ngxService.start();
    this.global.get(
      "profileContent-auth/allContent",
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

  getUserInfo() {
    let newFormData = new FormData();
    if (this.global.user && this.global.user._id)
      newFormData.append("user_id", this.global.user._id);

    newFormData.append("id", this.freelancerId);

    this.ngxService.start();
    this.global.post(
      "findfreelancer-auth/freelancer-profile",
      newFormData,
      (data) => {
        this.ngxService.stop();
        console.log(data);
        if (data.status) {
          this.records = data.response;
          this.selectedUser = this.records.records[0];
          this.originalSelectedUser = this.records.records[0].portfolios;
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

  getFolderTabs() {
    let newFormData = new FormData();
    newFormData.append("user_id", this.global.user._id);
    this.ngxService.start();
    this.global.post(
      "findfreelancer/favouriteTabList",
      newFormData,
      (data) => {
        this.ngxService.stop();
        console.log(data);
        if (data.status) {
          this.favouriteFolder = data.response;
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

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
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

  hideFreelancer(id) {
    if (!this.global.isLogin || !this.global.user) {
      this.route.navigate(["/user/login"]);
      return;
    }
    if (confirm("Are you sure to remove the freelancer from list!")) {
      let newFormData = new FormData();
      newFormData.append("user_id", this.global.user._id);

      if (id) newFormData.append("freelancer_id", id);

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
            // this.filterList(this.records.currentPage)
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

  // close existing model and open new model
  openModal(closeId, openId) {
    if (!this.global.isLogin || !this.global.user) {
      this.route.navigate(["/user/login"]);
      return;
    }
    $("#" + closeId).trigger("click");
    $("#" + openId).trigger("click");
  }

  addFavoutiteFolder(formdata) {
    let newFormData = new FormData();
    newFormData.append("user_id", this.global.user._id);

    if (this.formBody.image) {
      newFormData.append("image", this.formBody.image);
    } else {
      alert("Please upload a image.");
      return;
    }

    if (this.formBody.title) newFormData.append("name", this.formBody.title);

    this.ngxService.start();
    this.global.post(
      "findfreelancer/favourateListAdd",
      newFormData,
      (data) => {
        this.ngxService.stop();
        console.log(data);
        if (data.status) {
          if (this.favouriteFolder && this.favouriteFolder.length == 0) {
            this.formBody.list_id = data.response._id;
          }
          this.getFolderTabs();
          this.formBody["title"] = "";
          this.formBody["name"] = "";
          this.formBody["image"] = "";
          this.formBody["profile-image"] = "";

          alert(data.message);
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

  openAddNoteModel() {
    if (!this.global.isLogin || !this.global.user) {
      this.route.navigate(["/user/login"]);
      return;
    }
    //this.openModal("profile-video-close", "open-add-note-model");
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

  addFreelancerToFavourite(formdata) {
    let newFormData = new FormData();
    newFormData.append("user_id", this.global.user._id);

    if (this.formBody.notes) {
      newFormData.append("notes", this.formBody.notes);
    } else {
      alert("Please insert a note about freelancer");
      return;
    }

    if (this.formBody.listId) {
      newFormData.append("list_id", this.formBody.listId);
    } else {
      alert("Please choose a list to add freelancer. ");
      return;
    }

    if (this.selectedUser && this.selectedUser._id) {
      newFormData.append("freelancer_id", this.selectedUser._id);
    } else {
      alert("Please select a freelancer to add in list.");
      return;
    }

    this.ngxService.start();
    this.global.post(
      "findfreelancer/favourateAddUser",
      newFormData,
      (data) => {
        this.ngxService.stop();
        console.log(data);
        if (data.status) {
          // this.filterList();
          this.formBody["list_id"] = "";
          this.formBody["notes"] = "";
          $("#add-favorites-close").trigger("click");
          this.global.showToast("", data.message);
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

  uploadFile(event) {
    var input = event.target;
    console.log(event);
    var reader = new FileReader();
    reader.onload = () => {
      var dataURL: any = reader.result;
      document.getElementById("profile-image").setAttribute("src", dataURL);
      this.formBody["profileImage"] = dataURL;
      this.formBody["image"] = event.target.files[0];
    };
    reader.readAsDataURL(input.files[0]);
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
      $("#model-open-copy").trigger("click");
    }, 200);
    if (result) alert("Link copied. You can share it with others");
  }

  OpenModal(template: TemplateRef<any>, user = null, portfolio = null) {
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
      class: "model-dialog",
    };
    this.modalRef = this.modalService.show(template, config);
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
}
