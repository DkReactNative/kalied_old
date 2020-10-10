import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService} from 'ngx-ui-loader';
import { MyservicesService } from "../../../myservices.service";
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
declare var $: any;
import * as jQuery from 'jquery'
@Component({
  selector: 'app-admin-client-edit',
  templateUrl: './admin-client-edit.component.html',
  styleUrls: ['./admin-client-edit.component.css']
})
export class AdminClientEditComponent implements OnInit {
  user;
  globalSettings;
  globals = environment;

  pageTitle = "Client"
  pageSlug = "admin/userManage/search"
  user_id;
  imageUrl;
  data;
  newRecordByAdmin:any = {
    first_name: '',
    last_name:"",
    email: '',
    phoneno:"",
    appearas:"",
    companyname:'',
    password: '',
    confirm_password: '',
    image: '',
    businesstype: '',
    business_summary:'',
    address:'',
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ngxService: NgxUiLoaderService,
    private myservices: MyservicesService,
    private toastr: ToastrService,
  ) {
    this.user_id = this.route.snapshot.params.userId;    
    this.user = JSON.parse(localStorage.getItem('CFadminuserData'));
    this.globalSettings = JSON.parse(localStorage.getItem('CFglobalSettings'));
   }
   async ngOnInit() {
    this.disabledEmojiSpace()
    this.myservices.checkAdminLogin();
    if (this.user_id) {
      //let formData = new FormData();
     // formData.append("user_id", this.user_id);
      await this.myservices.get("admin/userManage/" +this.user_id, response =>{              
        this.data = response.response;
        this.newRecordByAdmin = response.response;
        this.newRecordByAdmin.password = "";
      },err =>{},true)
    }
  } 
 

  newRecordSubmit = async (formData) => {
    var newFormData = new FormData();
    newFormData.append("first_name", formData.first_name.trim())
    newFormData.append("role", "2")
    newFormData.append("last_name", formData.last_name.trim())
    newFormData.append("email", formData.email)
    newFormData.append("companyname",formData.companyname.trim())
    newFormData.append("appearas",formData.appearas)
    newFormData.append("phoneno",formData.phoneno)
    newFormData.append("businesstype",formData.businesstype)
    newFormData.append("business_summary",formData.business_summary)
    newFormData.append("address",formData.address)
    if (this.imageUrl) { newFormData.append('image', this.imageUrl); }
    this.ngxService.start();
    await this.myservices.put('admin/userManage/'+this.user_id, newFormData,response =>{
      this.ngxService.stop();
      if (response.status == 1) {
        this.router.navigate(['/admin/client']);
        this.toastr.success(response.message);
      } else {
        this.toastr.error(response.message);
        let message="";
            response.response.map(ele => {
            message+=Object.values(ele)+". "
            })
      this.toastr.error("",message);
      }},err =>{},true)
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


