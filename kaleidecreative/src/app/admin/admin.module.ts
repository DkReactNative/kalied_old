import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  MatFormFieldModule,
  MatMenuModule,
  MatCheckboxModule,
  MatIconModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatInputModule,
} from "@angular/material";
import { AngularEditorModule } from "@kolkov/angular-editor";
import { AdminRoutingModule } from "./admin-routing.module";
import { AdminComponent } from "./admin.component";
import { AdminLoginComponent } from "./auth/admin-login/admin-login.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AdminRegisterComponent } from "./auth/admin-register/admin-register.component";
import { AdminForgotPasswordComponent } from "./auth/admin-forgot-password/admin-forgot-password.component";
import { AdminPasswordResetComponent } from "./auth/admin-password-reset/admin-password-reset.component";
import { AdminHeaderComponent } from "./includes/admin-header/admin-header.component";
import { AdminFooterComponent } from "./includes/admin-footer/admin-footer.component";
import { AdminSidebarComponent } from "./includes/admin-sidebar/admin-sidebar.component";
import { AdminProfileEditComponent } from "./admin-profile-edit/admin-profile-edit.component";
import { AdminGlobalSettingsComponent } from "./admin-global-settings/admin-global-settings.component";
import { AdminUserIndexComponent } from "./user/admin-user-index/admin-user-index.component";
import { AdminUserViewComponent } from "./user/admin-user-view/admin-user-view.component";
import { AdminUserAddComponent } from "./user/admin-user-add/admin-user-add.component";
import { AdminUserEditComponent } from "./user/admin-user-edit/admin-user-edit.component";
import { AdminCmsPagesIndexComponent } from "./cmspages/admin-cms-pages-index/admin-cms-pages-index.component";
import { AdminCmsPagesViewComponent } from "./cmspages/admin-cms-pages-view/admin-cms-pages-view.component";
import { AdminCmsPagesAddComponent } from "./cmspages/admin-cms-pages-add/admin-cms-pages-add.component";
import { AdminCmsPagesEditComponent } from "./cmspages/admin-cms-pages-edit/admin-cms-pages-edit.component";
import { AdminOfferIndexComponent } from "./offers/admin-offer-index/admin-offer-index.component";
import { AdminOfferAddComponent } from "./offers/admin-offer-add/admin-offer-add.component";
import { AdminOfferEditComponent } from "./offers/admin-offer-edit/admin-offer-edit.component";
import { AdminOfferViewComponent } from "./offers/admin-offer-view/admin-offer-view.component";
import { AdminEmailtemplateIndexComponent } from "./emailtemplates/admin-emailtemplate-index/admin-emailtemplate-index.component";
import { AdminEmailtemplateAddComponent } from "./emailtemplates/admin-emailtemplate-add/admin-emailtemplate-add.component";
import { AdminEmailtemplateEditComponent } from "./emailtemplates/admin-emailtemplate-edit/admin-emailtemplate-edit.component";
import { AdminEmailtemplateViewComponent } from "./emailtemplates/admin-emailtemplate-view/admin-emailtemplate-view.component";
import { AdminClientIndexComponent } from "./clients/admin-client-index/admin-client-index.component";
import { AdminClientAddComponent } from "./clients/admin-client-add/admin-client-add.component";
import { AdminClientEditComponent } from "./clients/admin-client-edit/admin-client-edit.component";
import { AdminClientViewComponent } from "./clients/admin-client-view/admin-client-view.component";
import { AdminFreelancerViewComponent } from "./freelancers/admin-freelancer-view/admin-freelancer-view.component";
import { AdminFreelancerAddComponent } from "./freelancers/admin-freelancer-add/admin-freelancer-add.component";
import { AdminFreelancerEditComponent } from "./freelancers/admin-freelancer-edit/admin-freelancer-edit.component";
import { AdminFreelancerIndexComponent } from "./freelancers/admin-freelancer-index/admin-freelancer-index.component";
import {
  NgxUiLoaderModule,
  NgxUiLoaderHttpModule,
  NgxUiLoaderRouterModule,
} from "ngx-ui-loader";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AboutUsComponent } from "./about-us/about-us.component";
import { FaqAddComponent } from "./faq/add/add.component";
import { FaqViewComponent } from "./faq/view/view.component";
import { FaqIndexComponent } from "./faq/index/index.component";
import { FaqEditComponent } from "./faq/edit/edit.component";
import { ContactUsComponent } from "./contact-us/contact-us.component";
import { TopClientIndexComponent } from "./top-client/top-client-index/top-client-index.component";
import { TopClientAddComponent } from "./top-client/top-client-add/top-client-add.component";
import { TopClientViewComponent } from "./top-client/top-client-view/top-client-view.component";
import { TopClientEditComponent } from "./top-client/top-client-edit/top-client-edit.component";
import { CreativeProfessionalsIndexComponent } from "./creative-professionals/creative-professionals-index/creative-professionals-index.component";
import { CreativeProfessionalsViewComponent } from "./creative-professionals/creative-professionals-view/creative-professionals-view.component";
import { CreativeProfessionalsAddComponent } from "./creative-professionals/creative-professionals-add/creative-professionals-add.component";
import { CreativeProfessionalsEditComponent } from "./creative-professionals/creative-professionals-edit/creative-professionals-edit.component";
import { HowitworksComponent } from "./howitworks/howitworks.component";
import { PortFolioIndexComponent } from "./portfolio/index/index.component";
import { PortFolioAddComponent } from "./portfolio/add/add.component";
import { PortFolioEditComponent } from "./portfolio/edit/edit.component";
import { PortFolioViewComponent } from "./portfolio/view/view.component";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { ProjectIndexComponent } from "./projects/index/index.component";
import { ProjectViewComponent } from "./projects/view/view.component";
import { ProjectAddComponent } from "./projects/add/add.component";
import { ProjectEditComponent } from "./projects/edit/edit.component";

