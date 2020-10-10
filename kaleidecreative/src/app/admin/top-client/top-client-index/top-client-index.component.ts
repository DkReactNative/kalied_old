import { Component, OnInit } from '@angular/core';
import { MyservicesService } from "../../../myservices.service";
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
import * as jQuery from 'jquery'
@Component({
  selector: 'app-top-client-index',
  templateUrl: './top-client-index.component.html',
  styleUrls: ['./top-client-index.component.css']
})
export class TopClientIndexComponent implements OnInit {
  user;
  globalSettings;
  globals = environment;

  pageTitle = "Top Client"
  pageSlug = "admin/homeslider/toptier/"
  page = 1;
  perPage = 10;
  totalPages = 1;
  pagination = [];
  data: any = {};
  searchData = {
    title: '',
  }

  constructor(
    private myservices: MyservicesService,
    private toster: ToastrService
  ) {
    this.user = JSON.parse(localStorage.getItem('CFadminuserData'));
    this.globalSettings = JSON.parse(localStorage.getItem('CFglobalSettings'));
  }

  ngOnInit() {
    this.disabledEmojiSpace() 
    this.myservices.checkAdminLogin();
    this.getRecords(this.myservices.pageIndex?this.myservices.pageIndex:1);
  }
 
  getRecords =  (page) => {
    this.page = page
    this.myservices.pageIndex=page;
     this.myservices.get(this.pageSlug+page ,response=>{       
     this.data = response.response;
     this.perPage = response.response.perPage
     this.totalPages = response.response.pages
     this.pagination = Array.from({ length: response.response.pages }, (v, k) => k + 1);
    },err=>{},true)
  }

  deleteRecord = async (Id, Indexis) => {
    if (confirm('Are you sure you want to Delete record?')) {
      await this.myservices.delete(this.pageSlug +Id,response =>{
        if (response.status == 1) {
          if (Indexis !== -1) {
            this.data.terms.splice(Indexis, 1);
          }
          this.toster.success(response.message);
        } else {
          this.toster.error('There was a error please try after some time');
        }
      },err=>{},true)
    } 
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
