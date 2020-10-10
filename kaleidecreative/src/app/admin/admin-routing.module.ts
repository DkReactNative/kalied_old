
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { AdminLoginComponent } from './auth/admin-login/admin-login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminRegisterComponent } from './auth/admin-register/admin-register.component';
import { AdminForgotPasswordComponent } from './auth/admin-forgot-password/admin-forgot-password.component';
import { AdminPasswordResetComponent } from './auth/admin-password-reset/admin-password-reset.component';
import { AdminProfileEditComponent } from './admin-profile-edit/admin-profile-edit.component';
import { AdminGlobalSettingsComponent } from './admin-global-settings/admin-global-settings.component';
/** Admin User Routing Start **/
import { AdminUserIndexComponent } from './user/admin-user-index/admin-user-index.component';
import { AdminUserAddComponent } from './user/admin-user-add/admin-user-add.component';
import { AdminUserViewComponent } from './user/admin-user-view/admin-user-view.component';
import { AdminUserEditComponent } from './user/admin-user-edit/admin-user-edit.component';
/** Admin User Routing End **/
/** Admin CMS Pages Routing Start **/
import { AdminCmsPagesIndexComponent } from './cmspages/admin-cms-pages-index/admin-cms-pages-index.component';
import { AdminCmsPagesViewComponent } from './cmspages/admin-cms-pages-view/admin-cms-pages-view.component';
import { AdminCmsPagesAddComponent } from './cmspages/admin-cms-pages-add/admin-cms-pages-add.component';
import { AdminCmsPagesEditComponent } from './cmspages/admin-cms-pages-edit/admin-cms-pages-edit.component';
/** Admin CMS Pages Routing End **/
/** Admin Offers Routing Start **/
// import { AdminOfferIndexComponent } from './offers/admin-offer-index/admin-offer-index.component';
// import { AdminOfferAddComponent } from './offers/admin-offer-add/admin-offer-add.component';
// import { AdminOfferEditComponent } from './offers/admin-offer-edit/admin-offer-edit.component';
// import { AdminOfferViewComponent } from './offers/admin-offer-view/admin-offer-view.component';

/** Admin Offers Routing End **/

/** Admin Email Template Routing Start */
import { AdminEmailtemplateIndexComponent } from './emailtemplates/admin-emailtemplate-index/admin-emailtemplate-index.component';
import { AdminEmailtemplateAddComponent } from './emailtemplates/admin-emailtemplate-add/admin-emailtemplate-add.component';
import { AdminEmailtemplateEditComponent } from './emailtemplates/admin-emailtemplate-edit/admin-emailtemplate-edit.component';
import { AdminEmailtemplateViewComponent } from './emailtemplates/admin-emailtemplate-view/admin-emailtemplate-view.component';
import { AdminClientIndexComponent } from './clients/admin-client-index/admin-client-index.component';
import { AdminClientViewComponent } from './clients/admin-client-view/admin-client-view.component';
import { AdminClientAddComponent } from './clients/admin-client-add/admin-client-add.component';
import { AdminClientEditComponent } from './clients/admin-client-edit/admin-client-edit.component';
import { AdminFreelancerIndexComponent } from './freelancers/admin-freelancer-index/admin-freelancer-index.component';
import { AdminFreelancerViewComponent } from './freelancers/admin-freelancer-view/admin-freelancer-view.component';
import { AdminFreelancerAddComponent } from './freelancers/admin-freelancer-add/admin-freelancer-add.component';
import { AdminFreelancerEditComponent } from './freelancers/admin-freelancer-edit/admin-freelancer-edit.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component'
import { FaqIndexComponent } from './faq/index/index.component';
import { FaqAddComponent } from './faq/add/add.component';
import { FaqEditComponent } from './faq/edit/edit.component';
import { FaqViewComponent } from './faq/view/view.component';
import { TopClientIndexComponent } from './top-client/top-client-index/top-client-index.component';
import { TopClientAddComponent } from './top-client/top-client-add/top-client-add.component';
import { TopClientViewComponent } from './top-client/top-client-view/top-client-view.component';
import { TopClientEditComponent } from './top-client/top-client-edit/top-client-edit.component';
import { CreativeProfessionalsIndexComponent } from './creative-professionals/creative-professionals-index/creative-professionals-index.component';
import { CreativeProfessionalsViewComponent } from './creative-professionals/creative-professionals-view/creative-professionals-view.component';
import { CreativeProfessionalsAddComponent } from './creative-professionals/creative-professionals-add/creative-professionals-add.component';
import { CreativeProfessionalsEditComponent } from './creative-professionals/creative-professionals-edit/creative-professionals-edit.component';
import { HowitworksComponent } from './howitworks/howitworks.component'
import { PortFolioIndexComponent } from './portfolio/index/index.component';
import { PortFolioAddComponent } from './portfolio/add/add.component';
import { PortFolioEditComponent } from './portfolio/edit/edit.component';
import { PortFolioViewComponent } from './portfolio/view/view.component'
import { ProjectIndexComponent } from './projects/index/index.component'
import { ProjectViewComponent } from './projects/view/view.component'
/** Admin Email Template Routing End */

