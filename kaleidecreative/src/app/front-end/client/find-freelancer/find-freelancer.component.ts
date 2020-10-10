import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  TemplateRef,
  NgZone,
  ViewEncapsulation,
} from "@angular/core";
import { GlobalService } from "../../global.service";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { MapsAPILoader, MouseEvent } from "@agm/core";
import { Http, Headers, RequestOptions } from "@angular/http";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import "rxjs/add/operator/map";
import { Options, LabelType } from "ng5-slider";
import { ClipboardService } from "ngx-clipboard";

declare var $: any;
@Component({
  selector: "app-find-freelancer",
  templateUrl: "./find-freelancer.component.html",
  styleUrls: ["./find-freelancer.component.css"],
  // encapsulation: ViewEncapsulation.None
})
export class FindFreelancerComponent implements OnInit {
  @ViewChild("search", { static: false }) searchElementRef: ElementRef;
  isCopied: boolean;
  mySubscription: any;
  favouriteFolder: any = [];
  minValue: number = 0;
  selectedPortfolio: any = null;
  modalRef: BsModalRef;
  profileModalRef: BsModalRef;
  maxValue: number = 1000;
  selectedUser: any = {};
  portFolioFilterOption: any = {
    projectType: "",
    industryType: "",
    genereType: "",
  };
  originalSelectedUser = [];
  options: Options = {
    floor: 0,
    ceil: 10000,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return "<b>Min :</b> $ " + value;
        case LabelType.High:
          return "<b>Max :</b> $ " + value;
        default:
          return "$" + value;
      }
    },
  };

  ethnicityData = [
    { value: "1", name: "African American/Black" },
    { value: "2", name: "American Indian/Native American" },
    { value: "3", name: "Asian" },
    { value: "4", name: "Hispanic/Latino" },
    { value: "5", name: "White" },
  ];

  GenderData = [
    { value: 1, name: "Male" },
    { value: -1, name: "Female" },
  ];

  OrientationData = [
    { value: 1, name: "LGBTQ " },
    //{ value: -1, name: "No" },
  ];

  DisabilitiesData = [
    { value: 1, name: "ADA Disability" },
    //{ value: -1, name: "No" },
  ];

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  pageArray: any = [];
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

  formData: any = {
    user_id:
      this.global.user && this.global.user._id ? this.global.user._id : "",
    primarySkill: [],
    secondarySkill: [],
    graphic_speacialities: [],
    editing_style: [],
    awards: [],
    project_type: [],
    industry: [],
    genre: [],
    hourly_rate: [],
    experience_level: [],
    keyword: "",
    pastClient_id: [],
    pastClientName: [],
    address: "",
    city: "",
    ethnicity: [],
    gender: "",
    orientation: "",
    disabilities: "",
    freelancer_type: 1,
    page: 1,
  };

  formBody: any = {};

  records: any = [];

  constructor(
    private mapsAPILoader: MapsAPILoader,
    public modalService: BsModalService,
    private ngZone: NgZone,
    private route: Router,
    private router: ActivatedRoute,
    public global: GlobalService,
    public http: Http,
    private ngxService: NgxUiLoaderService,
    private _clipboardService: ClipboardService,
    private sanitizer: DomSanitizer
  ) {
    this.route.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.mySubscription = this.route.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.route.navigated = false;
      }
    });

    this.getProfileContent();

    this.getPastClients();

    this.getFolderTabs();

    this.formData.freelancer_type = +this.router.snapshot.params.id;
    console.log(this.formData);
  }

  ngOnInit() {
    this.filterList(1);
    this.disabledEmojiSpace();
    $(document).ready(() => {
      let that = this;
      this.applyCarousel();
      $("#geo-filter-input").on("input", function () {
        if ($(this).val() == "") {
          that.filterList(1);
        }
      });

      $("#search-filter-input").on("input", function () {
        if ($(this).val() == "") {
          that.filterList(1);
        }
      });
    });

    setTimeout(() => {
      console.log(this.searchElementRef); // back here through ViewChild set
      this.mapsAPILoaderFunction();

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

        $("input[name='keyword']").on("blur", () => {
          this.filterList(1);
        });
      }, 2000);
    });
    this.formData.freelancer_type = this.router.snapshot.params.id;
  }

  userChangeEnd(item: any) {
    console.log(item);
    setTimeout(() => {
      this.filterList(1);
    }, 300);
  }

  changeOption(e, key) {
    if (key == "project_type") {
      this.genereType = [];
      this.industryType = [];
      if (e.target.value) this.getGenereIndustryTypes(e.target.value);
      this.formData.industry = "";
      this.formData.genere = "";
    }
    if (
      ["gender", "orientation", "disabilities"].includes(key) &&
      !e.target.checked
    ) {
      this.formData[key] = "";
    } else {
      this.formData[key] = e.target.value;
    }

    setTimeout(() => {
      this.filterList(1);
    }, 300);
  }

  onCheckboxChange(e, key) {
    console.log("e --=-=-=-=-=-= : ", e);
    console.log("key ============= : ", key);
    if (e.target.checked) {
      this.formData[key].push(e.target.value);
    } else {
      let i: number = 0;
      this.formData[key].forEach((item) => {
        if (item + "" == e.target.value + "") {
          console.log(this.formData[key]);
          this.formData[key].splice(i, 1);
          return;
        }
        i++;
      });
    }
    setTimeout(() => {
      this.filterList(1);
    }, 300);
  }

  getProfileContent() {
    this.ngxService.start();
    this.global.get(
      this.global.user
        ? "profileContent/allContent"
        : "profileContent-auth/allContent",
      (data) => {
        this.ngxService.stop();
        console.log(data);
        if (data.status) {
          let user = data.response;

          this.primarySkill = user.primarySkills.filter((ele) => {
            if (ele.freelancer_type == this.formData.freelancer_type) {
              return ele;
            }
          });

          this.secondarySkill = user.secondarySkills.filter((ele) => {
            if (ele.freelancer_type == this.formData.freelancer_type) {
              return ele;
            }
          });

          this.editingStyle = user.editingStyle;

          this.graphicSpecialties = user.graphicSpecalities;

          this.awards = user.awards.filter((ele) => {
            if (ele.freelancer_type == this.formData.freelancer_type) {
              return ele;
            }
          });

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

  getPastClients() {
    this.ngxService.start();
    this.global.get(
      this.global.user
        ? "findfreelancer/past-clients"
        : "findfreelancer-auth/past-clients",
      (data) => {
        this.ngxService.stop();
        console.log(data);
        if (data.status) {
          let user = data.response;
          this.dropdownList = user;
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

  filterList(page = 1) {
    console.log(this.minValue, this.maxValue);
    this.formData.hourly_rate = [];
    this.formData.hourly_rate.push(...[this.minValue, this.maxValue]);
    let clientId: any = [];
    let clientName: any = [];

    this.selectedItems.filter((ele) => {
      if (ele.value) clientId.push(ele.value);
      if (ele.name) clientName.push(ele.name);
    });

    clientName = clientName.join("|");

    console.log(this.selectedItems);
    let newFormData = new FormData();
    if (this.formData.keyword)
      newFormData.append("keyword", this.formData.keyword.trim());

    if (this.formData.user_id)
      newFormData.append("user_id", this.formData.user_id);

    if (this.formData.primarySkill && this.formData.primarySkill.length > 0)
      newFormData.append(
        "primarySkill",
        JSON.stringify(this.formData.primarySkill)
      );

    if (this.formData.secondarySkill && this.formData.secondarySkill.length > 0)
      newFormData.append(
        "secondarySkill",
        JSON.stringify(this.formData.secondarySkill)
      );

    if (
      this.formData.graphic_speacialities &&
      this.formData.graphic_speacialities.length > 0
    )
      newFormData.append(
        "graphic_speacialities",
        JSON.stringify(this.formData.graphic_speacialities)
      );

    if (this.formData.editing_style && this.formData.editing_style.length > 0)
      newFormData.append(
        "editing_style",
        JSON.stringify(this.formData.editing_style)
      );

    if (this.formData.awards && this.formData.awards.length > 0)
      newFormData.append("awards", JSON.stringify(this.formData.awards));

    if (this.formData.project_type && this.formData.project_type != "")
      newFormData.append(
        "project_type",
        JSON.stringify([this.formData.project_type])
      );

    if (this.formData.industry && this.formData.industry != "")
      newFormData.append("industry", JSON.stringify([this.formData.industry]));

    if (this.formData.genre && this.formData.genre != "")
      newFormData.append("genre", JSON.stringify([this.formData.genre]));

    if (this.formData.hourly_rate && this.formData.hourly_rate.length > 0)
      newFormData.append(
        "hourly_rate",
        JSON.stringify(this.formData.hourly_rate)
      );

    if (
      this.formData.experience_level &&
      this.formData.experience_level.length > 0
    )
      newFormData.append(
        "experience_level",
        JSON.stringify(this.formData.experience_level)
      );

    if (clientId && clientId.length > 0)
      newFormData.append("pastClient_id", JSON.stringify(clientId));

    if (clientName && clientName.length > 0)
      newFormData.append("pastClientName", clientName);

    if (this.formData.longitude && this.formData.address)
      newFormData.append("longitude", this.formData.longitude);

    if (this.formData.latitude && this.formData.address)
      newFormData.append("latitude", this.formData.latitude);

    if (this.formData.ethnicity)
      newFormData.append("ethnicity", JSON.stringify(this.formData.ethnicity));

    if (this.formData.gender)
      newFormData.append("gender", this.formData.gender);

    if (this.formData.orientation)
      newFormData.append("orientation", this.formData.orientation);

    if (this.formData.disabilities)
      newFormData.append("disabilities", this.formData.disabilities);

    if (this.formData.freelancer_type)
      newFormData.append("freelancer_type", this.formData.freelancer_type);

    newFormData.append("page", page + "");
    this.records = {};
    this.ngxService.start();
    this.global.post(
      this.global.user ? "findfreelancer/" : "findfreelancer-auth/",
      newFormData,
      (data) => {
        this.ngxService.stop();
        if (data.status) {
          this.records = data.response;
          this.applyCarousel();
          this.pageArray = Array.from(
            { length: this.records.totalPages },
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

  changeFreelancerType(type) {
    if (this.formData.freelancer_type == type) {
      return;
    }

    this.formData = {
      user_id: this.global.user._id,
      primarySkill: [],
      secondarySkill: [],
      graphic_speacialities: [],
      editing_style: [],
      awards: [],
      project_type: [],
      industry: [],
      genre: [],
      hourly_rate: [],
      experience_level: [],
      keyword: "",
      pastClient_id: "",
      pastClientName: "",
      address: "",
      latitude: "",
      longitude: "",
      ethnicity: "",
      gender: -1,
      orientation: -1,
      disabilities: -1,
      freelancer_type: type,
      page: 1,
    };
    this.filterList(1);
  }

  mapsAPILoaderFunction() {
    var count = 0;
    var oldaddress: any = {
      address: this.formData.address,
      administrative_area_level_2: this.formData.city,
      administrative_area_level_1: "",
      country: "",
      postal_code: "",
      lat: "",
      long: "",
    };

    // $("input[name='address1']").on('blur', ()=> {
    //   // this.ngxService.stop();
    //   this.fillAddress(oldaddress)
    // });

    this.mapsAPILoader.load().then(() => {
      var input = this.searchElementRef.nativeElement;
      var options = {
        types: ["(cities)"],
      };
      let autocomplete = new google.maps.places.Autocomplete(input, options);
      this.ngZone.run(() => {
        google.maps.event.addListener(autocomplete, "place_changed", () => {
          var place = autocomplete.getPlace();
          // this.emptyAddress()
          oldaddress = {
            address: "",
            administrative_area_level_2: "",
            administrative_area_level_1: "",
            country: "",
            postal_code: "",
            lat: "",
            long: "",
          };
          console.log(place);
          var componentForm = {
            administrative_area_level_2: "long_name",
            administrative_area_level_1: "long_name",
            country: "long_name",
            postal_code: "short_name",
          };
          var val = {};
          for (var i = 0; i < place.address_components.length; i++) {
            var addressType = place.address_components[i].types[0];
            if (componentForm[addressType]) {
              oldaddress[addressType] =
                place.address_components[i][componentForm[addressType]];
            }
            //else{
            //   oldaddress[addressType]=""
            //  }
          }
          oldaddress["lat"] = place.geometry.location.lat();
          oldaddress["long"] = place.geometry.location.lng();
          oldaddress["address"] = place.formatted_address;
          this.fillAddress(oldaddress);
          // if(!count){
          //   $("input[name='address1']").focus();
          // }
          count++;
          $("input").blur();
          this.filterList(1);
        });
      });
    });
  }

  fillAddress(address) {
    console.log(address);
    this.formData.address = address.address;
    this.formData.longitude = address.long;
    this.formData.latitude = address.lat;
    $("input").blur();
  }

  reload(type) {
    if (type == this.formData.freelancer_type) {
      return;
    }
  }

  getFolderTabs() {
    if (!this.global.user) {
      return;
    }
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
    if (!this.global.user || this.global.user.role != 2) {
      this.modalRef.hide();
      this.profileModalRef.hide();
      this.route.navigate(["/user/login"]);
    }

    if (
      confirm("Are you sure you want to hidden the freelancer from the list")
    ) {
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
            this.filterList(this.records.currentPage);
            if (this.modalRef) this.modalRef.hide();
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
  }

  addFavoutiteFolder(formdata) {
    if (!this.global.user || this.global.user.role != 2) {
      this.modalRef.hide();
      this.profileModalRef.hide();
      this.route.navigate(["/user/login"]);
    }
    let newFormData = new FormData();
    newFormData.append("user_id", this.global.user._id);

    if (this.formBody.image) {
      newFormData.append("image", this.formBody.image);
    } else {
      this.global.showDangerToast("", "Please upload a image.");
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
          document.getElementById("profile-image").setAttribute("src", "");
          this.formBody["profileImage"] = null;
          $("#create-new").removeClass("show");
          this.global.showToast("", data.message);
        } else {
          this.global.showDangerToast(data.message);
        }
      },
      (err) => {
        this.ngxService.stop();
        this.global.showDangerToast("", err.message);
      },
      true
    );
  }

  openAddNoteModel() {
    if (!this.global.user || this.global.user.role != 2) {
      this.modalRef.hide();
      this.profileModalRef.hide();
      this.route.navigate(["/user/login"]);
    } else {
      if (
        this.selectedUser &&
        this.selectedUser.freelancer_note &&
        this.selectedUser.freelancer_note[0] &&
        this.selectedUser.freelancer_note[0].note
      ) {
        this.formBody.freelancer_note = this.selectedUser.freelancer_note[0].note;
      }
    }
  }

  addNoteToFavourite(formdata) {
    if (!this.global.user || this.global.user.role != 2) {
      this.modalRef.hide();
      this.profileModalRef.hide();
      this.route.navigate(["/user/login"]);
    } else {
      let newFormData = new FormData();
      newFormData.append("user_id", this.global.user._id);

      if (this.formBody.freelancer_note) {
        newFormData.append("note", this.formBody.freelancer_note);
      } else {
        this.global.showDangerToast("", "Please insert note about freelancer.");
        return;
      }

      if (this.selectedUser._id) {
        newFormData.append("freelancer_id", this.selectedUser._id);
      } else {
        this.global.showDangerToast("", "Please select a user to add note.");
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
            this.filterList(
              this.records.currentPage ? this.records.currentPage : 1
            );
            this.global.showToast("", data.message);
            $("#add-note-close").trigger("click");
            this.modalRef.hide();
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
  }

  addFreelancerToFavourite(formdata) {
    if (!this.global.user || this.global.user.role != 2) {
      this.profileModalRef.hide();
      this.modalRef.hide();
      setTimeout(() => {
        this.route.navigate(["user/login"]);
      }, 1000);
    } else {
      let newFormData = new FormData();
      newFormData.append("user_id", this.global.user._id);

      if (this.formBody.notes) {
        newFormData.append("notes", this.formBody.notes);
      } else {
        this.global.showDangerToast(
          "",
          "Please insert a note about freelancer"
        );
        return;
      }

      if (this.formBody.listId) {
        newFormData.append("list_id", this.formBody.listId);
      } else {
        this.global.showDangerToast(
          "",
          "Please choose a list to add freelancer. "
        );
        return;
      }

      if (this.selectedUser && this.selectedUser._id) {
        newFormData.append("freelancer_id", this.selectedUser._id);
      } else {
        this.global.showDangerToast(
          "",
          "Please select a freelancer to add in list."
        );
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
            this.filterList();
            this.formBody["list_id"] = "";
            this.formBody["notes"] = "";
            this.modalRef.hide();
            $("#add-favorites-close").trigger("click");
            this.global.showToast("", data.message);
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
  }

  uploadFile(event) {
    $("#create-new").addClass("show");
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

  closeModel(closeId) {
    $("#" + closeId).trigger("click");
  }

  OpenModal(
    template: TemplateRef<any>,
    user = null,
    portfolio = null,
    css = ""
  ) {
    console.log(portfolio);
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

  disabledEmojiSpace() {
    $(document).ready(function () {
      $(document).click(function (e) {
        if ($(e.target).closest(".in_menu").length) {
          console.log(e);
        } else {
          $(".company-detail").removeClass("show");
        }
      });

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

  resetFilters() {
    // this.getProfileContent();
    // this.getPastClients();
    // this.getFolderTabs();
    // this.ngOnInit();
    window.location.reload();
  }

}
