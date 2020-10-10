import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";

import { MatChipsModule } from "@angular/material/chips";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Ng5SliderModule } from "ng5-slider";
import { AgmCoreModule } from "@agm/core";
import { ClipboardModule } from "ngx-clipboard";
import { PdfViewerModule } from "ng2-pdf-viewer";
import { FrontComponent } from "./front.component";
import { FrontEndRoutingModule } from "./front-end-routing.module";
import { HomeComponent } from "./home/home.component";
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { RegisterComponent } from "./register/register.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LoginComponent } from "./login/login.component";
import { ForgotComponent } from "./forgot/forgot.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { VerifOtpComponent } from "./verif-otp/verif-otp.component";
import {
  NgxUiLoaderModule,
  NgxUiLoaderHttpModule,
  NgxUiLoaderRouterModule,
} from "ngx-ui-loader";
import { AboutUsComponent } from "./about-us/about-us.component";
import { TermConditionComponent } from "./term-condition/term-condition.component";
import { PrivacyPolicyComponent } from "./privacy-policy/privacy-policy.component";
import { NotificationComponent } from "./notification/notification.component";
import { FaqComponent } from "./faq/faq.component";
import { ContactUsComponent } from "./contact-us/contact-us.component";
import { ThanksRegisterComponent } from "./thanks-register/thanks-register.component";
import { ProfileSideMenuComponent } from "./client/profile-side-menu/profile-side-menu.component";
import { MyprofileComponent } from "./client/myprofile/myprofile.component";
import { ChangePasswordComponent } from "./client/change-password/change-password.component";
import { NotificationSettingComponent } from "./client/notification-setting/notification-setting.component";
import { PaymentSettingComponent } from "./client/payment-setting/payment-setting.component";
import { ClientRootComponent } from "./client/client-root.component";
import { DashboardComponent } from "./client/dashboard/dashboard.component";
import { HowItWorksComponent } from "./how-it-works/how-it-works.component";
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
import { ProfileSetupSideMenuComponent } from "./freelancer/profile-setup/profile-setup-side-menu/profile-setup-side-menu.component";
import { HiddenTabComponent } from "./client/hidden-tab/hidden-tab.component";
import { FindFreelancerComponent } from "./client/find-freelancer/find-freelancer.component";
import { FavouriteFolderComponent } from "./client/favoutite-folder/hidden-folder.component";
import { FavouriteUserComponent } from "./client/favourite-user/favourite-user.component";
import { FreelancerProfileComponent } from "./freelancer-profile/freelancer-profile.component";
import { VerifyLinkComponent } from "./verify-link/verify-link.component";
import {
  MatFormFieldModule,
  MatMenuModule,
  MatCheckboxModule,
  MatIconModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatInputModule,
  MatAutocompleteModule,
} from "@angular/material";
import { ProjectComponent } from "./project/project.component";
import { ProjectStepOneComponent } from "./project/step-one/step-one.component";
import { ProjectStepTwoComponent } from "./project/step-two/step-two.component";
import { ProjectStepThreeComponent } from "./project/step-three/step-three.component";
import { ProjectStepFourComponent } from "./project/step-four/step-four.component";
import { ProjectStepFiveComponent } from "./project/step-five/step-five.component";
import { ProjectSideBarComponent } from "./project/project-side-bar/project-side-bar.component";
import { ReusableProfileComponentFreelancerComponent } from "./reusable-profile-component-freelancer/reusable-profile-component-freelancer.component";
import { ClientMyProjectComponent } from "./client/client-my-project/client-my-project.component";
import { PaginationComponentComponent } from "./pagination-component/pagination-component.component";
import { DateFormatPipe } from "../date-format.pipe";
import { ProjectPageRootComponent } from "./client/project-page-tabs/project-page-root.component";
import { ClientProjectDescriptionTabComponent } from "./client/project-page-tabs/client-project-description-tab/client-project-description-tab.component";
import { ClientProjectCandidateTabComponent } from "./client/project-page-tabs/client-project-candidate-tab/client-project-candidate-tab.component";
import { ClientProjectMessageTabComponent } from "./client/project-page-tabs/client-project-message-tab/client-project-message-tab.component";
import { ClientProjectPaymentTabComponent } from "./client/project-page-tabs/client-project-payment-tab/client-project-payment-tab.component";
import { GetMultipleNameByValuePipe } from "./../get-multiple-name-by-value.pipe";
import { FindWorkComponent } from "./find-work/find-work.component";
import { NgxPayPalModule } from "ngx-paypal";
import { ProjectDeatilPageComponent } from "./project-deatil-page/project-deatil-page.component";
import { ProjectPageTabsComponent } from "./freelancer/project-page-tabs/project-page-tabs.component";
import { FreelancerDescriptionTabComponent } from "./freelancer/project-page-tabs/freelancer-description-tab/freelancer-description-tab.component";
import { FreelancerPaymentTabComponent } from "./freelancer/project-page-tabs/freelancer-payment-tab/freelancer-payment-tab.component";
import { FreelancerMessageTabComponent } from "./freelancer/project-page-tabs/freelancer-message-tab/freelancer-message-tab.component";
import { FreelancerMyProjectComponent } from "./freelancer/freelancer-my-project/freelancer-my-project.component";

