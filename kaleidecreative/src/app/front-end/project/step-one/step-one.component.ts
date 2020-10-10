import { OnInit, Component, ElementRef, ViewChild } from "@angular/core";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete,
} from "@angular/material/autocomplete";
import { GlobalService } from "../../global.service";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormArray,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  ReactiveFormsModule,
} from "@angular/forms";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { CustomValidators } from "ng2-validation";
import { MatChipInputEvent } from "@angular/material/chips";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import "lodash";
declare var _: any;
declare var $: any;
@Component({
  selector: "app-step-one",
  templateUrl: "./step-one.component.html",
  styleUrls: ["./step-one.component.css"],
})
export class ProjectStepOneComponent implements OnInit {
  @ViewChild("fruitInput", { static: true }) fruitInput: ElementRef<
    HTMLInputElement
  >;
  @ViewChild("auto", { static: true }) matAutocomplete: MatAutocomplete;
  projectId = "";
  isProjectForEdit: any = false;
  visible = true;
  formSubmitAttempt: any = false;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredSkills: Observable<any>;
  skills: any = [];
  allSkills: any = [];
  formData;
  constructor(
    private route: Router,
    public global: GlobalService,
    private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private ngxService: NgxUiLoaderService
  ) {
    this.router.paramMap.subscribe((params) => {
      console.log(params.get("id"), atob(params.get("id")));
      let str: any = params.get("id") ? atob(params.get("id")) : "";
      console.log("params => ", str);
      if (str.includes("~")) {
        str = str.split("~");
        str = str[0];
        this.isProjectForEdit = true;
      }
      if (str && params.get("id") != "create1") {
        this.projectId = str;
        console.log(this.projectId);
      }
    });
    this.getProfileContent();
  }

  ngOnInit() {
    this.disabledEmojiSpace();
    $(document).ready(() => {
      $(".example-chip-list").click(() => {
        $("#mat-input").focus();
      });

      $("#mat-input").focus((e) => {
        $(".example-chip-list").addClass("form-field");
      });

      $("#mat-input").blur((e) => {
        $(".example-chip-list").removeClass("form-field");
      });
    });

    this.formData = this.formBuilder.group({
      _id: new FormControl(),

      title: new FormControl("", [
        Validators.required,
        CustomValidators.rangeLength([3, 55]),
      ]),

      description: new FormControl("", [
        Validators.required,
        CustomValidators.rangeLength([3, 1000]),
      ]),

      skill: new FormControl(),

      style: new FormControl("", [
        Validators.required,
        CustomValidators.rangeLength([3, 1000]),
      ]),

      background: new FormControl("", [
        Validators.required,
        CustomValidators.rangeLength([3, 1000]),
      ]),
    });
    this.filteredSkills = this.formData.get("skill").valueChanges.pipe(
      startWith(null),
      map((fruit: any | null) => (fruit ? this._filter(fruit) : this.allSkills))
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
          this.formData.get("_id").setValue(response._id);
          this.formData.get("title").setValue(response.title);
          this.formData.get("description").setValue(response.description);
          this.formData.get("style").setValue(response.style);
          this.formData.get("background").setValue(response.background);
          response.skills = response.skills.map((ele) => ele._id);
          this.skills = this.allSkills.filter((ele) => {
            if (
              response.skills.includes(JSON.parse(JSON.stringify(ele.value)))
            ) {
              return ele;
            }
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

  update(formdata) {
    console.log(this.formData);
    if (!this.formData.valid || this.skills.length == 0) {
      this.formSubmitAttempt = true;
      return;
    }
    let newFormData = new FormData();
    newFormData.append("title", formdata.title);
    newFormData.append("description", formdata.description);
    newFormData.append("style", formdata.style);
    newFormData.append("background", formdata.background);
    newFormData.append("project_id", formdata._id);
    newFormData.append("user_id", this.global.user._id);
    newFormData.append(
      "skills",
      JSON.stringify(this.skills.map((ele) => ele.value))
    );
    console.log(JSON.stringify(newFormData));
    this.ngxService.start();
    this.global.post(
      "project/create-step1",
      newFormData,
      (data) => {
        this.ngxService.stop();
        console.log(data);
        if (data.status) {
          this.global.showToast("", data.message);

          this.route.navigate(
            this.isProjectForEdit
              ? ["/user/client/project/description/" + btoa(data.response._id)]
              : ["/user/project/create2/" + btoa(data.response._id)],
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

  getProfileContent() {
    this.ngxService.start();
    this.global.get(
      "profileContent/allContent",
      (data) => {
        this.ngxService.stop();
        console.log(data);
        if (data.status) {
          let user = data.response;
          this.allSkills.push(...user.primarySkills);
          // this.allSkills.push(...user.secondarySkills);
          this.allSkills = _.uniqBy(this.allSkills, "name");
          console.log(this.allSkills);
          this.allSkills = this.allSkills.sort((a, b) => {
            return a.name.localeCompare(b.name);
          });
          console.log(this.allSkills);
          if (this.projectId) {
            this.getProjectInfo();
          }
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

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if (value) {
      this.skills.push(value);
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }

    this.formData.get("skill").setValue(null);
  }

  remove(value: any): void {
    let index;
    this.skills.filter((ele, i) => {
      if (ele.value == value) {
        index = i;
      }
    });
    if (index >= 0) {
      this.skills.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    $("#mat-input").blur();

    this.skills.push(event.option.value);

    let jsonObject = this.skills.map(JSON.stringify);

    let uniqueSet = new Set(jsonObject);

    this.skills = Array.from(uniqueSet).map((ele: any) => {
      return JSON.parse(ele);
    });

    this.fruitInput.nativeElement.value = "";

    this.formData.get("skill").setValue(null);
  }

  private _filter(value: any): string[] {
    value = value.value ? value.value : value;
    const filterValue = value.toLowerCase();

    return this.allSkills.filter((fruit) => {
      if (fruit.name.toLowerCase().indexOf(filterValue) == 0) {
        return fruit;
      }
    });
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

  Btoa(id) {
    return btoa(id);
  }

  active(item) {
    let status = false;
    this.skills.filter((ele) => {
      if (ele.value == item.value) {
        status = true;
      }
    });
    console.log(item.name, " status ", status);
    return status;
  }
}
