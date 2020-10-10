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
  Validators,
  FormArray,
  FormBuilder,
} from "@angular/forms";
import { DateValidators } from "../../validator.service";
import { GlobalService } from "../../global.service";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { CustomValidators } from "ng2-validation";
import { DomSanitizer } from "@angular/platform-browser";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { Options, LabelType } from "ng5-slider";
import * as moment from "moment";
declare var $: any;
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { NativeDateAdapter } from "@angular/material";
import { MatDateFormats } from "@angular/material/core";
export class AppDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === "input") {
      let day: string = date.getDate().toString();
      day = +day < 10 ? "0" + day : day;
      let month: string = (date.getMonth() + 1).toString();
      month = +month < 10 ? "0" + month : month;
      let year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }
    return date.toDateString();
  }
}
export const APP_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: { month: "short", year: "numeric", day: "numeric" },
  },
  display: {
    dateInput: "input",
    monthYearLabel: { year: "numeric", month: "numeric" },
    dateA11yLabel: { year: "numeric", month: "long", day: "numeric" },
    monthYearA11yLabel: { year: "numeric", month: "long" },
  },
};
@Component({
  selector: "app-step-four",
  templateUrl: "./step-four.component.html",
  styleUrls: ["./step-four.component.css"],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
  ],
})
export class ProjectStepFourComponent implements OnInit {
  projectId;
  isProjectForEdit: any = false;
  formData;
  formSubmitAttempt: any = false;
  minValue: number = 0;
  maxValue: number = 10000;
  paymentType;
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
  constructor(
    private route: Router,
    public global: GlobalService,
    private router: ActivatedRoute,
    private formBuilder: FormBuilder,
    private ngxService: NgxUiLoaderService,
    private sanitizer: DomSanitizer
  ) {
    this.router.paramMap.subscribe((params) => {
      console.log(params.get("id"), atob(params.get("id")));
      let str: any = params.get("id") ? atob(params.get("id")) : "";
      if (str.includes("~")) {
        str = str.split("~");
        str = str[0];
        this.isProjectForEdit = true;
      }
      console.log(str);
      this.projectId = str;
    });
    this.formData = this.formBuilder.group(
      {
        _id: new FormControl(),
        paymentType: new FormControl("", Validators.required),
        hourlyRate: new FormControl({ disabled: true, value: "" }, [
          Validators.required,
          Validators.pattern("^[0-9]{1,100}(?:.[0-9]{1,3})?$"),
          Validators.maxLength(10),
          CustomValidators.min(0.01),
        ]),
        startDate: new FormControl("", Validators.required),
        endDate: new FormControl("", Validators.required),
        fixedPrice: new FormControl([0, 1000]),
      },
      { validator: DateValidators }
    );
  }

  ngOnInit() {
    $(document).ready(() => {
      this.disabledEmojiSpace();
    });
    this.formData.get("paymentType").valueChanges.subscribe((checked) => {
      if (checked == 1) {
        this.formData.get("hourlyRate").disable();
      } else {
        this.formData.get("hourlyRate").enable();
      }
    });
    this.getProjectInfo();
  }

  userChangeEnd(item: any) {
    console.log(item);
  }

  onClickSubmit(formdata) {
    if (!this.formData.valid) {
      this.formSubmitAttempt = true;
      return;
    }
    this.formSubmitAttempt = false;
    console.log(formdata);
    if (!this.formData.valid) {
      this.formSubmitAttempt = true;
      return;
    }
    let newFormData = new FormData();
    if (this.paymentType == 1) {
      newFormData.append("fixedPrice", JSON.stringify(formdata.fixedPrice));
    }
    if (this.paymentType == 2) {
      newFormData.append("hourly_rate", formdata.hourlyRate);
    }
    newFormData.append("paymentType", formdata.paymentType);
    newFormData.append("user_id", this.global.user._id);
    newFormData.append("project_id", formdata._id);
    newFormData.append("startDate", formdata.startDate);
    newFormData.append("endDate", formdata.endDate);

    this.ngxService.start();
    this.global.post(
      "project/create-step4",
      newFormData,
      (data) => {
        this.ngxService.stop();
        console.log(data);
        if (data.status) {
          this.global.showToast("", data.message);
          this.route.navigate(
            this.isProjectForEdit
              ? ["/user/client/project/description/" + btoa(data.response._id)]
              : ["/user/project/create5" + "/" + btoa(data.response._id)],
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
          if (response.current_step >= 4) {
            this.formData.get("_id").setValue(response._id, {
              onlySelf: true,
            });
            this.formData
              .get("paymentType")
              .setValue(response.payment_type ? response.payment_type : "");

            this.paymentType = response.payment_type
              ? response.payment_type
              : "";

            this.formData
              .get("fixedPrice")
              .setValue(
                response.fixed_budget && response.fixed_budget.length == 2
                  ? response.fixed_budget
                  : [0, 1000]
              );

            this.formData
              .get("hourlyRate")
              .setValue(response.hourly_rate ? response.hourly_rate : "");

            this.formData
              .get("startDate")
              .setValue(
                response.start_date
                  ? moment(new Date(response.start_date)).format("YYYY-MM-DD")
                  : ""
              );

            this.formData
              .get("endDate")
              .setValue(
                response.end_date
                  ? moment(new Date(response.end_date)).format("YYYY-MM-DD")
                  : ""
              );
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

  changeOption(e, key) {
    if (key == "paymentType") {
      this.paymentType = e.target.value;
    }
    this.formData.get(key).setValue(e.target.value, {
      onlySelf: true,
    });
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
}
