import { Component, OnInit ,Input} from '@angular/core';
import { Router } from "@angular/router";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from "@angular/forms";
import { GlobalService } from '../../global.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-profile-setup',
  templateUrl: './profile-setup.component.html',
  styleUrls: ['./profile-setup.component.css']
})
export class ProfileSetupComponent implements OnInit {
     @Input() user;
     @Input() active;
  constructor(private route: Router,public global: GlobalService,private formBuilder: FormBuilder,private ngxService: NgxUiLoaderService) { 
    this.global.hideNavBars=false
    let user :any = localStorage.getItem(btoa("user-kc")) ? localStorage.getItem(btoa("user-kc")) : null;
    user = JSON.parse(user);
    if (!user || user.role!=3) {
      this.route.navigate(["/user"], { replaceUrl: true });    }
  }

  ngOnInit() {
  console.log('client')
  }

}