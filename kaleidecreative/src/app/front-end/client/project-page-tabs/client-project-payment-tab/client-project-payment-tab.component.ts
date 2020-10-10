import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { GlobalService } from "../../../global.service";
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: "app-client-project-payment-tab",
  templateUrl: "./client-project-payment-tab.component.html",
  styleUrls: ["./client-project-payment-tab.component.css"],
})
export class ClientProjectPaymentTabComponent implements OnInit {
  projectId;
  projectInfo;
  public pendingPayment: any = [];
  public freelancerData: any;
  public defaultCard: any;
  public paypalToken: any;

  constructor(
    private route: Router,
    public global: GlobalService,
    private ngxService: NgxUiLoaderService,
    private router: ActivatedRoute
  ) {
    this.router.paramMap.subscribe((params) => {
      let str = params.get("id") ? atob(params.get("id")) : "";
      if (str) {
        this.projectId = str;
      }
    });
  }

  ngOnInit() {
    this.getPendingPaymentProject();
    this.getDefaultCard();
    this.getToken();
  }

  getPendingPaymentProject() {
    this.global.get("payment/getPendingPaymentProjects", data => {
      console.log("data: ", data);
      if (data.status == 1) {
        this.pendingPayment = data.response ? data.response : [];
        // this.freelancerData = data.response
      } else {
        this.global.showDangerToast("", data.message);
      }
    }, err => {
      this.ngxService.stop();
      this.global.showDangerToast("", err.message);
    }, true)
  }

  getDefaultCard() {
    this.global.get("payment/getDefaultCard", data => {
      if (data.status == 1) {
        this.defaultCard = data.response;
        console.log("default Card: ", this.defaultCard);
      } else {
        this.global.showDangerToast("", data.message);
      }
    }, err => {
      this.ngxService.stop();
      this.global.showDangerToast("", err.message);
    }, true);
  }

  getToken() {
    this.ngxService.start();
    this.global.get('payment/getToken', data => {
      this.ngxService.stop();
      this.paypalToken = data.response.toString();
      console.log("token: ", this.paypalToken);
      // this.cardsList();
    }, err => {
      this.ngxService.stop();
      this.global.showDangerToast("", err.message);
    }, true)
  }

  makePayment(amount) {
    let obj = {
      token: this.paypalToken,
      card_id: this.defaultCard.payment_reference,
      customer_id: this.defaultCard.customer_id,
      amount: amount,
      project_id: this.projectId
    };
    this.ngxService.start();
    this.global.post(
      "payment/makePayment",
      obj,
      (data) => {
        this.getPendingPaymentProject();
        this.ngxService.stop();
        this.global.showToast("Payment successfully done");
        console.log("response: -=-=-=-=-=-=-= : ", data);
        // window.open(data.response, "_blank");
      },
      (err) => {
        this.ngxService.stop();
        this.global.showDangerToast("", err.message);
      },
      true
    );
  }

}
