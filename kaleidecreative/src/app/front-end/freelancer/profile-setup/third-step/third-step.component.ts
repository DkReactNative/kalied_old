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
  FormGroup,
  FormControl,
  Validators,
  FormArray,
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
  selector: "app-third-step",
  templateUrl: "./third-step.component.html",
  styleUrls: ["./third-step.component.css"],
})
export class ThirdStepComponent implements OnInit {
  @ViewChild("search", { static: false }) searchElementRef: ElementRef;
  position = new FormControl("below");
  formData;
  formSubmitAttempt: any = false;
  clientSubmitAttempt: any = false;
  public previousClient: FormArray;
  public previousClientList: FormArray;
  editIndex: any = -1;
  isEdit: any = false;
  experienceField: any = null;
  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private route: Router,
    public global: GlobalService,
    private formBuilder: FormBuilder,
    private ngxService: NgxUiLoaderService
  ) {
    if (
      !this.global.user.profile_setup &&
      this.global.user.role == 3 &&
      this.global.user.current_step < 3
    ) {
      let num = this.global.user.current_step
        ? this.global.user.current_step
        : 1;
      this.route.navigate(["/user/freelancer/set-up/" + num]);
    }

    this.formData = this.formBuilder.group({
      hourlyRate: new FormControl("", [
        Validators.required,
        Validators.pattern("^[0-9]{1,10}(?:.[0-9]{1,2})?$"),
        Validators.maxLength(10),
        CustomValidators.min(0.01),
      ]),

      fixedPrice: new FormControl("", [
        Validators.required,
        Validators.pattern("^[0-9]{1,10}(?:.[0-9]{1,2})?$"),
        Validators.maxLength(10),
        CustomValidators.min(0.01),
      ]),

      experienceYear: new FormControl("", [
        Validators.required,
        Validators.pattern("^[0-9]{1,2}(?:.[1-9]{1})?$"),
        CustomValidators.min(0),
        CustomValidators.max(60),
      ]),

      experienceField: new FormControl("", Validators.required),

      previousClient: this.formBuilder.array([this.createClient()]),
    });

    this.getProfileData();
  }

  ngOnInit() {
    this.disabledEmojiSpace();
    this.editIndex = this.formData.get("previousClient")["controls"].length - 1;
  }

  createClient(data = null): FormGroup {
    let cientName = data && data.client_name ? data.client_name : "";
    let role = data && data.role ? data.role : "";
    let workedAs = data && data.workedAs ? data.workedAs : "";
    let startDate = data && data.start_date ? data.start_date : "";
    let endDate = data && data.end_date ? data.end_date : "";
    let _id = data && data._id ? data._id : "";

    return this.formBuilder.group({
      clientName: new FormControl(cientName, [
        Validators.required,
        CustomValidators.rangeLength([1, 55]),
      ]),

      role: new FormControl(role, [
        Validators.required,
        CustomValidators.rangeLength([1, 55]),
      ]),

      workedAs: new FormControl(workedAs, Validators.required),

      startDate: new FormControl(startDate, Validators.required),
      endDate: new FormControl(endDate, Validators.required),

      _id: new FormControl(_id),
    });
  }

  get clientControls() {
    console.log([
      this.formData.get("previousClient")["controls"][this.editIndex],
    ]);
    return [this.formData.get("previousClient")["controls"][this.editIndex]];
  }

  addClient(client): void {
    if (!client.valid) {
      this.clientSubmitAttempt = true;
      return;
    }
    if (!this.isEdit) {
      this.previousClient = this.formData.get("previousClient") as FormArray;
      this.previousClient.push(this.createClient());
      this.editIndex =
        this.formData.get("previousClient")["controls"].length - 1;
      this.clientSubmitAttempt = false;
    } else {
      this.editIndex =
        this.formData.get("previousClient")["controls"].length - 1;
      this.isEdit = false;
      this.clientSubmitAttempt = false;
    }
  }

  editClient(index): void {
    if (this.formData.get("previousClient")["controls"].length <= 1) {
      return;
    }

    this.editIndex = index;
    this.isEdit = true;
  }

  removeClient(i: number, firstTime = false) {
    if (!firstTime && window.confirm("Are you sure to remove detail ?")) {
      this.previousClient.removeAt(i);
      this.editIndex =
        this.formData.get("previousClient")["controls"].length - 1;
    } else if (firstTime) {
      this.previousClient.removeAt(i);
      this.editIndex =
        this.formData.get("previousClient")["controls"].length - 1;
    }
  }

  changeExperience(value) {
    this.experienceField = value;
    this.formData.get("experienceField").setValue(value);
  }

  get getPreviousClient(): FormArray {
    return this.formData.get("previousClient") as FormArray;
  }

  getProfileData() {
    this.ngxService.start();
    this.global.get(
      "profile/step3-info/" + this.global.user._id,
      (data) => {
        this.ngxService.stop();
        console.log(data);
        if (data.status) {
          let user = data.response;

          this.formData
            .get("experienceField")
            .setValue(user.experience_level ? +user.experience_level : "");

          this.experienceField = user.experience_level
            ? +user.experience_level
            : "";

          this.formData
            .get("experienceYear")
            .setValue(user.experience_year ? +user.experience_year : "");

          this.formData
            .get("hourlyRate")
            .setValue(user.hourly_rate ? parseFloat(user.hourly_rate) : "");

          this.formData
            .get("fixedPrice")
            .setValue(
              user.minimum_fixed_price
                ? parseFloat(user.minimum_fixed_price)
                : ""
            );

          user.previous.forEach((ele) => {
            this.getPreviousClient.push(this.createClient(ele));
          });
          this.previousClient = this.getPreviousClient;

          if (user.previous.length > 0) {
            this.removeClient(0, true);
          }

          console.log(this.formData);
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
    if (!this.formData.valid) {
      this.formSubmitAttempt = true;
      return;
    }
    console.log(formdata);
    this.route.navigate(["/user/freelancer/set-up/4"]);

    let previousClient = formdata.previousClient.filter((ele) => {
      if (
        (ele.clientName != "" && ele.role != "" && ele.workedAs != "") ||
        ele.startDate != ""
      ) {
        return ele;
      }
    });

    let newFormData = new FormData();
    newFormData.append("hourly_rate", formdata.hourlyRate);
    newFormData.append("minimum_fixed_price", formdata.fixedPrice);
    newFormData.append("experience_year", formdata.experienceYear);
    newFormData.append("experience_level", formdata.experienceField);
    newFormData.append("previous", JSON.stringify(previousClient));
    newFormData.append("user_id", this.global.user._id);

    this.ngxService.start();
    this.global.post(
      "profile/update-step3",
      newFormData,
      (data) => {
        this.ngxService.stop();
        console.log(data);
        if (data.status) {
          this.global.updateUserSession();
          this.global.showToast("", data.message);
          setTimeout(() => {
            this.route.navigate(["/user/freelancer/set-up/4"]);
          }, 1000);
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

  spaceKey(event) {
    console.log(event.target.value);
    let value = event.target.value.trim();
    if (!value) {
      event.target.value = value;
      event.preventDefault();
    }
  }

  onBlurMethod(event) {
    console.log(event.target.value);
    let value = event.target.value.trim();
    if (!value) {
      event.target.value = value;
      event.preventDefault();
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
