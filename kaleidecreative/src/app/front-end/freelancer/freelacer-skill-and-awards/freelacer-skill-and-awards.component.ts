import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone,
} from "@angular/core";
import { GlobalService } from "../../global.service";
import { Router } from "@angular/router";
import {
  FormGroup,
  FormControl,
  FormArray,
  Validators,
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
declare var $: any;
import * as jQuery from "jquery";

@Component({
  selector: "app-freelacer-skill-and-awards",
  templateUrl: "./freelacer-skill-and-awards.component.html",
  styleUrls: ["./freelacer-skill-and-awards.component.css"],
})
export class FreelacerSkillAndAwardsComponent implements OnInit {
  @ViewChild("search", { static: false }) searchElementRef: ElementRef;
  formData;
  formSubmitAttempt: any = false;

  primarySkill: any = [];

  secondarySkill: any = [];

  editingStyle: any = [];

  graphicSpecialties: any = [];

  awards: any = [];
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
      this.global.user.current_step < 2
    ) {
      let num = this.global.user.current_step
        ? this.global.user.current_step
        : 1;
      this.route.navigate(["/user/freelancer/set-up/" + num]);
    }
  }

  ngOnInit() {
    this.disabledEmojiSpace();
    this.formData = this.formBuilder.group({
      primarySkill: this.formBuilder.array([], Validators.required),

      secondarySkill: this.formBuilder.array([], Validators.required),

      editingStyle:
        this.global.user.freelancer_type == 2
          ? this.formBuilder.array([], Validators.required)
          : this.formBuilder.array([]),

      graphicSpecialties:
        this.global.user.freelancer_type == 1
          ? this.formBuilder.array([], Validators.required)
          : this.formBuilder.array([]),

      awards: this.formBuilder.array([]),
    });

    this.getProfileData();
    this.getProfileContent();
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

  get getPrimarySkill(): FormArray {
    return this.formData.get("primarySkill") as FormArray;
  }

  get getSecondarySkill(): FormArray {
    return this.formData.get("secondarySkill") as FormArray;
  }

  get getGraphicSpecialties(): FormArray {
    return this.formData.get("graphicSpecialties") as FormArray;
  }

  get getEditingStyle(): FormArray {
    return this.formData.get("editingStyle") as FormArray;
  }

  get getAwards(): FormArray {
    return this.formData.get("awards") as FormArray;
  }
  getProfileData() {
    this.ngxService.start();
    this.global.get(
      "profile/step2-info/" + this.global.user._id,
      (data) => {
        this.ngxService.stop();
        console.log(data);
        if (data.status) {
          let user = data.response;

          user.primary_skills.forEach((ele) => {
            this.getPrimarySkill.push(new FormControl(ele));
          });

          console.log(this.getPrimarySkill);

          user.secondary_skills.forEach((ele) => {
            this.getSecondarySkill.push(new FormControl(ele));
          });

          user.graphic_specialities.forEach((ele) => {
            this.getGraphicSpecialties.push(new FormControl(ele));
          });

          user.editing_style.forEach((ele) => {
            this.getEditingStyle.push(new FormControl(ele));
          });

          user.awards.forEach((ele) => {
            this.getAwards.push(new FormControl(ele));
          });
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

          this.primarySkill = user.primarySkills.filter((ele) => {
            if (ele.freelancer_type == this.global.user.freelancer_type) {
              return ele;
            }
          });

          this.secondarySkill = user.secondarySkills.filter((ele) => {
            if (ele.freelancer_type == this.global.user.freelancer_type) {
              return ele;
            }
          });

          this.editingStyle = user.editingStyle;

          this.graphicSpecialties = user.graphicSpecalities;

          this.awards = user.awards.filter((ele) => {
            if (ele.freelancer_type == this.global.user.freelancer_type) {
              return ele;
            }
          });
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

    formdata = formdata.value;
    console.log(this.formData);

    let newFormData = new FormData();

    newFormData.append("primary_skills", JSON.stringify(formdata.primarySkill));

    newFormData.append(
      "secondary_skills",
      JSON.stringify(formdata.secondarySkill)
    );

    newFormData.append("editing_style", JSON.stringify(formdata.editingStyle));

    newFormData.append(
      "graphic_specialities",
      JSON.stringify(formdata.graphicSpecialties)
    );

    newFormData.append("awards", JSON.stringify(formdata.awards));

    newFormData.append("user_id", this.global.user._id);

    this.ngxService.start();
    this.global.post(
      "profile/update-step2",
      newFormData,
      (data) => {
        this.ngxService.stop();
        console.log(data);
        if (data.status) {
          this.global.updateUserSession();
          this.global.showToast("", data.message);
          //this.route.navigate(['/user/freelancer/set-up/3'])
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

  disabledEmojiSpace() {
    $(document).ready(function () {
      $(document).click(function (e) {
        if ($(e.target).closest(".in_menu").length) {
          console.log(e);
        } else {
          $(".collapse").removeClass("show");
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
}
