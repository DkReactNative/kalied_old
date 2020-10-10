import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  TemplateRef,
  NgZone,
  ViewEncapsulation,
} from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormArray,
  Validators,
  FormBuilder,
} from "@angular/forms";
import { CustomValidators } from "ng2-validation";
import { GlobalService } from "../../global.service";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { MapsAPILoader, MouseEvent } from "@agm/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import "rxjs/add/operator/map";
import { async } from "@angular/core/testing";
import { isFormattedError } from "@angular/compiler";
declare var $: any;
@Component({
  selector: "app-step-three",
  templateUrl: "./step-three.component.html",
  styleUrls: ["./step-three.component.css"],
})
export class ProjectStepThreeComponent implements OnInit {
  @ViewChild("search", { static: false }) searchElementRef: ElementRef;
  projectId;
  isProjectForEdit: any = false;
  firstTime: any = true;
  formData;
  projectType = [];
  formSubmitAttempt: any = false;
  genereType = [];
  industryType = [];
  constructor(
    public mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private route: Router,
    private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    public global: GlobalService,
    private ngxService: NgxUiLoaderService,
    private sanitizer: DomSanitizer
  ) {
    this.getProfileContent();
    this.router.paramMap.subscribe((params) => {
      console.log(params.get("id"), atob(params.get("id")));
      let str: any = params.get("id") ? atob(params.get("id")) : "";
      console.log(str);
      if (str.includes("~")) {
        str = str.split("~");
        str = str[0];
        this.isProjectForEdit = true;
      }
      this.projectId = str;
    });

    this.formData = this.formBuilder.group({
      _id: new FormControl(),

      freelancerType: new FormControl("", Validators.required),

      projectType: new FormControl("", Validators.required),

      industry: this.formBuilder.array([]),

      genere: this.formBuilder.array([]),

      country: new FormControl("", [
        Validators.required,
        CustomValidators.rangeLength([3, 55]),
      ]),
      address: new FormControl(),
      city: new FormControl("", [
        Validators.required,
        CustomValidators.rangeLength([3, 55]),
      ]),

      state: new FormControl(),

      zipCode: new FormControl("", [
        Validators.required,
        Validators.pattern("^[A-Za-z0-9_-]{4,10}"),
        CustomValidators.rangeLength([4, 10]),
      ]),

      latitude: new FormControl(),

      longitude: new FormControl(),
    });
  }

  ngOnInit() {
    this.getGenereType.clear();
    this.getIndustryType.clear();
    setTimeout(() => {
      console.log(this.searchElementRef); // back here through ViewChild set
      this.mapsAPILoaderFunction();
      $("body").on("click", ".dropdown-menu", function (e) {
        $(this).parent().is(".show") && e.stopPropagation();
      });
    }, 2000);
    this.disabledEmojiSpace();
    if (this.projectId) {
      setTimeout(() => {
        this.getProjectInfo();
      }, 500);
    }
  }

