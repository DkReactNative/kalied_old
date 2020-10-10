import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone,
  Pipe,
} from "@angular/core";
import { GlobalService } from "../../global.service";
import { DomSanitizer } from "@angular/platform-browser";
import { Router, ActivatedRoute } from "@angular/router";
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
declare var $: any;
@Pipe({
  name: "safe",
})
@Component({
  selector: "app-step-two",
  templateUrl: "./step-two.component.html",
  styleUrls: ["./step-two.component.css"],
})
export class ProjectStepTwoComponent implements OnInit {
  projectId;
  isProjectForEdit: any = false;
  formData;
  uploadedImage: any = [];
  images: any = [];
  pdf: any = [];
  removedImages: any = [];
  removedPdf: any = [];
  formSubmitAttempt: any = false;
  validVimeo: any = true;
  imagePdfUrl;
  vimeoPattern = /(http|https)?:\/\/(www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|)(\d+)(?:|\/\?)/;

  constructor(
    private route: Router,
    private router: ActivatedRoute,
    public global: GlobalService,
    private formBuilder: FormBuilder,
    private ngxService: NgxUiLoaderService,
    private sanitizer: DomSanitizer
  ) {
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
  }

  ngOnInit() {
    this.disabledEmojiSpace();
    this.formData = this.formBuilder.group({
      _id: new FormControl(),
      video: this.formBuilder.array([
        this.formBuilder.group({
          url: new FormControl("", [
            Validators.required,
            CustomValidators.url,
            Validators.pattern(this.vimeoPattern),
            CustomValidators.rangeLength([1, 200]),
          ]),
          description: new FormControl("", [
            Validators.required,
            CustomValidators.rangeLength([3, 1000]),
          ]),
        }),
      ]),
    });
    this.getProjectInfo();
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
          if (response.current_step >= 2) {
            this.formData.get("_id").setValue(response._id, {
              onlySelf: true,
            });
            if (response.video.length > 0) {
              this.deleteVideo(0);
            }
            response.video.map((ele) => {
              this.Video.push(
                this.formBuilder.group({
                  url: new FormControl(ele.url, [
                    Validators.required,
                    CustomValidators.url,
                    Validators.pattern(this.vimeoPattern),
                    CustomValidators.rangeLength([1, 200]),
                  ]),
                  description: new FormControl(ele.description, [
                    Validators.required,
                    CustomValidators.rangeLength([3, 1000]),
                  ]),
                })
              );
            });
            this.imagePdfUrl = response.image_pdf_path;
            let images = response.images.map((ele) => {
              let obj = {};
              obj["image"] = ele;
              obj["status"] = 1;
              return obj;
            });

            let pdfs = response.files.map((ele) => {
              let obj = {};
              obj["pdf"] = ele;
              obj["status"] = 1;
              return obj;
            });
            this.uploadedImage.push(...images, ...pdfs);
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
  uploadFile(event) {
    var input = event.target.files;
    console.log(event);
    Array.from(event.target.files).forEach((item: File, i) => {
      var reader = new FileReader();
      reader.onload = () => {
        var dataURL: any = reader.result;
        const name = item.name;
        const lastDot = name.lastIndexOf(".");
        const ext = name.substring(lastDot + 1);
        if (ext == "pdf" || ext == "PDF") {
          this.uploadedImage.push({ pdf: dataURL });
          this.pdf.push({ pdf: item });
        } else if (
          ext == "jpeg" ||
          ext == "JPEG" ||
          ext == "jpg" ||
          ext == "JPG" ||
          ext == "png" ||
          ext == "PNG"
        ) {
          this.uploadedImage.push({ image: dataURL });
          this.images.push({ image: item });
        }
      };
      reader.readAsDataURL(item);
    });
  }

  get Video() {
    return this.formData.get("video") as FormArray;
  }

  addVideo() {
    if (!this.formData.valid || !this.validVimeo) {
      this.formSubmitAttempt = true;
      return;
    }
    this.formSubmitAttempt = false;
    console.log(this.Video.controls);
    this.Video.push(
      this.formBuilder.group({
        url: new FormControl("", [
          Validators.required,
          CustomValidators.url,
          Validators.pattern(this.vimeoPattern),
          CustomValidators.rangeLength([1, 200]),
        ]),
        description: new FormControl("", [
          Validators.required,
          CustomValidators.rangeLength([3, 1000]),
        ]),
      })
    );
  }

  deleteVideo(index) {
    this.Video.removeAt(index);
  }

  deleteFile(data, index) {
    // check whether the image/pdf already uploaded or not if yes then store in removedImages
    console.log(data);
    if (data.status) {
      if (data.pdf) {
        this.removedPdf.push(data.pdf);
      } else {
        this.removedImages.push(data.image);
      }
    }
    if (data.pdf) {
      this.pdf.splice(index, 1);
    }
    if (data.image) {
      this.images.splice(index, 1);
    }
    this.uploadedImage.splice(index, 1);
  }

  onClickSubmit(formdata) {
    if (!this.formData.valid || !this.validVimeo) {
      this.formSubmitAttempt = true;
      return;
    }

    this.formSubmitAttempt = false;
    let newFormData = new FormData();

    if (this.removedImages.length > 0) {
      newFormData.append("removedImage", JSON.stringify(this.removedImages));
    }

    if (this.removedPdf.length > 0) {
      newFormData.append("removedPdf", JSON.stringify(this.removedPdf));
    }

    newFormData.append("video", JSON.stringify(formdata.video));
    newFormData.append("project_id", formdata._id);
    newFormData.append("user_id", this.global.user._id);

    if (this.images.length > 0) {
      this.images.forEach((item, i) => {
        newFormData.append("image", item.image);
      });
    }
    if (this.pdf.length > 0) {
      this.pdf.forEach((item, i) => {
        newFormData.append("pdf", item.pdf);
      });
    }

    this.ngxService.start();
    this.global.post(
      "project/create-step2",
      newFormData,
      (data) => {
        this.ngxService.stop();
        console.log(data);
        if (data.status) {
          this.global.showToast("", data.message);
          this.route.navigate(
            this.isProjectForEdit
              ? ["/user/client/project/description/" + btoa(data.response._id)]
              : ["/user/project/create3" + "/" + btoa(data.response._id)],
            {
              replaceUrl: true,
            }
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

  getTrustedData(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  Btoa(id) {
    return btoa(id);
  }
}
