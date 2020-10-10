import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  TemplateRef,
  NgZone,
} from "@angular/core";
import { GlobalService } from "../../global.service";
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
} from "../../validator.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { MapsAPILoader, MouseEvent } from "@agm/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CustomValidators } from "ng2-validation";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { TooltipPosition } from "@angular/material/tooltip";
declare var $: any;
import * as jQuery from "jquery";

@Component({
  selector: "app-freelacer-recommendations",
  templateUrl: "./freelacer-recommendations.component.html",
  styleUrls: ["./freelacer-recommendations.component.css"],
})
export class FreelacerRecommendationsComponent implements OnInit {
  modalRef: BsModalRef;

  @ViewChild("search", { static: false }) searchElementRef: ElementRef;
  position = new FormControl("below");
  formData;
  formSubmitAttempt: any = false;
  clientSubmitAttempt: any = false;
  public recommendations: FormArray;
  editIndex: any = -1;
  recommendationType: any = 1;
  isEdit: any = false;
  experienceField: any = null;
  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private route: Router,
    public global: GlobalService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private ngxService: NgxUiLoaderService
  ) {
    if (
      !this.global.user.profile_setup &&
      this.global.user.role == 3 &&
      this.global.user.current_step < 4
    ) {
      let num = this.global.user.current_step
        ? this.global.user.current_step
        : 1;
      this.route.navigate(["/user/freelancer/set-up/" + num]);
    }

    this.formData = this.formBuilder.group({
      recommendations: this.formBuilder.array(
        [this.createClient()],
        Validators.required
      ),
    });
    this.getProfileData();
  }

  ngOnInit() {
    this.disabledEmojiSpace();
    this.editIndex =
      this.formData.get("recommendations")["controls"].length - 1;
  }

  createClient(data = null): FormGroup {
    return this.formBuilder.group({
      referenceName: new FormControl(
        data && data.reference_name ? data.reference_name : "",
        [Validators.required, CustomValidators.rangeLength([1, 55])]
      ),

      position: new FormControl(data && data.positions ? data.positions : "", [
        Validators.required,
        CustomValidators.rangeLength([1, 55]),
      ]),

      company: new FormControl(
        data && data.company ? data.company : "",
        Validators.required
      ),

      recommendationText: new FormControl(
        data && data.recommendation_text ? data.recommendation_text : "",
        [Validators.required, CustomValidators.rangeLength([1, 1000])]
      ),

      email: new FormControl(
        data && data.email ? data.email : "",
        Validators.pattern("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,5}$")
      ),

      type: new FormControl(data && data.type ? data.type : 1),
      // url : new FormControl(data && data.url ? data.url :"")
    });
  }

  selectType(value, index) {
    this.recommendationType = value;
    this.formData
      .get("recommendations")
      ["controls"][index].get("type")
      .setValue(value);
  }

  get clientControls() {
    console.log([
      this.formData.get("recommendations")["controls"][this.editIndex],
    ]);
    return [this.formData.get("recommendations")["controls"][this.editIndex]];
  }

  addClient(client): void {
    if (!client.valid) {
      this.clientSubmitAttempt = true;
      return;
    }

    if (!this.isEdit) {
      this.recommendations = this.formData.get("recommendations") as FormArray;
      this.recommendations.push(this.createClient());
      this.editIndex =
        this.formData.get("recommendations")["controls"].length - 1;
      this.clientSubmitAttempt = false;
    } else {
      this.editIndex =
        this.formData.get("recommendations")["controls"].length - 1;
      this.isEdit = false;
      this.clientSubmitAttempt = false;
    }
    $("#myBtn2").trigger("click");
  }

  editClient(index): void {
    if (this.formData.get("recommendations")["controls"].length <= 1) {
      return;
    }

    this.editIndex = index;
    this.isEdit = true;
  }

  removeClient(i: number, firstTime = false) {
    if (!firstTime && window.confirm("Are you sure to remove detail ?")) {
      this.recommendations.removeAt(i);
      this.editIndex =
        this.formData.get("recommendations")["controls"].length - 1;
    } else if (firstTime) {
      this.recommendations.removeAt(i);
      this.editIndex =
        this.formData.get("recommendations")["controls"].length - 1;
    }
  }

  get getRecommendations(): FormArray {
    return this.formData.get("recommendations") as FormArray;
  }

  getProfileData() {
    this.ngxService.start();
    this.global.get(
      "profile/step4-info/" + this.global.user._id,
      (data) => {
        this.ngxService.stop();
        console.log(data);
        if (data.status) {
          let recommendations = data.response;

          recommendations.forEach((ele) => {
            this.getRecommendations.push(this.createClient(ele));
          });
          this.recommendations = this.getRecommendations;

          if (recommendations.length > 0) {
            //this.removeClient(0, true);
          }

          console.log(this.formData);
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

  onClickSubmit(formdata) {
    console.log(formdata);
    if (!this.formData.valid) {
      this.formSubmitAttempt = true;
    }

    let recommendation = formdata.recommendations.filter((ele) => {
      if (
        ele.referenceName != "" &&
        ele.position != "" &&
        ele.company != "" &&
        ele.type != "" &&
        ele.recommendationText != ""
      ) {
        return ele;
      }
    });

    let newFormData = new FormData();
    newFormData.append("recommendation", JSON.stringify(recommendation));

    newFormData.append("user_id", this.global.user._id);

    this.ngxService.start();
    this.global.post(
      "profile/update-step4",
      newFormData,
      (data) => {
        this.ngxService.stop();
        console.log(data);
        if (data.status) {
          this.global.updateUserSession();
          this.global.showToast("", data.message);
          //this.route.navigate(['/user/freelancer/set-up/5'])
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

  openModal(template: TemplateRef<any>) {
    const config = {
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: false,
      class: "big-model-dialog",
    };
    this.modalRef = this.modalService.show(template, config);
  }
  disabledEmojiSpace() {
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
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
