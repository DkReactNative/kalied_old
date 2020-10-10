import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent implements OnInit {
 
  pageData:any=null;
  constructor(public global:GlobalService,private ngxService: NgxUiLoaderService) {
    this.getPageData()
 }

  ngOnInit() {
  }

getPageData() {
 let newFormData = new FormData();
      newFormData.append("slug",'privacy-policy')
      this.global.post(
        "cms",
        newFormData,
        data => {
          this.ngxService.stop();   
          console.log(data);
          if (data.status) {
            this.pageData=data.response?data.response[0]:null
            console.log(data);
            document.getElementById("cmspages_id").innerHTML = this.pageData['content'] ? this.pageData['content'] : null;
          } else {
            this.global.showDangerToast(
              "",
              data.message
            );
          }
        },
        err => {
          this.global.showDangerToast("", err.message);
        },
        true
      );
    }
}
