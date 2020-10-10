import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone,
  Pipe,
  PipeTransform,
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
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
import { find, get, pull } from "lodash";
import { Http, Headers, RequestOptions } from "@angular/http";
import "rxjs/add/operator/map";

declare var $: any;
import * as jQuery from "jquery";
@Pipe({
  name: "safe",
})
@Component({
  selector: "app-freelacer-manage-portfolio-video",
  templateUrl: "./freelacer-manage-portfolio-video.component.html",
  styleUrls: ["./freelacer-manage-portfolio-video.component.css"],
})
export class FreelacerManagePortfolioVideoComponent implements OnInit {
  @ViewChild("tagInput", { static: false }) tagInputRef: ElementRef;
  tags: string[] = [];

  formData;
  formSubmitAttempt: any = false;
  availability: any = null;
  validVimeo: any = true;
  selectedPortfolio;

  projectType: any = [];
  genereType = [];
  industryType = [];

  portfolios: any = [];

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private route: Router,
    public global: GlobalService,
    private formBuilder: FormBuilder,
    public http: Http,
    private ngxService: NgxUiLoaderService,
    private sanitizer: DomSanitizer
  ) {
    if (
      !this.global.user.profile_setup &&
      this.global.user.role == 3 &&
      this.global.user.current_step <= 4
    ) {
      let num = this.global.user.current_step
        ? this.global.user.current_step
        : 1;
      this.route.navigate(["/user/freelancer/set-up/" + num]);
    }
  }

  ngOnInit() {
    this.disabledEmojiSpace();

    let vimeoPattern = /(http|https)?:\/\/(www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|)(\d+)(?:|\/\?)/;

    $("#video-module-close").on("click", (evt) => {
      console.log("video-module closed");
      var src = $("#v1").attr("src");
      $("#v1").attr("src", "");
      $("#v1").attr("src", src);
    });

    $("#videoInput").blur((event) => {
      this.ngxService.start();
      this.checkIfVideoExists(
        event.target.value,
        (data) => {
          this.ngxService.stop();
          console.log(data);
          this.validVimeo = true;
          this.formData.get("thumbImage").setValue(data.thumbnail_url);
          // document.getElementById('vimeoId').innerHTML = data.html;
        },
        (err) => {
          this.ngxService.stop();
          this.validVimeo = false;
          document.getElementById("vimeoId").innerHTML = "";
          console.log(err);
        }
      );
    });

    this.formData = this.formBuilder.group({
      tag: new FormControl("", CustomValidators.rangeLength([0, 20])),

      _id: new FormControl(),

      videoUrl: new FormControl("", [
        Validators.required,
        CustomValidators.url,
        Validators.pattern(vimeoPattern),
      ]),

      projectType: new FormControl("", Validators.required),

      industry: this.formBuilder.array([]),

      genere: this.formBuilder.array([]),

      clientName: new FormControl("", [
        Validators.required,
        CustomValidators.rangeLength([3, 55]),
      ]),

      thumbImage: new FormControl(),

      projectName: new FormControl("", [
        Validators.required,
        CustomValidators.rangeLength([3, 55]),
      ]),
    });

    console.log(this.formData);
    this.getProfileData();
    this.getProfileContent();
  }

  changeOption(e, key) {
    if (key == "projectType") {
      this.genereType = [];
      this.industryType = [];
      this.getGenereIndustryTypes(e.target.value);
      this.getGenereType.clear();
      this.getIndustryType.clear();
    }
    this.formData.get(key).setValue(e.target.value, {
      onlySelf: true,
    });
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

  getCheckedStatus(value, array = []) {
    return array.indexOf(value) > -1;
  }

  fillForm(object, id = "") {
    this.getGenereType.clear();
    this.getIndustryType.clear();
    if (object.project_type) {
      this.getGenereIndustryTypes(object.project_type);
    }
    this.formData
      .get("videoUrl")
      .setValue(object.video_url ? object.video_url : "");

    this.formData.get("_id").setValue(object._id ? object._id : "");

    this.formData
      .get("thumbImage")
      .setValue(object.thumb_image ? object.thumb_image : "");

    this.formData
      .get("projectType")
      .setValue(object.project_type ? object.project_type : "");

    if (Array.isArray(object.genre))
      object.genre.forEach((ele) => {
        console.log(ele);
        this.getGenereType.push(new FormControl(ele));
      });

    if (Array.isArray(object.industry))
      object.industry.forEach((ele) => {
        console.log(ele);
        this.getIndustryType.push(new FormControl(ele));
      });

    this.formData
      .get("clientName")
      .setValue(object.client_name ? object.client_name : "");

    this.formData
      .get("projectName")
      .setValue(object.project_name ? object.project_name : "");

    this.tags = object.tags ? object.tags : [];

    this.scroll(id ? id : object.video_url ? "scroll" : "scroll-up");
  }

  getProfileData() {
    this.ngxService.start();
    this.global.get(
      "profile/step5-info/" + this.global.user._id,
      (data) => {
        this.ngxService.stop();
        console.log(data);
        if (data.status) {
          this.portfolios = data.response;
          this.selectedPortfolio = "";
        } else {
          // this.global.showDangerToast("", data.message);
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
      "profileContent/projectType",
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

  getGenereIndustryTypes(id) {
    this.ngxService.start();
    this.global.get(
      "profileContent/industry-genre-all/" + id,
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

  onClickSubmit() {
    let newFormData = new FormData();
    newFormData.append("user_id", this.global.user._id);

    this.ngxService.start();
    this.global.post(
      "profile/update-step5",
      newFormData,
      (data) => {
        this.ngxService.stop();
        console.log(data);
        if (data.status) {
          this.global.updateUserSession();
          this.global.showToast("", data.message);
          setTimeout(() => {
            this.route.navigate(["/user/freelancer/profile"]);
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

  addVideo(formdata) {
    if (!this.formData.valid || !this.validVimeo) {
      this.formSubmitAttempt = true;
    }
    console.log(formdata);

    let newFormData = new FormData();
    newFormData.append("tags", JSON.stringify(this.tags));
    newFormData.append("videoUrl", formdata.videoUrl);
    newFormData.append("projectType", formdata.projectType);
    newFormData.append("industry", JSON.stringify(formdata.industry));
    newFormData.append("genere", JSON.stringify(formdata.genere));
    newFormData.append("user_id", this.global.user._id);
    newFormData.append("thumb_image", formdata.thumbImage);
    newFormData.append("client_name", formdata.clientName);
    newFormData.append("project_name", formdata.projectName);
    newFormData.append("portfolio_id", formdata._id ? formdata._id : "");

    this.ngxService.start();
    this.global.post(
      "profile/update-portofolio",
      newFormData,
      (data) => {
        this.ngxService.stop();
        console.log(data);
        if (data.status) {
          this.global.showToast("", data.message);
          this.getProfileData();
          this.selectedPortfolio = "";
          this.getGenereType.clear();
          this.getIndustryType.clear();
          this.fillForm({}, formdata._id);
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

  focusTagInput(): void {
    this.tagInputRef.nativeElement.focus();
  }

  onKeyUp(event: KeyboardEvent): void {
    const inputValue: string = this.formData.controls.tag.value;
    if (event.code === "Backspace" && !inputValue) {
      this.removeTag();
      return;
    } else {
      if (event.code === "Space") {
        this.addTag(inputValue);
        this.formData.controls.tag.setValue("");
      }
    }
  }

  addTag(tag: string): void {
    if (tag[tag.length - 1] === "," || tag[tag.length - 1] === " ") {
      tag = tag.slice(0, -1);
    }

    tag = tag.replace(/,/g, " ");

    if (
      tag.length > 0 &&
      (this.tags.indexOf(tag) == -1 || this.tags.length == 0)
    ) {
      this.tags.push(tag);
    }
  }

  removeTag(tag?: string): void {
    if (!!tag) {
      pull(this.tags, tag);
    } else {
      this.tags.splice(-1);
    }
  }

  checkIfVideoExistws(url, callback) {
    $.ajax({
      type: "GET",
      url: "https://vimeo.com/api/oembed.json?url=" + encodeURIComponent(url),
      dataType: "json",
      complete: function (xhr) {
        callback(xhr.status);
      },
    });
  }

  checkIfVideoExists(url, successCallback, failedCallback) {
    // localStorage.removeItem("blogData");
    let headers = new Headers({});

    let options = new RequestOptions({
      headers: headers,
    });
    this.http
      .get(
        "https://vimeo.com/api/oembed.json?url=" + encodeURIComponent(url),
        options
      )
      .map((res) => res.json())
      .subscribe(
        (data) => {
          successCallback(data);
        },
        (err) => {
          failedCallback(err);
        }
      );
  }

  triggerFile() {
    $("#file-input").trigger("click");
  }

  // uploadFile(event) {
  //   var input: any = event.target.files;
  //   console.log(event)
  //   Array.from(event.target.files).forEach((item: Blob, i) => {
  //     var reader = new FileReader();
  //     reader.onload = () => {
  //       var dataURL: any = reader.result;
  //       this.imagesToShow.push(dataURL);
  //       this.images.push(item)
  //     }
  //     reader.readAsDataURL(item);
  //   })
  // }

  removePortfolio(id) {
    if (confirm("Are you sure to delete the portfolio ?")) {
      let newFormData = new FormData();
      newFormData.append("user_id", this.global.user._id);
      newFormData.append("portfolio_id", id);
      this.ngxService.start();
      this.global.post(
        "profile/remove-portofolio",
        newFormData,
        (data) => {
          this.ngxService.stop();
          console.log(data);
          if (data.status) {
            this.getGenereType.clear();
            this.getIndustryType.clear();
            this.getProfileData();
            this.global.showToast("", data.message);
            this.selectedPortfolio = "";
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

  getVimeoId(url) {
    if (!url) return;
    var match = url.match(/^.+vimeo.com\/(.*\/)?([^#\?]*)/);
    url = "https://player.vimeo.com/video/";
    return match
      ? this.sanitizer.bypassSecurityTrustResourceUrl(url + match[2]) ||
      this.sanitizer.bypassSecurityTrustResourceUrl(url + match[1])
      : null;
  }

  disabledEmojiSpace() {
    $(document).ready(function () {
      $("body").on("click", ".dropdown-menu", function (e) {
        $(this).parent().is(".show") && e.stopPropagation();
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

  scroll(id) {
    console.log(`scrolling to ${id}`);
    let el = document.getElementById(id);
    el.scrollIntoView({ behavior: "smooth", block: "center", inline: "start" });
  }
}
