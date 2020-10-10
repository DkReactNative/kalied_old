import { Component, TemplateRef, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { GlobalService } from "../../../global.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
import {
  paymentType,
  freelancerType,
  projectstatus,
} from "../../../../app.global";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { GlobalVariables } from "../../../../app.global";
@Component({
  selector: "app-freelancer-description-tab",
  templateUrl: "./freelancer-description-tab.component.html",
  styleUrls: ["./freelancer-description-tab.component.css"],
})
export class FreelancerDescriptionTabComponent implements OnInit {

  paymentType = paymentType;
  freelancerType = freelancerType;
  modalRef: BsModalRef;
  projectstatus = projectstatus;
  modifiedProjectStatuc = { 1: "Open" };
  projectId;
  projectInformation;
  quotationMessage: string = "";
  quotationAmount: number = null;
  quotationHours: number = null;
  quotationHourlyRate: number = null;
  amountRequired: boolean = false;
  messageRequired: boolean = false;
  hourlyRateRequired: boolean = false;
  expectedHoursRequired: boolean = false;
  authUser: any;
  payableAmount: any = 0;

  constructor(
    private route: Router,
    public modalService: BsModalService,
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
    this.authUser = this.global.user;
    this.getProjectInfo();
  }

  getProjectInfo() {
    this.ngxService.start();
    this.global.get(
      "project/" + this.projectId,
      (data) => {
        this.ngxService.stop();
        if (data.status) {
          this.projectInformation = data.response;
          this.quotationHourlyRate = this.projectInformation.hourly_rate;
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

  getMultipleNameByValue(arr) {
    if (arr.length == 0) return "N/A";
    arr = arr.map((ele) => ele.name);
    arr = arr.join(", ");
    return arr;
  }

  OpenModal(template: TemplateRef<any>, css = "") {
    const config = {
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: false,
      class: css,
    };
    this.modalRef = this.modalService.show(template, config);
  }

  closeModel() {
    this.modalRef.hide();
    this.quotationHours = 0;
    this.quotationMessage = "";
    this.payableAmount = 0;
  }

  Btoa(id) {
    return btoa(id);
  }

  applyForProject() {
    if (this.projectInformation.payment_type == GlobalVariables.Hourly_payment && this.quotationHourlyRate == null) {
      return this.hourlyRateRequired = true;
    }

    if (this.projectInformation.payment_type == GlobalVariables.Hourly_payment && this.quotationHours == null) {
      return this.expectedHoursRequired = true;
    }

    if (this.projectInformation.payment_type == GlobalVariables.Fixed_budget && this.quotationAmount == null) {
      this.amountRequired = true;
    }

    if (this.quotationMessage != "") {
      this.messageRequired = false;
      this.amountRequired = false;
      this.hourlyRateRequired = false;
      this.expectedHoursRequired = false;

      let formData = new FormData();
      formData.append("message", this.quotationMessage.toString());
      formData.append("project_id", this.projectId);
      if (this.projectInformation.payment_type == GlobalVariables.Fixed_budget)
        formData.append("fixed_amount", this.quotationAmount.toString());
      else
        formData.append("hourly_rate", this.quotationHourlyRate.toString());
      formData.append("candidate_type", "2");
      formData.append("total_hours", this.quotationHours.toString());

      this.global.post("work/submit-quote", formData, data => {
        if (data.status) {
          this.global.showToast("", data.message);
        } else {
          this.global.showDangerToast("", data.message);
        }
        this.closeModel();
      }, err => {
        this.closeModel();
        this.ngxService.stop();
        this.global.showDangerToast("", err.message);
      }, true)
    } else {
      this.messageRequired = true;
    }
  }

  totalPayable() {
    if (this.quotationHourlyRate != null && this.quotationHours != null) {
      let figure: any = this.quotationHours * this.quotationHourlyRate;
      this.payableAmount = figure + figure * 10 / 100;
    } else {
      this.payableAmount = 0
    }
  }

}
