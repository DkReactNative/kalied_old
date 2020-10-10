import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalService } from 'src/app/front-end/global.service';

@Component({
  selector: 'app-freelancer-message-tab',
  templateUrl: './freelancer-message-tab.component.html',
  styleUrls: ['./freelancer-message-tab.component.css']
})
export class FreelancerMessageTabComponent implements OnInit {

  public project_id: any;
  public authUserId: any;
  public projectInfo: any;
  public joinedRoom: any;
  public chatMsg: any;
  public otherUser: any;
  public joinedUsers: any = [];
  public message: any = "";

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private global: GlobalService,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params) => {
      let str = params.get("id") ? atob(params.get("id")) : "";
      if (str) {
        this.project_id = str;
        // console.log("project_id: ", this.project_id);
      }
    });

    this.authUserId = this.global.user._id;
    this.getProjectInfo();

    this.global.joined().subscribe((message) => {
      this.joinedUsers.push(message.message);
    })

    this.global.getMessages().subscribe((message: string) => {
      this.chatMsg.push(message);
    });

    this.global.getProposalStatus().subscribe((message) => {
      this.getProjectInfo();
      // this.chatMsg.push(message);
    })
  }

  getProjectInfo() {
    this.ngxService.start();
    this.global.get(
      "project/" + this.project_id,
      (data) => {
        this.ngxService.stop();
        console.log(data);
        if (data.status) {
          this.projectInfo = data.response;
          console.log("projectInfo: ", this.projectInfo);
          this.joinRoom(this.projectInfo.user_id);
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

  joinRoom(id) {

    let obj = {
      sender_id: this.authUserId,
      receiver_id: id,
      is_group: false,
      project_id: this.project_id
    }

    this.ngxService.start();
    this.global.post("chat/getRoomAndMessages", obj, data => {
      this.ngxService.stop();
      console.log("data:   ", data);
      if (data.status == 1) {
        this.joinedRoom = data.response.roomData ? data.response.roomData : {};
        // console.log("roomData: ", this.joinedUsers)
        this.chatMsg = data.response.messages;
        let users = data.response.roomData.userData.length > 0 ? data.response.roomData.userData : [];
        if (this.authUserId != users[0]._id)
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
        senderId: this.authUserId,
        is_proposal: "text",
      }
      this.global.sendMsg(obj)
      this.message = "";
    } else {
      alert("Message field cannot be empty.");
    }
  }

  proposalResponse(status, message_id) {
    // status = 1 = accepted
    // status = 0 = rejected

    if (status == 1) {

      let obj = {
        room: this.joinedRoom._id,
        message: "Accepted",  // Your proposal is accepted by freelancer, please release the payment.
        senderId: this.authUserId,
        type: "proposal",
        message_id: message_id,
        project_id: this.project_id,
        client_id: this.otherUser._id
      }
      this.global.updateProposal(obj)
      this.message = "";

    } else {
      let obj = {
        room: this.joinedRoom._id,
        message: "Rejected",  // Your proposal is rejected by freelancer.
        senderId: this.authUserId,
        type: "proposal",
        message_id: message_id,
        project_id: this.project_id,
        client_id: this.otherUser._id
      }
      this.global.updateProposal(obj)
      this.message = "";
    }
  }

}
