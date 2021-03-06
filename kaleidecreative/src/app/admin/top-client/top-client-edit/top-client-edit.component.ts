import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MyservicesService } from "../../../myservices.service";
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AngularEditorConfig } from '@kolkov/angular-editor';
declare var $: any;
import * as jQuery from 'jquery'

@Component({
  selector: 'app-top-client-edit',
  templateUrl: './top-client-edit.component.html',
  styleUrls: ['./top-client-edit.component.css']
})
export class TopClientEditComponent implements OnInit {

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

 pageTitle = "Top Clients"
  pageSlug = "admin/homeslider/toptier/"
  record_id;
  data;
  imageUrl;
  newRecordByAdmin:any = {
    answer:"",
    question:""
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
    this.disabledEmojiSpace()  
    this.myservices.checkAdminLogin();
    if (this.record_id) {      
      await this.myservices.get(this.pageSlug + "view/"+this.record_id,response =>{
        console.log(response.response);
        this.data = response.response;
        this.newRecordByAdmin = response.response;
      },err =>{},true)
    }
  }

  uploadFile(event) {
      var input = event.target;
      console.log(event)
      var reader = new FileReader();
      reader.onload = ()=>{
      var dataURL:any = reader.result;
      var output = document.getElementById('imageUrl');
      document.getElementById('imageUrl').setAttribute('src',dataURL)
      this.newRecordByAdmin.image=dataURL
      this.imageUrl=event.target.files[0]
    };
    reader.readAsDataURL(input.files[0]);
}


  newRecordSubmit = (formData) => {
    var newFormData = new FormData();
    newFormData.append("name", formData.name.trim())
    newFormData.append("company", formData.company.trim())
    newFormData.append("profession", formData.profession.trim())
    newFormData.append("about", formData.about)
     if(this.imageUrl){
       newFormData.append("image",this.imageUrl);
      }
 newFormData.append("id", this.record_id) 
    this.ngxService.start();
     this.myservices.post(this.pageSlug +'update' , newFormData, response =>{      
      this.ngxService.stop();
      if (response.status == 1) {
        this.router.navigate(['/admin/tierclients']);
        this.toastr.success(response.message);
      } else {
        this.toastr.error(response.message);
      }
    },err =>{},true)
  }
  disabledEmojiSpace(){
          $(document).ready(function(){

           var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
         
             
             var invalid = new RegExp(regex);
             // on keyup
             $('input').on("keyup", (e)=> {
               var response = invalid.test(e.target.value) ? "invalid" : "valid";
              
               e.target.value = e.target.value.replace(invalid, "");
               let value = e.target.value;
                        
                         value = value.trim();
                         if(!value){
                          e.target.value=value;
                          e.preventDefault()
                         }
             });

              $('textarea').on("keyup", (e)=> {
               var response = invalid.test(e.target.value) ? "invalid" : "valid";
              
               e.target.value = e.target.value.replace(invalid, "");
               let value = e.target.value;
                        
                         value = value.trim();
                         if(!value){
                          e.target.value=value;
                          e.preventDefault()
                         }
             });

            // on keydown
             $('input').on("keydown", (e)=> {
               var response = invalid.test(e.target.value) ? "invalid" : "valid";
               
               e.target.value = e.target.value.replace(invalid, "");
               let value = e.target.value;
               if(e.which==32 || value=='on'){
                        
                         value =value.trim();
                         if(!value){
                          e.target.value=value;
                          e.preventDefault()
                         }
                       
                       }
                
             });

             $('textarea').on("keydown", (e)=> {
               var response = invalid.test(e.target.value) ? "invalid" : "valid";
               
               e.target.value = e.target.value.replace(invalid, "");
               let value = e.target.value;
               if(e.which==32 || value=='on'){
                        
                         value =value.trim();
                         if(!value){
                          e.target.value=value;
                          e.preventDefault()
                         }
                       
                       }
                
             });

             // on paste
             $('input').on("paste", (e)=> {
               var response = invalid.test(e.target.value) ? "invalid" : "valid";
                
                console.log("paste:", response,e);
                e.target.value = e.target.value.replace(invalid, "");
                let clipboardData = e.originalEvent.clipboardData.getData('text');

                console.log(clipboardData)

                if(invalid.test(clipboardData)){ 

                e.preventDefault()
                
                }
               
             });

             $('textarea').on("paste", (e)=> {
               var response = invalid.test(e.target.value) ? "invalid" : "valid";
                
                console.log("paste:", response,e);
                e.target.value = e.target.value.replace(invalid, "");
                let clipboardData = e.originalEvent.clipboardData.getData('text');

                console.log(clipboardData)

                if(invalid.test(clipboardData)){ 

                e.preventDefault()
                
                }
               
             });

             

             // on blur
             $('textarea').on("blur", (e)=> {
               var response = invalid.test(e.target.value) ? "invalid" : "valid";
               
               e.target.value = e.target.value.replace(invalid, "");
             });

             $('input').on("blur", (e)=> {
               var response = invalid.test(e.target.value) ? "invalid" : "valid";
               
               e.target.value = e.target.value.replace(invalid, "").trim();
             });
            });
       }
}
