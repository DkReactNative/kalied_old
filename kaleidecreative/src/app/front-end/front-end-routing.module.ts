import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { FrontComponent } from "./front.component";
import { RegisterComponent } from "./register/register.component";
import { LoginComponent } from "./login/login.component";
import { ForgotComponent } from "./forgot/forgot.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { VerifOtpComponent } from "./verif-otp/verif-otp.component";
import { AboutUsComponent } from "./about-us/about-us.component";
import { HowItWorksComponent } from "./how-it-works/how-it-works.component";
import { TermConditionComponent } from "./term-condition/term-condition.component";
import { PrivacyPolicyComponent } from "./privacy-policy/privacy-policy.component";
import { NotificationComponent } from "./notification/notification.component";
import { FaqComponent } from "./faq/faq.component";
import { ContactUsComponent } from "./contact-us/contact-us.component";
import { ThanksRegisterComponent } from "./thanks-register/thanks-register.component";
import { FreelancerProfileComponent } from "./freelancer-profile/freelancer-profile.component";
import { VerifyLinkComponent } from "./verify-link/verify-link.component";
import { FindWorkComponent } from "./find-work/find-work.component";
import { ProjectDeatilPageComponent } from "./project-deatil-page/project-deatil-page.component";

/* client components */
import { MyprofileComponent } from "./client/myprofile/myprofile.component";
import { ChangePasswordComponent } from "./client/change-password/change-password.component";
import { NotificationSettingComponent } from "./client/notification-setting/notification-setting.component";
import { PaymentSettingComponent } from "./client/payment-setting/payment-setting.component";
import { ClientRootComponent } from "./client/client-root.component";
import { DashboardComponent } from "./client/dashboard/dashboard.component";
import { HiddenTabComponent } from "./client/hidden-tab/hidden-tab.component";
import { FindFreelancerComponent } from "./client/find-freelancer/find-freelancer.component";
import { FavouriteFolderComponent } from "./client/favoutite-folder/hidden-folder.component";
import { FavouriteUserComponent } from "./client/favourite-user/favourite-user.component";
import { ClientMyProjectComponent } from "./client/client-my-project/client-my-project.component";
import { ProjectPageRootComponent } from "./client/project-page-tabs/project-page-root.component";
import { ClientProjectDescriptionTabComponent } from "./client/project-page-tabs/client-project-description-tab/client-project-description-tab.component";
import { ClientProjectCandidateTabComponent } from "./client/project-page-tabs/client-project-candidate-tab/client-project-candidate-tab.component";
import { ClientProjectMessageTabComponent } from "./client/project-page-tabs/client-project-message-tab/client-project-message-tab.component";
import { ClientProjectPaymentTabComponent } from "./client/project-page-tabs/client-project-payment-tab/client-project-payment-tab.component";

/* freelancer components */
import { FreelancerRootComponent } from "./freelancer/freelancer-root.component";
import { FreelancerSideMenuComponent } from "./freelancer/freelancer-side-menu/freelancer-side-menu.component";
import { FreelacerMydetailsComponent } from "./freelancer/freelacer-mydetails/freelacer-mydetails.component";
import { FreelacerChangePasswordComponent } from "./freelancer/freelacer-change-password/freelacer-change-password.component";
import { FreelacerNotificationSettingComponent } from "./freelancer/freelacer-notification-setting/freelacer-notification-setting.component";
import { FreelacerPaymentSettingComponent } from "./freelancer/freelacer-payment-setting/freelacer-payment-setting.component";
import { FreelacerSkillAndAwardsComponent } from "./freelancer/freelacer-skill-and-awards/freelacer-skill-and-awards.component";
import { FreelacerExpertiseLevelComponent } from "./freelancer/freelacer-expertise-level/freelacer-expertise-level.component";
import { FreelacerRecommendationsComponent } from "./freelancer/freelacer-recommendations/freelacer-recommendations.component";
import { FreelacerManagePortfolioVideoComponent } from "./freelancer/freelacer-manage-portfolio-video/freelacer-manage-portfolio-video.component";
import { FreelacerDashboardComponent } from "./freelancer/freelacer-dashboard/freelacer-dashboard.component";

import { ProfileSetupComponent } from "./freelancer/profile-setup/profile-setup.component";
import { FirstStepComponent } from "./freelancer/profile-setup/first-step/first-step.component";
import { WelcomeComponent } from "./freelancer/profile-setup/welcome/welcome.component";
import { SecondStepComponent } from "./freelancer/profile-setup/second-step/second-step.component";
import { ThirdStepComponent } from "./freelancer/profile-setup/third-step/third-step.component";
import { FourthStepComponent } from "./freelancer/profile-setup/fourth-step/fourth-step.component";
import { FifthStepComponent } from "./freelancer/profile-setup/fifth-step/fifth-step.component";

import { ProjectPageTabsComponent } from "./freelancer/project-page-tabs/project-page-tabs.component";
import { FreelancerDescriptionTabComponent } from "./freelancer/project-page-tabs/freelancer-description-tab/freelancer-description-tab.component";
import { FreelancerPaymentTabComponent } from "./freelancer/project-page-tabs/freelancer-payment-tab/freelancer-payment-tab.component";
import { FreelancerMessageTabComponent } from "./freelancer/project-page-tabs/freelancer-message-tab/freelancer-message-tab.component";
import { FreelancerMyProjectComponent } from "./freelancer/freelancer-my-project/freelancer-my-project.component";

// create project component

