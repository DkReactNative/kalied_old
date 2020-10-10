import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone,
} from "@angular/core";
import { GlobalService } from "../global.service";
import { Router } from "@angular/router";
import {
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
} from "../validator.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { MapsAPILoader, MouseEvent } from "@agm/core";
import { CustomValidators } from "ng2-validation";
declare var $: any;
import * as jQuery from "jquery";
@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  @ViewChild("search", { static: false }) searchElementRef: ElementRef;
  // searchElementRef: ElementRef;
  // @ViewChild('search', { static: false }) set elemOnHTML(elem: ElementRef){
  //   if (!!elem) {
  //     this.searchElementRef = elem;
  //   }
  // }
  formSubmitAttempt: any = [false, false, false];
  basicDetail: any;
  addressDetail: any;
  LoginDetail: any;
  signUpStep: any = 1;
  userType: any = 2;
  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private route: Router,
    public global: GlobalService,
    private formBuilder: FormBuilder,
    private ngxService: NgxUiLoaderService
  ) {
    this.global.hideNavBars = true;
    // let user2 = localStorage.getItem(btoa("user")) ? atob(localStorage.getItem(btoa("user"))) : null;
    // user2 = JSON.parse(user2);
    // if (user2) {
    //   this.route.navigate(["user"]);
    // }
  }

  ngOnInit() {
    this.basicDetail = this.formBuilder.group({
      firstName: new FormControl("", [
        Validators.required,
        CustomValidators.rangeLength([1, 55]),
      ]),
      LastName: new FormControl("", [
        Validators.required,
        CustomValidators.rangeLength([1, 55]),
      ]),
      clientType: new FormControl(
        { disabled: true, value: "" },
        Validators.required
      ),
      freelancerType: new FormControl(
        { disabled: true, value: "" },
        Validators.required
      ),
      companyName: new FormControl({ disabled: true, value: "" }, [
        CustomValidators.rangeLength([1, 55]),
      ]),
      appearAs: new FormControl({ disabled: true, value: "" }, [
        Validators.required,
        CustomValidators.rangeLength([1, 500]),
      ]),
      summary: new FormControl({ disabled: true, value: "" }, [
        Validators.required,
        CustomValidators.rangeLength([1, 1000]),
      ]),
      type: new FormControl("", Validators.required),
    });

    this.basicDetail.get("type").valueChanges.subscribe((checked) => {
      if (checked == 2) {
        this.basicDetail.get("clientType").enable();
        this.basicDetail.get("companyName").enable();
        this.basicDetail.get("appearAs").enable();
        this.basicDetail.get("summary").enable();
        this.basicDetail.get("freelancerType").disable();
      } else {
        this.basicDetail.get("clientType").disable();
        this.basicDetail.get("companyName").disable();
        this.basicDetail.get("appearAs").disable();
        this.basicDetail.get("summary").disable();
        this.basicDetail.get("freelancerType").enable();
      }
    });

    this.addressDetail = this.formBuilder.group({
      address:
        this.userType == 2
          ? new FormControl("", Validators.required)
          : new FormControl(),
      city:
        this.userType == 2
          ? new FormControl("", Validators.required)
          : new FormControl(),
      state:
        this.userType == 2
          ? new FormControl("", Validators.required)
          : new FormControl(),
      zipCode: new FormControl("", Validators.required),
      country: new FormControl(),
      latitude: new FormControl(),
      longitude: new FormControl(),
    });

    this.LoginDetail = this.formBuilder.group(
      {
        email: EmailValidation,
        password: new FormControl("", PasswordValidation),
        confirmPassword: new FormControl("", PasswordValidation),
      },
      { validator: RepeatPasswordValidator }
    );
    this.basicDetail.get("type").setValue(2);

    setTimeout(() => {
      this.LoginDetail.get("email").setValue("");
    }, 10000);

    this.mapsAPILoaderFunction();
    this.disabledEmojiSpace();
  }

  changeCliet(e) {
    this.basicDetail.get("clientType").setValue(e.target.value, {
      onlySelf: true,
    });
  }

  changeFreelancer(e) {
    this.basicDetail.get("freelancerType").setValue(e.target.value, {
      onlySelf: true,
    });
  }

  selectType(value) {
    this.userType = value;
    this.basicDetail.get("type").setValue(value);
  }

  onClickSubmit(value) {
    if (!this.LoginDetail.valid) {
      console.log(this.LoginDetail);
      return;
    } else {
      console.log(this.LoginDetail);
      this.callRegisterApi(value);
    }
  }

  callRegisterApi(formdata) {
    let newFormData = new FormData();
    newFormData.append("email", formdata.LoginDetail.email.toLowerCase());
    newFormData.append("password", formdata.LoginDetail.password);
    newFormData.append("role", formdata.basicDetail.type);
    newFormData.append("first_name", formdata.basicDetail.firstName);
    newFormData.append("last_name", formdata.basicDetail.LastName);
    if (this.userType == 2) {
      newFormData.append("longitude", formdata.addressDetail.longitude);
      newFormData.append("latitude", formdata.addressDetail.latitude);
      newFormData.append("country", formdata.addressDetail.country);
      newFormData.append("appearas", formdata.basicDetail.appearAs);
      newFormData.append("companyname", formdata.basicDetail.companyName);
      newFormData.append("businesstype", formdata.basicDetail.clientType);
      newFormData.append("business_summary", formdata.basicDetail.summary);
      newFormData.append("address", formdata.addressDetail.address);
      newFormData.append("state", formdata.addressDetail.state);
      newFormData.append("city", formdata.addressDetail.city);
      newFormData.append("zipcode", formdata.addressDetail.zipCode);
    }
    if (this.userType == 3) {
      newFormData.append(
        "freelancer_type",
        formdata.basicDetail.freelancerType
      );
    }
    this.ngxService.start();
    this.global.post(
      "register",
      newFormData,
      (data) => {
        this.ngxService.stop();
        console.log(data);
        if (data.status) {
          if (data.response.status) {
            this.global.showToast("", data.message);
            if (data.response.email_confirmed) {
              this.route.navigate(["user"], { replaceUrl: true });
            } else {
              this.route.navigate(
                ["user/thanks/" + btoa("register:" + data.response.email)],
                { replaceUrl: true }
              );
            }
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

  onClickNext(i) {
    this.formSubmitAttempt[i] = true;
    switch (i) {
      case 0:
        if (!this.basicDetail.valid) {
          console.log(this.basicDetail);
          return;
        }
        // setTimeout(() => {
        //   console.log(this.searchElementRef); // back here through ViewChild set
        //   this.mapsAPILoaderFunction()
        // });
        this.LoginDetail.get("email").setValue("");
        break;
      case 1:
        this.LoginDetail.get("email").setValue("");
        if (!this.addressDetail.valid) {
          console.log(this.addressDetail);
          return;
        }
        break;
      case 2:
        if (!this.LoginDetail.valid) {
          console.log(this.LoginDetail);
          return;
        }
        break;
    }
    if (i == 2) {
      this.callRegisterApi({
        basicDetail: this.basicDetail.value,
        LoginDetail: this.LoginDetail.value,
        addressDetail: this.addressDetail.value,
      });
    } else {
      if (this.userType == 3) {
        this.signUpStep += 2;
      } else {
        this.signUpStep++;
      }
    }
  }

  onClickPrev(i) {
    this.formSubmitAttempt[i] = false;
    if (this.userType == 3) {
      this.signUpStep = this.signUpStep - 2;
    } else {
      this.signUpStep--;
    }
  }

  mapsAPILoaderFunction() {
    var count = 0;
    var oldaddress = {
      address: this.addressDetail.value.address,
      administrative_area_level_2: this.addressDetail.value.city,
      administrative_area_level_1: this.addressDetail.value.state,
      country: this.addressDetail.value.country,
      postal_code: this.addressDetail.value.zipCode,
      lat: this.addressDetail.value.latitude,
      long: this.addressDetail.value.longitude,
    };

    $("input[name='address1']").on("blur", () => {
      // this.ngxService.stop();
      this.fillAddress(oldaddress);
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
    // this.addressDetail.get("address").setValue(, {
    //         onlySelf: true
    //       })
    this.addressDetail.get("state").setValue("", {
      onlySelf: true,
    });
    this.addressDetail.get("city").setValue("", {
      onlySelf: true,
    });
    this.addressDetail.get("zipCode").setValue("", {
      onlySelf: true,
    });
    this.addressDetail.get("country").setValue("", {
      onlySelf: true,
    });
    this.addressDetail.get("latitude").setValue("", {
      onlySelf: true,
    });
    this.addressDetail.get("longitude").setValue("", {
      onlySelf: true,
    });
  }

  fillAddress(address) {
    console.log(address);
    this.addressDetail.get("address").setValue(address.address);
    this.addressDetail
      .get("state")
      .setValue(address.administrative_area_level_1);
    this.addressDetail
      .get("city")
      .setValue(address.administrative_area_level_2);
    this.addressDetail.get("zipCode").setValue(address.postal_code);
    this.addressDetail.get("country").setValue(address.country);
    this.addressDetail.get("latitude").setValue(address.lat);
    this.addressDetail.get("longitude").setValue(address.long);
  }

  goToHome() {
    this.route.navigate(["user/home/"], { replaceUrl: true });
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
