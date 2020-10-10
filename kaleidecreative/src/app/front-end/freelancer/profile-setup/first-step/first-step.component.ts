import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone,
} from "@angular/core";
import { GlobalService } from "../../../global.service";
import { Router } from "@angular/router";
import {
  FormArray,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";
import {
  EmailValidation,
  PasswordValidation,
  RepeatPasswordEStateMatcher,
  RepeatPasswordValidator,
} from "../../../validator.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { MapsAPILoader, MouseEvent } from "@agm/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CustomValidators } from "ng2-validation";
declare var $: any;
import * as jQuery from "jquery";

@Component({
  selector: "app-first-step",
  templateUrl: "./first-step.component.html",
  styleUrls: ["./first-step.component.css"],
})
export class FirstStepComponent implements OnInit {
  @ViewChild("search", { static: false }) searchElementRef: ElementRef;
  ethnicityData = [
    { value: "1", name: "African American/Black" },
    { value: "2", name: "American Indian/Native American" },
    { value: "3", name: "Asian" },
    { value: "4", name: "Hispanic/Latino" },
    { value: "5", name: "White" },
  ];
  formData;
  maxYear: any = new Date().getFullYear() - 10;
  formSubmitAttempt: any = false;
  profileImage: any = "assets/images/user-editor.png";
  image: any = null;
  availability: any = [];
  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private route: Router,
    public global: GlobalService,
    private formBuilder: FormBuilder,
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit() {
    this.disabledEmojiSpace();
    this.formData = this.formBuilder.group({
      about: new FormControl("", [
        Validators.required,
        CustomValidators.rangeLength([1, 1000]),
      ]),

      birthdate: new FormControl("", [
        Validators.required,
        Validators.pattern("^[0-9_-]{4}"),
        CustomValidators.min(1900),
        CustomValidators.max(this.maxYear),
      ]),

      email: new FormControl("", Validators.required),

      firstName: new FormControl("", Validators.required),

      LastName: new FormControl("", Validators.required),

      address: new FormControl("", Validators.required),

      city: new FormControl("", [
        Validators.required,
        CustomValidators.rangeLength([1, 100]),
      ]),

      state: new FormControl(),

      zipCode: new FormControl("", [
        Validators.required,
        Validators.pattern("^[0-9_-]{4,10}"),
        CustomValidators.rangeLength([1, 10]),
      ]),

      country: new FormControl("", [
        Validators.required,
        CustomValidators.rangeLength([1, 55]),
      ]),

      latitude: new FormControl(),

      longitude: new FormControl(),

      travelDistance: new FormControl("", Validators.required),

      gender: new FormControl("", Validators.required),

      orientation: new FormControl("", Validators.required),

      disabilities: new FormControl("", Validators.required),

      ethnicity: this.formBuilder.array([], Validators.required),

      phone: new FormControl("", [
        Validators.required,
        Validators.pattern("^[0-9_-]{8,12}"),
      ]),
      website: new FormControl("", CustomValidators.url),

      linkdin: new FormControl("", CustomValidators.url),

      otherLanguage: new FormControl(),

      englishProficiency: new FormControl("", Validators.required),

      availability: this.formBuilder.array([], Validators.required),
    });

    setTimeout(() => {
      console.log(this.searchElementRef); // back here through ViewChild set
      this.mapsAPILoaderFunction();
    }, 2000);

    console.log(this.formData);
    this.getProfileData();
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
  changeOption(e, key) {
    this.formData.get(key).setValue(e.target.value, {
      onlySelf: true,
    });
  }

  get getEthinicity(): FormArray {
    return this.formData.get("ethnicity") as FormArray;
  }

  get getavailability(): FormArray {
    return this.formData.get("availability") as FormArray;
  }

  changeAvailability(value) {
    const checkArray: FormArray = this.formData.get(
      "availability"
    ) as FormArray;

    if (!this.availability.includes(value)) {
      checkArray.push(new FormControl(value));
      this.availability.push(value);
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: FormControl) => {
        if (item.value == value) {
          checkArray.removeAt(i);
          this.availability.splice(i, 1);
          return;
        }
        i++;
      });
    }
  }

  uploadFile(event) {
    var input = event.target;
    console.log(event);
    var reader = new FileReader();
    reader.onload = () => {
      var dataURL: any = reader.result;
      var output = document.getElementById("profile-image");
      document.getElementById("profile-image").setAttribute("src", dataURL);
      this.profileImage = dataURL;
      this.image = event.target.files[0];
    };
    reader.readAsDataURL(input.files[0]);
  }

  getProfileData() {
    this.ngxService.start();
    this.global.get(
      "profile/step1-info/" + this.global.user._id,
      (data) => {
        this.ngxService.stop();
        console.log(data);
        if (data.status) {
          let user = data.response;

          if (user.image) {
            this.profileImage = user.image;
          }

          this.formData
            .get("firstName")
            .setValue(user.first_name ? user.first_name : "");

          this.formData
            .get("LastName")
            .setValue(user.last_name ? user.last_name : "");

          this.formData.get("email").setValue(user.email ? user.email : "");

          this.formData
            .get("birthdate")
            .setValue(user.birthdate ? user.birthdate : "");

          this.formData.get("about").setValue(user.aboutme ? user.aboutme : "");

          this.formData
            .get("address")
            .setValue(user.address ? user.address : "");

          this.formData.get("city").setValue(user.city ? user.city : "");

          this.formData.get("state").setValue(user.state ? user.state : "");

          this.formData
            .get("country")
            .setValue(user.country ? user.country : "");

          this.formData
            .get("zipCode")
            .setValue(user.zipcode ? user.zipcode : "");

          this.formData
            .get("website")
            .setValue(user.website ? user.website : "");

          this.formData.get("phone").setValue(user.phoneno ? user.phoneno : "");

          this.formData
            .get("latitude")
            .setValue(user.latitude ? user.latitude : "");

          this.formData
            .get("longitude")
            .setValue(user.longitude ? user.longitude : "");

          this.formData
            .get("travelDistance")
            .setValue(user.travel_distance ? user.travel_distance : "");

          this.formData.get("gender").setValue(user.gender ? user.gender : "");

          this.formData
            .get("orientation")
            .setValue(user.orientation ? user.orientation : "");

          this.formData
            .get("disabilities")
            .setValue(user.disabilities ? user.disabilities : "");

          // this.formData.get("ethnicity").setValue(user.ethnicity?user.ethnicity:"");

          if (Array.isArray(user.ethnicity)) {
            user.ethnicity.forEach((ele) => {
              this.getEthinicity.push(new FormControl(ele));
            });
          }

          this.formData
            .get("linkdin")
            .setValue(user.linkedin_url ? user.linkedin_url : "");

          this.formData
            .get("otherLanguage")
            .setValue(user.other_language ? user.other_language : "");

          this.formData
            .get("englishProficiency")
            .setValue(user.english_proficiency ? user.english_proficiency : "");

          // client chnage single to multiple
          if (user.availability && !Array.isArray(user.availability)) {
            user.availability = [...user.availability];
          }

          user.availability.forEach((ele) => {
            this.getavailability.push(new FormControl(ele));
          });
          this.availability = user.availability
            ? Array.isArray(user.availability)
              ? user.availability
              : [...user.availability]
            : [];
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

  onClickSubmit(formdata) {
    console.log(formdata);
    if (!this.formData.valid) {
      this.formSubmitAttempt = true;
      return;
    }
    formdata = formdata.value;
    let newFormData = new FormData();
    newFormData.append("first_name", formdata.firstName);
    newFormData.append("last_name", formdata.LastName);
    newFormData.append("email", formdata.email);
    newFormData.append("about_me", formdata.about);
    newFormData.append("birthdate", formdata.birthdate);
    newFormData.append("longitude", formdata.longitude);
    newFormData.append("ethnicity", JSON.stringify(formdata.ethnicity));
    newFormData.append("latitude", formdata.latitude);
    newFormData.append("country", formdata.country);
    newFormData.append("disabilities", formdata.disabilities);
    newFormData.append("english_proficiency", formdata.englishProficiency);
    newFormData.append("address", formdata.address);
    newFormData.append("state", formdata.state);
    newFormData.append("city", formdata.city);
    newFormData.append("zipcode", formdata.zipCode);
    newFormData.append("gender", formdata.gender);
    newFormData.append("travel_distance", formdata.travelDistance);
    newFormData.append("website", formdata.website);
    newFormData.append("linkedin_url", formdata.linkdin);
    newFormData.append("orientation", formdata.orientation);
    newFormData.append("availability", JSON.stringify(this.availability));
    newFormData.append("user_id", this.global.user._id);
    newFormData.append("phoneno", formdata.phone);
    newFormData.append("other_language", formdata.otherLanguage);
    newFormData.append("freelancer_type", this.global.user.freelancer_type);
    if (this.image) {
      newFormData.append("profile_image", this.image);
    }

    this.ngxService.start();
    this.global.post(
      "profile/update-step1",
      newFormData,
      (data) => {
        this.ngxService.stop();
        console.log(data);
        if (data.status) {
          if (data.response.status) {
            localStorage.setItem(
              btoa("user-kc"),
              JSON.stringify(data.response)
            );
            this.global.user = data.response;
            this.global.isLogin = true;
            localStorage.setItem(btoa("AuthToken-kc"), data.response.token);
            this.global.AuthToken = data.response.token;
            this.global.showToast("", data.message);
            setTimeout(() => {
              this.route.navigate(["/user/freelancer/set-up/2"]);
            }, 1000);
          } else {
            this.global.showDangerToast("", data.message);
            let message = "";
            data.response.map((ele) => {
              message += Object.values(ele) + ". ";
            });
            this.global.showDangerToast("", message);
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
      // this.ngxService.stop();
      this.formData(oldaddress);
    });

    this.mapsAPILoader.load().then(() => {
      var input = this.searchElementRef.nativeElement;
      var options = {
        types: ["address"],
      };
      let autocomplete = new google.maps.places.Autocomplete(input, options);
      this.ngZone.run(() => {
        google.maps.event.addListener(autocomplete, "place_changed", () => {
          // this.ngxService.start();
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
          if (!count) {
            $("input[name='address1']").focus();
          }
          count++;
          // $("input[name='address1']").blur()
        });
      });
    });
  }

  emptyAddress() {
    // this.formData.get("address").setValue(, {
    //         onlySelf: true
    //       })
    this.formData.get("state").setValue("", {
      onlySelf: true,
    });
    this.formData.get("city").setValue("", {
      onlySelf: true,
    });
    this.formData.get("zipCode").setValue("", {
      onlySelf: true,
    });
    this.formData.get("country").setValue("", {
      onlySelf: true,
    });
    this.formData.get("latitude").setValue("", {
      onlySelf: true,
    });
    this.formData.get("longitude").setValue("", {
      onlySelf: true,
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

  triggerFile() {
    $("#file-input").trigger("click");
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
