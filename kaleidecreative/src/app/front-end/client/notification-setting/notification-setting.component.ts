import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../global.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-notification-setting',
  templateUrl: './notification-setting.component.html',
  styleUrls: ['./notification-setting.component.css']
})
export class NotificationSettingComponent implements OnInit {
  notification;
  constructor(public global:GlobalService,private ngxService: NgxUiLoaderService) { }

  ngOnInit() {
  this.notification=this.global.user.notification;
  }
   
   updateProfile(){
    let newFormData = new FormData();
    newFormData.append("notification" , this.notification? '1':'0');
    newFormData.append("id" , this.global.user._id);
    this.ngxService.start();   
    this.global.post(
      "profile/notification-setting",
      newFormData,
      data => {
        this.ngxService.stop();
        console.log(data)
        if (data.status) {
              this.global.showToast("", data.message);
        } else {
          this.global.showDangerToast("",data.message);
        }
      },
      err => {
        this.ngxService.stop();
        this.global.showDangerToast("", err.message);
      },
      true
    );

     }
}
