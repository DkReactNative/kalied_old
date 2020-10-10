import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
pageData:any=null;
  constructor(public global:GlobalService,private ngxService: NgxUiLoaderService) {
    this.getPageData()
   }

  ngOnInit() {
  }

   generateFaq(id, answer) {
    document.getElementById(id).innerHTML = answer;
  }
getPageData(page=1) {
      this.global.get(
        "staticpage/faq/"+page,
        data => {
          this.ngxService.stop();   
          console.log(data);
          if (data.status) {
            this.pageData=data.response?data.response:null
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