const routes: Routes = [
  {
    path: "", component: AdminComponent, children: [

      { path: "", component: DashboardComponent },
      { path: "login", component: AdminLoginComponent },
      { path: "forgot_password", component: AdminForgotPasswordComponent },
      { path: "reset_password/:slug", component: AdminPasswordResetComponent },

      /** Admin Profile Routes Start **/
      { path: "profile_edit", component: AdminProfileEditComponent },

      /** Admin Global Settings Routes Start **/
      { path: "global_settings", component: AdminGlobalSettingsComponent },

      /** Admin User Routing Start **/
      { path: "user", component: AdminUserIndexComponent },
      { path: "user/view/:userId", component: AdminUserViewComponent },
      { path: "user/create", component: AdminUserAddComponent },
      { path: "user/edit/:userId", component: AdminUserEditComponent },

      /** Admin Client Routing Start **/
      { path: "client", component: AdminClientIndexComponent },
      { path: "client/view/:userId", component: AdminClientViewComponent },
      { path: "client/create", component: AdminClientAddComponent },
      { path: "client/edit/:userId", component: AdminClientEditComponent },

      /** Admin Freelancer Routing Start **/
      { path: "freelancer", component: AdminFreelancerIndexComponent },
      { path: "freelancer/view/:userId", component: AdminFreelancerViewComponent },
      { path: "freelancer/create", component: AdminFreelancerAddComponent },
      { path: "freelancer/edit/:userId", component: AdminFreelancerEditComponent },

      /** Admin CMS Pages Routing Start **/
      { path: "cmspage", component: AdminCmsPagesIndexComponent },
      { path: "cmspage/view/:id", component: AdminCmsPagesViewComponent },
      { path: "cmspage/create", component: AdminCmsPagesAddComponent },
      { path: "cmspage/edit/:id", component: AdminCmsPagesEditComponent },

      /**Admin Email Template Routing Start */
      { path: "emailtemplate", component: AdminEmailtemplateIndexComponent },
      { path: "emailtemplate/view/:id", component: AdminEmailtemplateViewComponent },
      { path: "emailtemplate/create", component: AdminEmailtemplateAddComponent },
      { path: "emailtemplate/edit/:id", component: AdminEmailtemplateEditComponent },
      //** About us page route **//

      /**Admin Faq Routing Start */
      { path: "faq", component: FaqIndexComponent },
      { path: "faq/view/:id", component: FaqViewComponent },
      { path: "faq/create", component: FaqAddComponent },
      { path: "faq/edit/:id", component: FaqEditComponent },
      //** About us page route **//


      { path: "creative-professionls", component: CreativeProfessionalsIndexComponent },
      { path: "creative-professionls/view/:id", component: CreativeProfessionalsViewComponent },
      { path: "creative-professionls/create", component: CreativeProfessionalsAddComponent },
      { path: "creative-professionls/edit/:id", component: CreativeProfessionalsEditComponent },

      { path: "tierclients", component: TopClientIndexComponent },
      { path: "tierclients/view/:id", component: TopClientViewComponent },
      { path: "tierclients/create", component: TopClientAddComponent },
      { path: "tierclients/edit/:id", component: TopClientEditComponent },

      // HowitWork route
      { path: "how-it-works", component: HowitworksComponent },

      { path: "about-us", component: AboutUsComponent },
      { path: "contact-us", component: ContactUsComponent },

      { path: "portfolio", component: PortFolioIndexComponent },
      { path: "portfolio/view/:id", component: PortFolioViewComponent },
      { path: "portfolio/create", component: PortFolioAddComponent },
      { path: "portfolio/edit/:id", component: PortFolioEditComponent },

      { path: "project", component: ProjectIndexComponent },
      { path: "project/view/:id", component: ProjectViewComponent }
    ]
  }

  /** Admin Email Template Routing End */
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
