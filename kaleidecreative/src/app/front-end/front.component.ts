import { Component, OnInit } from '@angular/core';
import { GlobalService } from './global.service';

@Component({
  selector: 'app-front',
  templateUrl: './front.component.html',
  styleUrls: ['./front.component.css']
})
export class FrontComponent implements OnInit {

  constructor(public global:GlobalService) { 
    var now = new Date().getTime();
    var setupTime = localStorage.getItem('setupTime-kc');
    console.log(now - parseInt(setupTime), this.global.setupHours)
    if (setupTime == null) {
      localStorage.setItem('setupTime-kc', this.global.setupTime + "")
    } else {
      if (now - (parseInt(setupTime)) > this.global.setupHours) {
        localStorage.clear()
        localStorage.setItem('setupTime-kc', this.global.setupTime + "");
      }
    }
    let user:any = localStorage.getItem(btoa("user-kc")) ? localStorage.getItem(btoa("user-kc")) : null;
    user = user  ? JSON.parse(user) : null;
    let AuthToken = localStorage.getItem(btoa("AuthToken-kc")) ? localStorage.getItem(btoa("AuthToken-kc")) : null;
    if (user) {
      this.global.user = user;
      this.global.AuthToken = AuthToken;
      this.global.isLogin = true;
      this.global.loginTime=new Date()
    }
        this.global.getConfigData();
  }
  
  ngOnInit() {
    console.log(window.location.href)
  }

}
