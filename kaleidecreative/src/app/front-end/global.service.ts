import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions } from "@angular/http";
import "rxjs/add/operator/map";
import { environment } from "src/environments/environment";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import * as Rx from 'rxjs/Rx';
import * as io from 'socket.io-client';
import { map } from 'rxjs/operators';
// import {BehaviorSubject} from 'rxjs/BehaviorSubject';
// import * as socketio from 'socket.io-client';
@Injectable({
  providedIn: "root",
})
export class GlobalService {
  loader;
  apiUrl = environment.apiUrl;
  websiteUrl = environment.website;
  hideNavBars: any = false;
  loginTime: any = null;
  setupTime = environment.setupTime;
  setupHours = 24 * 60 * 60 * 1000;
  isLogin = false;
  user: any;
  AuthToken: any = null;
  routeParams;
  configData: any = null;
  // connected$ = new BehaviorSubject<boolean>(false);

  constructor(
    public http: Http,
    public toastrService: ToastrService,
    public router: Router,
    private socket: Socket
  ) {
    toastrService["options"] = {
      preventDuplicates: true,
      preventOpenDuplicates: true,
    };

    // this.socket = socketio(environment.socketUrl, environment.socketUrl);
    // this.socket.on('connect', () => this.connected$.next(true));
    // this.socket.on('disconnect', () => this.connected$.next(false));
  }

  public post(
    url,
    body,
    successCallback,
    failedCallback,
    loader = false,
    text = "Please wait..."
  ) {
    let headers =
      this.AuthToken != null || this.AuthToken != undefined
        ? new Headers({
          // "Content-Type": "application/json",
          Authorization: "Bearer " + this.AuthToken,
        })
        : new Headers({
          // "Content-Type": "application/json"
        });

    let options = new RequestOptions({
      headers: headers,
    });

    if (loader) {
      this.loader = true;
    }

    this.http
      .post(this.apiUrl + "user/" + url, body, options)
      .map((res) => res.json())
      .subscribe(
        (data) => {
          this.loader = false;
          if (data.success) {
          }
          successCallback(data);
        },
        (err) => {
          this.loader = false;
          let online = window.navigator.onLine;
          let error = {};
          if (!online) {
            error["message"] = "Please check your internet";
          } else if (err.statusText) {
            error["message"] = err.statusText;
          } else {
            error["message"] =
              "Server is not responding. Please try again after some time";
          }
          this.loader = false;
          console.log("err => ", error);
          failedCallback(error);
        }
      );
  }

  get(url, successCallback, failedCallback, loader = true) {
    let headers = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.AuthToken,
    });

    let options = new RequestOptions({
      headers: headers,
    });
    if (loader) {
      this.loader = true;
    }

    this.http
      .get(this.apiUrl + "user/" + url, options)
      .map((res) => res.json())
      .subscribe(
        (data) => {
          this.loader = false;
          if (data.success) {
          }
          successCallback(data);
        },
        (err) => {
          this.loader = false;
          let online = window.navigator.onLine;
          let error = {};
          if (!online) {
            error["message"] = "Please check your internet";
          } else if (err.statusText) {
            error["message"] = err.statusText;
          } else {
            error["message"] =
              "Server is not responding. Please try again after some time";
          }
          this.loader = false;
          console.log("err => ", error);
          failedCallback(error);
        }
      );
  }

  getConfigData() {
    let newFormData = new FormData();
    this.post(
      "config",
      newFormData,
      (data) => {
        if (data.status) {
          this.configData = data.response ? data.response : null;
        } else {
          this.showDangerToast("", data.message);
        }
      },
      (err) => {
        this.showDangerToast("", err.message);
      },
      true
    );
  }

  updateUserSession() {
    this.get(
      "profile/" + this.user._id,
      (data) => {
        if (data.status) {
          if (data.response.status) {
            localStorage.setItem(
              btoa("user-kc"),
              JSON.stringify(data.response)
            );
            this.user = data.response;
            this.isLogin = true;
            localStorage.setItem(btoa("AuthToken-kc"), data.response.token);
            this.AuthToken = data.response.token;
          }
        } else {
          this.showDangerToast("", data.message);
        }
      },
      (err) => {
        this.showDangerToast("", err.message);
      },
      true
    );
  }

  showToast(title = "Success", message = "") {
    this.toastrService.success(title, message);
  }

  showDangerToast(title = "Error", message = "") {
    this.toastrService.error(title, message);
  }

  showWarningToast(title = "", message = "") {
    this.toastrService.warning(title, message);

  }

  // SOCKET FUNCTIONS

  public getMessages = () => {
    return Observable.create((observer) => {
      this.socket.on('new message', (message) => {
        observer.next(message);
      });
    });
  }

  public joined = () => {
    return Observable.create((observer) => {
      this.socket.on("user joined", (message) => {
        observer.next(message);
      })
    })
  }

  public getProposalStatus = () => {
    return Observable.create((observer) => {
      this.socket.on("proposal updated", (message) => {
        observer.next(message);
      })
    })
  }

  public joinRoom(roomId) {
    this.socket.emit('join', roomId);
  }

  public leaveRoom(roomId) {
    this.socket.emit('leave', roomId);
  }

  public sendMsg(obj) {
    this.socket.emit('sendMessage', obj);
  }

  public updateProposal(obj) {
    this.socket.emit('updateProposal', obj);
  }

}