import { ProjectComponent } from "./project/project.component";
import { ProjectStepOneComponent } from "./project/step-one/step-one.component";
import { ProjectStepTwoComponent } from "./project/step-two/step-two.component";
import { ProjectStepThreeComponent } from "./project/step-three/step-three.component";
import { ProjectStepFourComponent } from "./project/step-four/step-four.component";
import { ProjectStepFiveComponent } from "./project/step-five/step-five.component";

const routes: Routes = [
  {
    path: "",
    component: FrontComponent,
    children: [
      /* common route for website*/

      { path: "", redirectTo: "home" },
      { path: "home", component: HomeComponent },
      { path: "register", component: RegisterComponent },
      { path: "login", component: LoginComponent },
      { path: "forgot-password", component: ForgotComponent },
      { path: "reset-password/:id", component: ResetPasswordComponent },
      { path: "verify-otp/:id", component: VerifOtpComponent },
      { path: "privacy-policy", component: PrivacyPolicyComponent },
      { path: "notification", component: NotificationComponent },
      { path: "term-condition", component: TermConditionComponent },
      { path: "faq", component: FaqComponent },
      { path: "contact-us", component: ContactUsComponent },
      { path: "about-us", component: AboutUsComponent },
      { path: "how-it-works", component: HowItWorksComponent },
      { path: "thanks/:id", component: ThanksRegisterComponent },
      { path: "freelancer-profile/:id", component: FreelancerProfileComponent },
      { path: "verify-link/:id", component: VerifyLinkComponent },
      { path: "find-job", component: FindWorkComponent },
      { path: "project-detail/:id", component: ProjectDeatilPageComponent },

      /* client route for website*/
      {
        path: "client",
        component: ClientRootComponent,
        children: [
          { path: "", redirectTo: "dashboard" },
          { path: "profile", component: MyprofileComponent },
          { path: "change-password", component: ChangePasswordComponent },
          {
            path: "notification-setting",
            component: NotificationSettingComponent,
          },
          { path: "payment-setting", component: PaymentSettingComponent },
          { path: "dashboard", component: DashboardComponent },
          { path: "hidden-tabs", component: HiddenTabComponent },
          { path: "find-freelancers", redirectTo: "find-freelancers/2" },
          { path: "find-freelancers/:id", component: FindFreelancerComponent },
          { path: "favourite-folder", component: FavouriteFolderComponent },
          { path: "favourite-user/:id", component: FavouriteUserComponent },
          { path: "my-projects", component: ClientMyProjectComponent },
          {
            path: "project",
            component: ProjectPageRootComponent,
            children: [
              {
                path: "description/:id",
                component: ClientProjectDescriptionTabComponent,
              },
              {
                path: "candidates/:id",
                component: ClientProjectCandidateTabComponent,
              },
              {
                path: "message/:id",
                component: ClientProjectMessageTabComponent,
              },
              {
                path: "payment/:id",
                component: ClientProjectPaymentTabComponent,
              },
            ],
          },
        ],
      },

      /* freelancer route for website*/
      {
        path: "freelancer",
        component: FreelancerRootComponent,
        children: [
          { path: "", redirectTo: "dashboard" },
          { path: "profile", redirectTo: "profile/1" },
          { path: "profile/1", component: FreelacerMydetailsComponent },
          { path: "profile/2", component: FreelacerSkillAndAwardsComponent },
          { path: "profile/3", component: FreelacerExpertiseLevelComponent },
          { path: "profile/4", component: FreelacerRecommendationsComponent },
          {
            path: "profile/5",
            component: FreelacerManagePortfolioVideoComponent,
          },
          {
            path: "change-password",
            component: FreelacerChangePasswordComponent,
          },
          {
            path: "notification-setting",
            component: FreelacerNotificationSettingComponent,
          },
          {
            path: "payment-setting",
            component: FreelacerPaymentSettingComponent,
          },
          { path: "dashboard", component: FreelacerDashboardComponent },

          {
            path: "set-up",
            component: ProfileSetupComponent,
            children: [
              { path: "", redirectTo: "welcome" },
              { path: "0", redirectTo: "welcome" },
              { path: "welcome", component: WelcomeComponent },
              { path: "1", component: FirstStepComponent },
              { path: "2", component: SecondStepComponent },
              { path: "3", component: ThirdStepComponent },
              { path: "4", component: FourthStepComponent },
              { path: "5", component: FifthStepComponent },
            ],
          },

          { path: "my-projects", component: FreelancerMyProjectComponent },
          {
            path: "project/:id",
            component: ProjectPageTabsComponent,
            children: [
              {
                path: "description/:id",
                component: FreelancerDescriptionTabComponent,
              },
              {
                path: "message/:id",
                component: FreelancerMessageTabComponent,
              },
              {
                path: "payment/:id",
                component: FreelancerPaymentTabComponent,
              },
            ],
          },
        ],
      },

      /* project route for website*/
      {
        path: "project",
        component: ProjectComponent,
        children: [
          { path: "create1", component: ProjectStepOneComponent },
          { path: "create1/:id", component: ProjectStepOneComponent },
          { path: "create2/:id", component: ProjectStepTwoComponent },
          { path: "create3/:id", component: ProjectStepThreeComponent },
          { path: "create4/:id", component: ProjectStepFourComponent },
          { path: "create5/:id", component: ProjectStepFiveComponent },
          { path: "edit1/:id", component: ProjectStepOneComponent },
          { path: "edit2/:id", component: ProjectStepTwoComponent },
          { path: "edit3/:id", component: ProjectStepThreeComponent },
          { path: "edit4/:id", component: ProjectStepFourComponent },
          { path: "edit5/:id", component: ProjectStepFiveComponent },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FrontEndRoutingModule { }
