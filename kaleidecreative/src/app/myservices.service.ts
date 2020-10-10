import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "../environments/environment";
import { Http, Headers, RequestOptions } from "@angular/http";
import "rxjs/add/operator/map";

@Injectable({
  providedIn: "root",
})
export class MyservicesService {
  pageIndex: any = 1;
  AuthToken: any;
  setupTime = environment.setupTime;
  setupHours = 24 * 60 * 60 * 1000;
  loader: any;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    public http2: Http
  ) { }

  async checkAdminLogin() {
    var now = new Date().getTime();
    var setupTime = localStorage.getItem("setupTime-kc-admin");
    console.log(now - parseInt(setupTime), this.setupHours);
    if (setupTime == null) {
      localStorage.setItem("setupTime-kc-admin", this.setupTime + "");
    } else {
      if (now - parseInt(setupTime) > this.setupHours) {
        localStorage.clear();
        localStorage.setItem("setupTime-kc-admin", this.setupTime + "");
      }
    }

    var user = localStorage.getItem("CFadminuser");
    if (user) {
      if (user.length != 0 && user != null) return true;
    }
    this.router.navigate(["/admin/login"]);
  }

  async checkAdminLogout() {
    var user = localStorage.getItem("CFadminuser");
    if (!user) {
      return true;
    } else if (user.length == 0 || user == null) {
      return true;
    }
    this.router.navigate(["/admin"]);
  }

  async adminLogout() {
    localStorage.removeItem("CFadminuser");
    localStorage.removeItem("CFadminuserData");
    this.router.navigate(["/admin/login"]);
  }

  async apiCall(url, data) {
    if (url) {
      var apiUrl = environment.apiUrl + url;
      return await this.http
        .post<any>(apiUrl, data)
        .toPromise()
        .then((response) => {
          return response;
        });
    }
  }

  async adminApiCall(url, data) {
    if (url) {
      var apiUrl = environment.apiUrl + "admin/" + url;
      return await this.http
        .post<any>(apiUrl, data)
        .toPromise()
        .then((response) => {
          return response;
        });
    }
  }

  public post(url, data, successCallback, failedCallback, loader = false) {
    let headers =
      localStorage.getItem("authtoken") != null ||
        localStorage.getItem("authtoken") != undefined
        ? new Headers({
          Authorization: "Bearer " + localStorage.getItem("authtoken"),
        })
        : null;
    let options = new RequestOptions({
      headers: headers,
    });
    if (loader) {
      this.loader = true;
    }
    this.http2
      .post(environment.apiUrl + url, data, options)
      .map((res) => res.json())
      .subscribe(
        (data) => {
          this.loader = false;
          successCallback(data);
        },
        (err) => {
          this.loader = false;
          failedCallback(err);
        }
      );
  }

  public get(url, successCallback, failedCallback, loader = false) {
    let headers =
      localStorage.getItem("authtoken") != null ||
        localStorage.getItem("authtoken") != undefined
        ? new Headers({
          Authorization: "Bearer " + localStorage.getItem("authtoken"),
        })
        : null;
    let options = new RequestOptions({
      headers: headers,
    });
    if (loader) {
      this.loader = true;
    }
    this.http2
      .get(environment.apiUrl + url, options)
      .map((res) => res.json())
      .subscribe(
        (data) => {
          this.loader = false;
          successCallback(data);
        },
        (err) => {
          this.loader = false;
          failedCallback(err);
        }
      );
  }
  public put(url, data, successCallback, failedCallback, loader = false) {
    let headers =
      localStorage.getItem("authtoken") != null ||
        localStorage.getItem("authtoken") != undefined
        ? new Headers({
          Authorization: "Bearer " + localStorage.getItem("authtoken"),
        })
        : null;
    let options = new RequestOptions({
      headers: headers,
    });
    if (loader) {
      this.loader = true;
    }
    this.http2
      .put(environment.apiUrl + url, data, options)
      .map((res) => res.json())
      .subscribe(
        (data) => {
          this.loader = false;
          successCallback(data);
        },
        (err) => {
          this.loader = false;
          failedCallback(err);
        }
      );
  }

  public delete(url, successCallback, failedCallback, loader = false) {
    let headers =
      localStorage.getItem("authtoken") != null ||
        localStorage.getItem("authtoken") != undefined
        ? new Headers({
          Authorization: "Bearer " + localStorage.getItem("authtoken"),
        })
        : null;
    let options = new RequestOptions({
      headers: headers,
    });
    if (loader) {
      this.loader = true;
    }
    this.http2
      .delete(environment.apiUrl + url, options)
      .map((res) => res.json())
      .subscribe(
        (data) => {
          this.loader = false;
          successCallback(data);
        },
        (err) => {
          this.loader = false;
          failedCallback(err);
        }
      );
  }
}
