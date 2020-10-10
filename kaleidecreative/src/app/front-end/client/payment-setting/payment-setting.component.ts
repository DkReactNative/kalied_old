import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { GlobalService } from "../../global.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { FormControl, FormBuilder, Validators } from "@angular/forms";
import { CustomValidators } from "ng2-validation";
import { IPayPalConfig, ICreateOrderRequest } from "ngx-paypal";
@Component({
  selector: "app-payment-setting",
  templateUrl: "./payment-setting.component.html",
  styleUrls: ["./payment-setting.component.css"],
})
export class PaymentSettingComponent implements OnInit {
  public cards: any = [];
  public referenceCard: any = [];
  public formData: any;
  public formSubmitAttempt = false;
  public currentMonth: any = new Date().getMonth() + 1;
  public currentYear: any = new Date().getFullYear();
  public date: String = "";
  public payPalConfig?: IPayPalConfig;
  public paypalToken: String = "";
  public selectedReferenceCard: String = "";

  // @ViewChild('closeButton') closeBtn: ElementRef;

  constructor(
    public global: GlobalService,
    private ngxService: NgxUiLoaderService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.ngxService.start();
    this.createPaymentForm();
    if (this.currentMonth < 10)
      this.date = this.currentYear + "-0" + this.currentMonth;
    else this.date = this.currentYear + "-" + this.currentMonth;

    this.initConfig();
    this.cardsList();
    this.getToken();
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

  createPaymentForm() {
    this.formData = this.formBuilder.group({
      cardType: new FormControl("", Validators.required),
      cardHolderName: new FormControl("", Validators.required),
      cardNumber: new FormControl("", Validators.required),
      expiredOn: new FormControl(this.date, Validators.required),
      cvv: new FormControl("", Validators.required),
    });
  }

  //Intialaly List of
  cardsList() {
    this.ngxService.start();
    this.global.get(
      "payment/getCardDetails",
      (data) => {
        this.ngxService.stop();
        if (data.status == 1) {
          this.cards =
            data.response.cards.length > 0 ? data.response.cards : [];
          console.log("cards: ", this.cards);
          this.referenceCard =
            data.response.referenceCard.length > 0
              ? data.response.referenceCard
              : [];
          // this.makePayment();
        } else {
          this.global.showDangerToast("", data.message);
        }
      },
      (err) => {
        this.ngxService.stop();
        this.global.showDangerToast("", err.message);
      },
      true
    );
  }

  makeDefault(id) {
    this.ngxService.start();
    let newFormData = new FormData();
    newFormData.append("card_id", id);
    this.global.post(
      "payment/setdefaultCard",
      newFormData,
      (data) => {
        this.ngxService.stop();
        this.cardsList();
        this.global.showToast(data.message);
      },
      (err) => {
        this.ngxService.stop();
        this.global.showDangerToast("", err.message);
      },
      true
    );
  }

  onClickSubmit(values) {
    let newFormData = new FormData();
    newFormData.append("type", values.cardType);
    newFormData.append("number", values.cardNumber);
    let date = values.expiredOn.split("-");
    newFormData.append("expire_month", date[date.length - 1]);
    newFormData.append("expire_year", date[0]);
    newFormData.append("cvv", values.cvv);
    newFormData.append("full_name", values.cardHolderName);
    let is_default = this.cards.length > 0 ? "false" : "true";
    newFormData.append("is_default", is_default);
    this.ngxService.start();
    this.global.post(
      "payment/addCard",
      newFormData,
      (data) => {
        this.ngxService.stop();
        if (data.status) {
          this.global.showToast("", data.message);
          document.getElementById("closeButton").click();
          this.cardsList();
        } else {
          this.global.showDangerToast("", data.message);
        }
      },
      (err) => {
        this.ngxService.stop();
        this.global.showDangerToast("", err.message);
      },
      true
    );
  }

  closeModal() {
    this.createPaymentForm();
  }

  private initConfig(): void {
    this.payPalConfig = {
      currency: "EUR",
      clientId:
        "AZuZM8X6GUVSCiJzoLiUortfubGvzv9Wr_9HUd7bi4ntsYT9KEiQU1dJugfC3YjHTlrykg8yTbO19vwD",
      createOrderOnClient: (data) =>
        <ICreateOrderRequest>{
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "EUR",
                value: "0.01",
                breakdown: {
                  item_total: {
                    currency_code: "EUR",
                    value: "0.01",
                  },
                },
              },
            },
          ],
        },
      advanced: {
        commit: "true",
      },
      style: {
        label: "paypal",
        layout: "vertical",
      },
      onApprove: (data, actions) => {
        console.log(
          "onApprove - transaction was approved, but not authorized",
          data,
          actions
        );
        actions.order.get().then((details) => {
          console.log(
            "onApprove - you can get full order details inside onApprove: ",
            details
          );
        });
      },
      onClientAuthorization: (data) => {
        console.log(
          "onClientAuthorization - you should probably inform your server about completed transaction at this point",
          data
        );

        // let is_default = this.cards.length > 0 ? "false" : "true";

        // let newFormData = new FormData();
        // newFormData.append("payer_id", data.payer.payer_id);
        // newFormData.append("email", data.payer.email_address);
        // newFormData.append("is_default", is_default);

        // this.global.post(
        //   "payment/addCardReference",
        //   newFormData,
        //   (data) => {
        //     console.log("data: ", data);
        //   },
        //   (err) => {
        //     console.log("error: ", err);
        //     this.global.showDangerToast("", err.message);
        //   },
        //   true
        // );
      },
      onCancel: (data, actions) => {
        console.log("OnCancel", data, actions);
      },
      onError: (err) => {
        console.log("OnError", err);
      },
      onClick: (data, actions) => {
        console.log("onClick", data, actions);
      },
    };
  }

  makePayment(ref, customer_id) {
    let obj = {
      token: this.paypalToken,
      card_id: ref,
      customer_id: customer_id,
      amount: 500
    };
    this.global.post(
      "payment/makePayment",
      obj,
      (data) => {
        // console.log("url: ", data);
        // window.open(data.response, "_blank");
      },
      (err) => { },
      true
    );
  }
}
