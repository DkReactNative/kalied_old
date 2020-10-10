import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone,
  Pipe,
} from "@angular/core";
import { MyservicesService } from "../../../myservices.service";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { MapsAPILoader, MouseEvent } from "@agm/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CustomValidators } from "ng2-validation";
import { find, get, pull } from "lodash";
import { Http, Headers, RequestOptions } from "@angular/http";
import { ToastrService } from "ngx-toastr";
import "rxjs/add/operator/map";
import { DomSanitizer } from "@angular/platform-browser";
declare var $: any;
import * as jQuery from "jquery";

@Pipe({
  name: "safe",
})
@Component({
  selector: "app-edit",
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.css"],
})
export class PortFolioEditComponent implements OnInit {
  @ViewChild("tagInput", { static: false }) tagInputRef: ElementRef;

  user;
  globalSettings;

  tags: string[] = [];
  formData;
  formSubmitAttempt: any = false;
  availability: any = null;
  validVimeo: any = true;
  images: any = [];
  imagesToShow: any = [];
  pageTitle = "PortFolio";
  pageSlug = "admin/portfolio/";
  record_id;
  loader: any = false;

  projectType: any = [];
  genereType = [];
  industryType = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ngxService: NgxUiLoaderService,
    private myservices: MyservicesService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer,
    public http: Http
  ) {
    console.log("i am constructor");
    this.record_id = this.route.snapshot.params.id;
    this.user = JSON.parse(localStorage.getItem("CFadminuserData"));
    this.globalSettings = JSON.parse(localStorage.getItem("CFglobalSettings"));
  }

  async ngOnInit() {
    console.log("i am ngOnIt");
    this.disabledEmojiSpace();
    this.myservices.checkAdminLogin();

    if (this.record_id) {
      this.getProfileData(this.record_id);
    }

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
          this.formData
            .get("thumbImage")
            .setValue(data.thumbnail_url_with_play_button);
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

      videoUrl: new FormControl("", [
        Validators.required,
        CustomValidators.url,
        Validators.pattern(vimeoPattern),
      ]),

      projectType: new FormControl("", Validators.required),

      industry: new FormControl("", Validators.required),

      genere: new FormControl("", Validators.required),

      _id: new FormControl(),

      userId: new FormControl(),
    });
  }

  changeOption(e, key) {
    this.formData.get(key).setValue(e.target.value, {
      onlySelf: true,
    });
  }

  getProfileData(id) {
    this.ngxService.start();
    this.myservices.get(
      "admin/userManage/portfolio/" + id,
      (data) => {
        this.ngxService.stop();
        console.log(data);
        if (data.status) {
          let user = data.response;

          this.formData
            .get("videoUrl")
            .setValue(user.video_url ? user.video_url : "");

          this.formData
            .get("projectType")
            .setValue(user.project_type ? user.project_type : "");

          this.formData
            .get("industry")
            .setValue(user.industry ? user.industry : "");

          this.formData.get("genere").setValue(user.genre ? user.genre : "");

          this.formData
            .get("_id")
            .setValue(user._id ? user._id : this.record_id);

          this.formData
            .get("userId")
            .setValue(user.user_id ? user.user_id : "");

          this.imagesToShow = user.images ? user.images : [];
          this.tags = user.tags ? user.tags : [];

          this.checkIfVideoExists(
            user.video_url,
            (data) => {
              console.log(data);
              this.validVimeo = true;
              document.getElementById("vimeoId").innerHTML = data.html;
            },
            (err) => {
              this.validVimeo = false;
              document.getElementById("vimeoId").innerHTML = "";
              console.log(err);
            }
          );
        } else {
          this.toastr.error(data.message);
        }
      },
      (err) => {
        this.ngxService.stop();
        this.toastr.error(err.message);
      },
      true
    );
  }

  onClickSubmit(formdata) {
    if (!this.formData.valid || !this.validVimeo) {
      this.formSubmitAttempt = true;
      return;
    }
    console.log(formdata);
    let newFormData = new FormData();
    newFormData.append("tags", JSON.stringify(this.tags));
    newFormData.append("videoUrl", formdata.videoUrl);
    newFormData.append("projectType", formdata.projectType);
    newFormData.append("industry", formdata.industry);
    newFormData.append("genere", formdata.genere);
    newFormData.append("user_id", formdata.userId);
    newFormData.append("updatedImage", JSON.stringify(this.imagesToShow));
    if (this.images.length > 0) {
      this.images.forEach((item, i) => {
        newFormData.append("image", item);
      });
    }

    this.ngxService.start();
    this.myservices.post(
      "admin/userManage/portfolio/update",
      newFormData,
      (data) => {
        this.ngxService.stop();
        console.log(data);
        if (data.status) {
          this.toastr.success(data.message);
          this.router.navigate(["/admin/portfolio"]);
        } else {
          this.toastr.error(data.message);
          let message = "";
          data.response.map((ele) => {
            message += Object.values(ele) + ". ";
          });
          this.toastr.error(message);
          console.log(data.message);
        }
      },
      (err) => {
        this.toastr.error(err.message);
      },
      true
    );
  }

  fillForm(object, id = "") {
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

    this.formData
      .get("industry")
      .setValue(object.industry ? object.industry : "");

    this.formData.get("genere").setValue(object.genre ? object.genre : "");

    this.formData
      .get("clientName")
      .setValue(object.client_name ? object.client_name : "");

    this.formData
      .get("projectName")
      .setValue(object.project_name ? object.project_name : "");

    this.tags = object.tags ? object.tags : [];

    if (object.project_type) {
      this.getGenereIndustryTypes(object.project_type);
    }

    this.scroll(id ? id : object.video_url ? "scroll" : "scroll-up");
  }

  getGenereIndustryTypes(id) {
    this.ngxService.start();
    this.myservices.get(
      "profileContent/industry-genre-all/" + id,
      (data) => {
        this.ngxService.stop();
        console.log(data);
        if (data.status) {
          let user = data.response;

          this.genereType = user.genereType;

          this.industryType = user.industryType;
        } else {
          this.toastr.error(data.message);
        }
      },
      (err) => {
        this.ngxService.stop();
        this.toastr.error(err.message);
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

  checkIfVideoExists(url, successCallback, failedCallback) {
    // localStorage.removeItem("blogData");
    let headers = new Headers({});

    let options = new RequestOptions({
      headers: headers,
    });

    this.loader = true;
    this.validVimeo = false;
    this.http
      .get(
        "https://vimeo.com/api/oembed.json?url=" + encodeURIComponent(url),
        options
      )
      .map((res) => res.json())
      .subscribe(
        (data) => {
          this.loader = false;
          successCallback(data);
        },
        (err) => {
          this.loader = false;
          failedCallback(err);
        }
      );
  }

  triggerFile() {
    $("#file-input").trigger("click");
  }

  uploadFile(event) {
    var input: any = event.target.files;
    console.log(event);
    Array.from(event.target.files).forEach((item: Blob, i) => {
      var reader = new FileReader();
      reader.onload = () => {
        var dataURL: any = reader.result;
        this.imagesToShow.push(dataURL);
        this.images.push(item);
      };
      reader.readAsDataURL(item);
    });
  }

  removeImage(i) {
    this.imagesToShow.splice(i, 1);
    this.images.splice(i, 1);
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
