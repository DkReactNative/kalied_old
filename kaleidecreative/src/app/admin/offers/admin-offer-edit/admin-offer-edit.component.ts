import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MyservicesService } from "../../../myservices.service";
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-admin-offer-edit',
  templateUrl: './admin-offer-edit.component.html',
  styleUrls: ['./admin-offer-edit.component.css']
})
export class AdminOfferEditComponent implements OnInit {
  user;
  globalSettings;
  globals = environment;
  /** Text Editor Config Start **/
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '25rem',
    minHeight: '5rem',
    placeholder: 'Enter Content...',
    translate: 'no',
    defaultFontName: 'Comic Sans MS',
    showToolbar: true,
    uploadUrl: 'v1/images',
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };
  /** Text Editor Config End **/

  pageTitle = "CMS Page"
  pageSlug = "cmspage"
  record_id;
  data;
  newRecordByAdmin = {
    title: '',
    content: '',
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ngxService: NgxUiLoaderService,
    private myservices: MyservicesService,
    private toastr: ToastrService,
  ) {
    this.record_id = this.route.snapshot.params.id;
    this.user = JSON.parse(localStorage.getItem('CFadminuserData'));
    this.globalSettings = JSON.parse(localStorage.getItem('CFglobalSettings'));
  }

  async ngOnInit() {
    this.myservices.checkAdminLogin();
    if (this.record_id) {
      let formData = new FormData();
      formData.append("record_id", this.record_id);
      await this.myservices.adminApiCall(this.pageSlug + "/view", formData).then((response) => {
        console.log(response);
        this.data = response.response;
        this.newRecordByAdmin = response.response.records;
      });
    }
  }

  newRecordSubmit = async (formData) => {
    var newFormData = new FormData();
    newFormData.append("record_id", this.record_id)
    newFormData.append("title", formData.title)
    newFormData.append("content", formData.content)
    this.ngxService.start();
    await this.myservices.adminApiCall(this.pageSlug + "/update", newFormData).then((response) => {
      this.ngxService.stop();
      if (response.status == 1) {
        this.router.navigate(['/admin/' + this.pageSlug]);
        this.toastr.success(response.message);
      } else {
        this.toastr.error(response.message);
      }
    });
  }
}
