import { GlobalService } from '../global.service';
import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from "@angular/forms";
declare var $: any;
import * as jQuery from 'jquery';
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
pageData:any=null;
 constructor(public global:GlobalService,private ngxService: NgxUiLoaderService) {
    this.getPageData()
   }

  ngOnInit() {
  this.disabledEmojiSpace()
  }
form:any={
  
}
getPageData() {
 this.ngxService.start();  
      this.global.get(
        "staticpage/contact-us",
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
  
  submit(f){
          this.ngxService.start();  
          setTimeout(()=>{
          this.form = { }
          f.resetForm();
          this.ngxService.stop();  
          console.log(f.value)
          this.global.showToast(
                      "",
                      'Message sent successfully'
                    );
          },1000)
    }
 disabledEmojiSpace(){
     
     var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
   
     $(document).ready(function(){
             $("input").keydown((event)=>{
                   console.log(event)
                  let value = event.target.value;
                     if(regex.test(value) || value=='on'){
                      value = value.replace(regex, '');
                      console.log(value)
                      event.target.value=value;
                      event.preventDefault();
                      console.log(value)
                  }
                 if(event.which==32 || value=='on'){
                  console.log(event.target.value)
                   value =value.trim();
                   if(!value){
                    event.target.value=value;
                    event.preventDefault()
                   }
                 
                 }
              });

               $("textarea").keydown((event)=>{
                let value = event.target.value;
                     if(regex.test(value)){
                      value = value.replace(regex, '');
                      console.log(value)
                      event.target.value=value;
                      event.preventDefault();
                      console.log(value)
                  }
                 if(event.which==32){ 
                  console.log(event.target.value)
                   value =value.trim();
                   if(!value){
                    event.target.value=value;
                    event.preventDefault()
                   }
                 
                 }
              });

              $('input').on('paste',(event)=>{
                 console.log("pasted",event)
                 let character ='e'
                  $('input').trigger("keydown");
                  $('textarea').trigger("keydown");
                  let value = event.target.value;
                       if(regex.test(value)){
                        value = value.replace(regex, '');
                        console.log(value)
                        event.target.value=value;
                        event.preventDefault();
                        console.log(value)
                    }
                })

                $('input').change((event)=>{
                      let value = event.target.value;
                      $('input').trigger("keydown");
                      $('textarea').trigger("keydown");
                     if(regex.test(value)){
                      value = value.replace(regex, '');
                      console.log(value)
                      event.target.value=value;
                      event.preventDefault();
                      console.log(value)
                  }
              })

              $('textarea').on('paste',(event)=>{
                 console.log("pasted",event)
                 let character ='e'
                  $('textarea').trigger("keydown");
                  let value = event.target.value;
                       if(regex.test(value)){
                        value = value.replace(regex, '');
                        console.log(value)
                        event.target.value=value;
                        event.preventDefault();
                        console.log(value)
                    }
                })

                $('textarea').change((event)=>{
                      let value = event.target.value;
                      $('textarea').trigger("keydown");
                     if(regex.test(value)){
                      value = value.replace(regex, '');
                      console.log(value)
                      event.target.value=value;
                      event.preventDefault();
                      console.log(value)
                  }
              })
      });
  }

}
