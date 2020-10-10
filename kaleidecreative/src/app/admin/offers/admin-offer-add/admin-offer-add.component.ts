import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MyservicesService } from "../../../myservices.service";
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-admin-offer-add',
  templateUrl: './admin-offer-add.component.html',
  styleUrls: ['./admin-offer-add.component.css']
})
export class AdminOfferAddComponent implements OnInit {
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
    // uploadUrl: 'v1/images',
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

  pageTitle = "Offer"
  pageSlug = "offer"
  user_id;
  imageUrl;
  newRecordByAdmin = {
    title: '',
    type: 'text',
    content: '',
    image: '',
    video: '',
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ngxService: NgxUiLoaderService,
    private myservices: MyservicesService,
    private toastr: ToastrService,
  ) {
    this.user = JSON.parse(localStorage.getItem('CFadminuserData'));
    this.globalSettings = JSON.parse(localStorage.getItem('CFglobalSettings'));
  }

  async ngOnInit() {
    this.myservices.checkAdminLogin();
  }

  uploadFile(key,event) {
    if (event.target.files && event.target.files[0]) {
      this.newRecordByAdmin[key] = <File>event.target.files[0];
    }
  }

  newRecordSubmit = async (formData) => {
    var newFormData = new FormData();
    newFormData.append("title", formData.title)
    newFormData.append("type", formData.type)
    var contentExist = ""
    if(formData.type == "image"){
      newFormData.append("content", this.newRecordByAdmin.image)
      contentExist = this.newRecordByAdmin.image
    }else if(formData.type == "video"){
      newFormData.append("content", this.newRecordByAdmin.video)
      contentExist = this.newRecordByAdmin.video
    }else{
      newFormData.append("content", formData.content)
      contentExist = formData.content
    }
    if (contentExist.length > 0 || typeof (contentExist.length) == "undefined"){
      this.ngxService.start();
      await this.myservices.adminApiCall(this.pageSlug + "/create", newFormData).then((response) => {
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

}