  onCheckboxChange(e, key) {
    const checkArray: FormArray = this.formData.get(key) as FormArray;

    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  get getGenereType(): FormArray {
    return this.formData.get("genere") as FormArray;
  }

  get getIndustryType(): FormArray {
    return this.formData.get("industry") as FormArray;
  }

  getProfileContent() {
    this.ngxService.start();
    this.global.get(
      "profileContent//projectType",
      (data) => {
        this.ngxService.stop();
        console.log(data);
        if (data.status) {
          let user = data.response;
          this.projectType = user;
          this.getGenereType.clear();
          this.getIndustryType.clear();
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

  changeOption(e, key) {
    if (key == "projectType") {
      this.genereType = [];
      this.industryType = [];
      this.getGenereIndustryTypes(e.target.value);
      if (!this.firstTime) {
        this.getGenereType.clear();
        this.getIndustryType.clear();
      }
      this.firstTime = false;
    }
    this.formData.get(key).setValue(e.target.value, {
      onlySelf: true,
    });
  }

  getGenereIndustryTypes(id) {
    this.ngxService.stop();
    this.global.get(
      "profileContent/industry-genre-all/" + id,
      (data) => {
        this.ngxService.stop();
        console.log(data);
        if (data.status) {
          let user = data.response;
          this.genereType = user.genereType;
          this.industryType = user.industryType;
          this.firstTime = false;
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

  submitForm(formdata) {
    console.log(formdata);
    if (!this.formData.valid) {
      this.formSubmitAttempt = true;
      return;
    }
    if (isFormattedError) {
      var project_type = this.formData.get("projectType").value;
    } else {
      var project_type = formdata.projectType;
    }
    console.log(this.formData.get("projectType").value);
    let newFormData = new FormData();
    newFormData.append("freelancerType", formdata.freelancerType);
    newFormData.append("projectType", project_type);
    newFormData.append("industry", JSON.stringify(formdata.industry));
    newFormData.append("genere", JSON.stringify(formdata.genere));
    newFormData.append("user_id", this.global.user._id);
    newFormData.append("project_id", formdata._id);
    newFormData.append("longitude", formdata.longitude);
    newFormData.append("latitude", formdata.latitude);
    newFormData.append("country", formdata.country);
    newFormData.append("state", formdata.state);
    newFormData.append("address", formdata.address);
    newFormData.append("city", formdata.city);
    newFormData.append("zipcode", formdata.zipCode);

    this.ngxService.start();
    this.global.post(
      "project/create-step3",
      newFormData,
      (data) => {
        this.ngxService.stop();
        console.log(data);
        if (data.status) {
          this.global.showToast("", data.message);
          this.route.navigate(
            this.isProjectForEdit
              ? ["/user/client/project/description/" + btoa(data.response._id)]
              : ["/user/project/create4" + "/" + btoa(data.response._id)],
            {
              replaceUrl: true,
            }
          );
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

  getProjectInfo() {
    this.ngxService.start();
    this.global.get(
      "project/" + this.projectId,
      (data) => {
        this.ngxService.stop();
        console.log(data);
        if (data.status) {
          let response = data.response;
          if (response.current_step >= 3) {
            response.genere = response.genere.map((ele) => ele._id);
            response.genere.forEach((ele) => {
              console.log(ele);
              this.getGenereType.push(new FormControl(ele));
            });
            response.industry = response.industry.map((ele) => ele._id);
            response.industry.forEach((ele) => {
              console.log(ele);
              this.getIndustryType.push(new FormControl(ele));
            });

            if (response.project_type && response.project_type._id) {
              this.getGenereIndustryTypes(
                response.project_type._id ? response.project_type._id : ""
              );
            }
            this.formData.get("_id").setValue(response._id ? response._id : "");
            this.formData
              .get("freelancerType")
              .setValue(
                response.freelancer_type ? response.freelancer_type : ""
              );
            this.formData
              .get("projectType")
              .setValue(
                response.project_type && response.project_type._id
                  ? response.project_type._id
                  : ""
              );

            this.formData
              .get("longitude")
              .setValue(response.longitude ? response.longitude : "");

            this.formData
              .get("latitude")
              .setValue(response.latitude ? response.latitude : "");

            this.formData
              .get("country")
              .setValue(response.country ? response.country : "");

            this.formData
              .get("address")
              .setValue(response.address ? response.address : "");

            this.formData
              .get("city")
              .setValue(response.city ? response.city : "");

            this.formData
              .get("state")
              .setValue(response.state ? response.state : "");

            this.formData
              .get("zipCode")
              .setValue(response.zipcode ? response.zipcode : "");
            if (this.isProjectForEdit) {
              this.formData.get("projectType").disable();
            }
          } else {
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
  mapsAPILoaderFunction() {
    var count = 0;
    var oldaddress = {
      address: this.formData.value.address,
      administrative_area_level_2: this.formData.value.city,
      administrative_area_level_1: this.formData.value.state,
      country: this.formData.value.country,
      postal_code: this.formData.value.zipCode,
      lat: this.formData.value.latitude,
      long: this.formData.value.longitude,
    };

    $("input[name='address1']").on("blur", () => {
      this.fillAddress(oldaddress);
    });

    this.mapsAPILoader.load().then(() => {
      var input = this.searchElementRef.nativeElement;
      var options = {
        types: ["(cities)"],
      };
      let autocomplete = new google.maps.places.Autocomplete(input, options);
      this.ngZone.run(() => {
        google.maps.event.addListener(autocomplete, "place_changed", () => {
          var place = autocomplete.getPlace();
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
          }
          oldaddress["lat"] = place.geometry.location.lat();
          oldaddress["long"] = place.geometry.location.lng();
          oldaddress["address"] = place.formatted_address;
          this.fillAddress(oldaddress);
          if (!count) {
            $("input[name='address1']").focus();
          }
          count++;
          // $("input[name='address1']").blur()
        });
      });
    });
  }

  fillAddress(address) {
    console.log(address);
    this.formData.get("address").setValue(address.address);
    this.formData.get("state").setValue(address.administrative_area_level_1);
    this.formData.get("city").setValue(address.administrative_area_level_2);
    this.formData.get("zipCode").setValue(address.postal_code);
    this.formData.get("country").setValue(address.country);
    this.formData.get("latitude").setValue(address.lat);
    this.formData.get("longitude").setValue(address.long);
  }

  getCheckedStatus(value, array = []) {
    return array.indexOf(value) > -1;
  }

  Btoa(id) {
    return btoa(id);
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

  ngOnDestroy() {
    this.formData = [];
  }
}