@NgModule({
  declarations: [
    AdminComponent,
    AdminLoginComponent,
    ProjectAddComponent,
    ProjectEditComponent,
    DashboardComponent,
    AdminRegisterComponent,
    AdminForgotPasswordComponent,
    AdminPasswordResetComponent,
    AdminHeaderComponent,
    AdminFooterComponent,
    AdminSidebarComponent,
    AdminProfileEditComponent,
    AdminGlobalSettingsComponent,
    AdminUserIndexComponent,
    AdminUserViewComponent,
    AdminUserAddComponent,
    AdminUserEditComponent,
    AdminCmsPagesIndexComponent,
    AdminCmsPagesViewComponent,
    AdminCmsPagesAddComponent,
    AdminCmsPagesEditComponent,
    AdminOfferIndexComponent,
    AdminOfferAddComponent,
    AdminOfferEditComponent,
    AdminOfferViewComponent,
    AdminEmailtemplateIndexComponent,
    AdminEmailtemplateAddComponent,
    AdminEmailtemplateEditComponent,
    AdminEmailtemplateViewComponent,
    AdminClientIndexComponent,
    AdminClientAddComponent,
    AdminClientEditComponent,
    AdminClientViewComponent,
    AdminFreelancerViewComponent,
    AdminFreelancerAddComponent,
    AdminFreelancerEditComponent,
    AdminFreelancerIndexComponent,
    AboutUsComponent,
    FaqAddComponent,
    FaqViewComponent,
    FaqIndexComponent,
    FaqEditComponent,
    ContactUsComponent,
    TopClientIndexComponent,
    TopClientAddComponent,
    TopClientViewComponent,
    TopClientEditComponent,
    CreativeProfessionalsIndexComponent,
    CreativeProfessionalsViewComponent,
    CreativeProfessionalsAddComponent,
    CreativeProfessionalsEditComponent,

    HowitworksComponent,
    PortFolioIndexComponent,
    PortFolioAddComponent,
    PortFolioEditComponent,
    PortFolioViewComponent,
    ProjectIndexComponent,
    ProjectViewComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    NgxUiLoaderModule,
    FormsModule,
    ReactiveFormsModule,
    AngularEditorModule,
    //NgxUiLoaderRouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatCheckboxModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CKEditorModule,
  ],
  providers: [],
})
export class AdminModule { }
