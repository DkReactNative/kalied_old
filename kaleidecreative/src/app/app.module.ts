import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
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
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AngularEditorModule } from "@kolkov/angular-editor";
import { ToastrModule } from "ngx-toastr";
import {
  NgxUiLoaderModule,
  NgxUiLoaderHttpModule,
  NgxUiLoaderRouterModule,
} from "ngx-ui-loader";
import { HttpModule } from "@angular/http";
import { NotFoundComponent } from "./not-found/not-found.component";
import { ModalModule, BsModalRef } from "ngx-bootstrap/modal";
import { RemoveEmojiDirective } from "./remove-emoji.directive";
import { SocketIoModule, SocketIoConfig } from "ngx-socket-io";
import { NgxPayPalModule } from "ngx-paypal";
import { environment } from "src/environments/environment";

const config: SocketIoConfig = { url: environment.socketUrl, options: {} };

// const appRoutes: Routes = [];

@NgModule({
  declarations: [AppComponent, NotFoundComponent, RemoveEmojiDirective],
  imports: [
    BrowserModule,
    // RouterModule.forRoot(appRoutes, {
    // 	scrollPositionRestoration: 'enabled'
    //   }),
    ModalModule.forRoot(),
    MatAutocompleteModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatCheckboxModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    SocketIoModule.forRoot(config),
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: "toast-top-right",
      preventDuplicates: true,
      maxOpened: 1,
    }),
    NgxUiLoaderModule,
    NgxUiLoaderRouterModule,
    // NgxUiLoaderHttpModule,
    AngularEditorModule,
    NgxPayPalModule,
  ],
  providers: [MatDatepickerModule, BsModalRef],
  bootstrap: [AppComponent],
})
export class AppModule {}
