import { Component, OnInit, TemplateRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { GlobalService } from "../../../global.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
// import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
declare var $: any

@Component({
  selector: "app-client-project-message-tab",
  templateUrl: "./client-project-message-tab.component.html",
  styleUrls: ["./client-project-message-tab.component.css"],
})

export class ClientProjectMessageTabComponent implements OnInit {

  public projectId;
  public projectInfo;
  public message: any = "";
  public authUser: any;
  public joinedUsers: any = [];
  public joinedRoom: any;
  public chatMsg: any = [];
  public invitedFreelancers: any = [];
  public otherUser: any;
  public modalRef: BsModalRef;
  public showQuotationModal: Boolean = false;
  public projectAmount: any;
  public projectMessage: String = "";
  public projectFinalAmount: any;
  public projectUrl: String = "";

  constructor(
    private route: Router,
    public global: GlobalService,
    private ngxService: NgxUiLoaderService,
    private router: ActivatedRoute,
    public modalService: BsModalService,
    // private socket: Socket
  ) {
    // super({ url: environment.socketUrl, options: {} });
    this.router.paramMap.subscribe((params) => {
      let str = params.get("id") ? atob(params.get("id")) : "";
      if (str) {
        this.projectId = str;
      }
    });
  }

  ngOnInit() {
    this.authUser = JSON.parse(localStorage.getItem(btoa("user-kc")));

    this.getInvitedFreelances();
    this.getProjectInfo();

    this.global.joined().subscribe((message) => {
      this.joinedUsers.push(message.message);
    })

    this.global.getMessages().subscribe((message: string) => {
      this.chatMsg.push(message);
    });

    this.global.getProposalStatus().subscribe((message) => {
      this.chatMsg.push(message);
    })
  }

  getProjectInfo() {
    this.ngxService.start();
    this.global.get(
      "project/" + this.projectId,
      (data) => {
        this.ngxService.stop();
        if (data.status) {
          this.projectInfo = data.response;
          console.log("projectInfo: ", this.projectInfo);
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

  getInvitedFreelances() {
    this.ngxService.start();
    this.global.get("chat/getInvitedFreelancers/" + this.projectId, data => {
      console.log("dataaaaaa: ", data);
      this.ngxService.stop();
      if (data.status == 1)
        this.invitedFreelancers = data.response;
    }, err => {
      this.ngxService.stop();
      this.global.showDangerToast("", err.message);
    }, true)
  }

  joinRoom(id) {

    let obj = {
      sender_id: this.authUser._id,
      receiver_id: id,
      is_group: false,
      project_id: this.projectId
    }

    if (this.joinedRoom && this.joinedRoom._id) {
      this.global.leaveRoom(this.joinedRoom._id);
    }

    this.ngxService.start();
    this.global.post("chat/getRoomAndMessages/", obj, data => {
      this.ngxService.stop();
      if (data.status == 1) {
        this.joinedRoom = data.response.roomData ? data.response.roomData : {};
        this.chatMsg = data.response.messages;
        let users = data.response.roomData.userData.length > 0 ? data.response.roomData.userData : [];
        if (this.authUser._id != users[0]._id)
          this.otherUser = users[0];
        else
          this.otherUser = users[1];

        this.global.joinRoom(this.joinedRoom._id);
      }
    }, err => {
      this.ngxService.stop();
      this.global.showDangerToast("", err.message);
    }, true)
  }

  sendMessage() {
    if (this.message.trim("") != "") {
      let obj = {
        room: this.joinedRoom._id,
        message: this.message,
        senderId: this.authUser._id,
        type: "text",
      }
      this.global.sendMsg(obj)
      this.message = "";
    } else {
      alert("Message field cannot be empty.");
    }
  }

  openModal(template: TemplateRef<any>, css = "") {
    this.showQuotationModal = true;
    const config = {
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: false,
      class: css,
    };
    this.modalRef = this.modalService.show(template, config);
  }

  projectFinalize() {
    if (this.projectAmount == "" || this.projectAmount == null) return alert("Project Amount cannot be empty.")
    if (this.projectMessage.trim() == "" || this.projectMessage == null) return alert("Message field cannot be empty.")

    let obj = {
      room: this.joinedRoom._id,
      message: this.projectMessage,
      senderId: this.authUser._id,
      type: "proposal",
      type_details: {
        amount: this.projectAmount,
        status: "Pending",
        // final_amount: this.projectFinalAmount, 
        // project_url: this.projectUrl 
      },
    }
    this.global.sendMsg(obj);
    this.modalRef.hide();
  }

  Btoa(id) {
    return btoa(id)
  }

}