@NgModule({
  declarations: [
    GetMultipleNameByValuePipe,
    HomeComponent,
    FrontComponent,
    HeaderComponent,
    FooterComponent,
    RegisterComponent,
    LoginComponent,
    ForgotComponent,
    ResetPasswordComponent,
    VerifOtpComponent,
    AboutUsComponent,
    TermConditionComponent,
    PrivacyPolicyComponent,
    NotificationComponent,
    FaqComponent,
    ContactUsComponent,
    ThanksRegisterComponent,
    ProfileSideMenuComponent,
    MyprofileComponent,
    ChangePasswordComponent,
    NotificationSettingComponent,
    PaymentSettingComponent,
    ClientRootComponent,
    DashboardComponent,
    FreelancerRootComponent,
    FreelancerSideMenuComponent,
    FreelacerMydetailsComponent,
    FreelacerChangePasswordComponent,
    FreelacerNotificationSettingComponent,
    FreelacerPaymentSettingComponent,
    FreelacerSkillAndAwardsComponent,
    FreelacerExpertiseLevelComponent,
    FreelacerRecommendationsComponent,
    FreelacerManagePortfolioVideoComponent,
    FreelacerDashboardComponent,
    ProfileSetupComponent,
    FirstStepComponent,
    WelcomeComponent,
    SecondStepComponent,
    ThirdStepComponent,
    FourthStepComponent,
    FifthStepComponent,
    ProfileSetupSideMenuComponent,
    HowItWorksComponent,
    HiddenTabComponent,
    FindFreelancerComponent,
    FavouriteFolderComponent,
    FavouriteUserComponent,
    FreelancerProfileComponent,
    VerifyLinkComponent,
    ProjectComponent,
    ProjectStepOneComponent,
    ProjectStepTwoComponent,
    ProjectStepThreeComponent,
    ProjectStepFourComponent,
    ProjectStepFiveComponent,
    ProjectSideBarComponent,
    ReusableProfileComponentFreelancerComponent,
    ClientMyProjectComponent,
    PaginationComponentComponent,
    DateFormatPipe,
    ProjectPageRootComponent,
    ClientProjectDescriptionTabComponent,
    ClientProjectCandidateTabComponent,
    ClientProjectMessageTabComponent,
    ClientProjectPaymentTabComponent,
    FindWorkComponent,
    ProjectDeatilPageComponent,
    ProjectPageTabsComponent,
    FreelancerDescriptionTabComponent,
    FreelancerPaymentTabComponent,
    FreelancerMessageTabComponent,
    FreelancerMyProjectComponent,
  ],
  imports: [
    CommonModule,
    FrontEndRoutingModule,
    MatToolbarModule,
    MatTooltipModule,
    NgxUiLoaderModule,
    FormsModule,
    ReactiveFormsModule,
    Ng5SliderModule,
    PdfViewerModule,
    NgMultiSelectDropDownModule.forRoot(),
    ClipboardModule,
    MatFormFieldModule,
    MatMenuModule,
    MatCheckboxModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    NgxPayPalModule,
    MatAutocompleteModule,
    MatChipsModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyC9BEiEwu90PwsPsENmtvp5p26K3A3UqVQ",
      libraries: ["places"],
    }),
  ],
  providers: [],
})
export class FrontEndModule {}
