import { Component, OnInit ,Input} from '@angular/core';
import { Router } from "@angular/router";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from "@angular/forms";
import { GlobalService } from '../global.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-freelancer-root',
  templateUrl: './freelancer-root.component.html',
  styleUrls: ['./freelancer-root.component.css']
})
export class FreelancerRootComponent implements OnInit {
     @Input() user;
     @Input() active;
  constructor(private route: Router,public global: GlobalService,private formBuilder: FormBuilder,private ngxService: NgxUiLoaderService) { 
    this.global.hideNavBars=false
    let user :any = localStorage.getItem(btoa("user-kc")) ? localStorage.getItem(btoa("user-kc")): null;
    user = user ? JSON.parse(user) : null;
    if (!user || user.role!=3) {
      this.route.navigate(["/user"], { replaceUrl: true });    
    } else if(!this.global.user.profile_setup && this.global.user.role==3){
         let num = this.global.user.current_step ? this.global.user.current_step:1;
                    this.route.navigate(['/user/freelancer/set-up/'+num])
        } 
    }

  ngOnInit() {
  console.log('client')
  }

}