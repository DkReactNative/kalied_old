import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  NgZone,
} from "@angular/core";
import { GlobalService } from "../global.service";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { Options, LabelType } from "ng5-slider";
import { MapsAPILoader, MouseEvent } from "@agm/core";
import { paymentType } from "../../app.global";

@Component({
  selector: "app-find-work",
  templateUrl: "./find-work.component.html",
  styleUrls: ["./find-work.component.css"],
})
export class FindWorkComponent implements OnInit {
  @ViewChild("search", { static: false }) searchElementRef: ElementRef;
  paymentType = paymentType;
  maxValue: number = 10000;
  minValue: number = 0;
  totalPages = 10;
  currentPage = 2;
  projectType: [];
  genereType: [];
  industryType: [];
  records: any;
  formData: any = {
    freelancer_type: null,
    project_type: null,
    payment_type: null,
    price_range: [],
    genere: null,
    industry: null,
    keyword: null,
    mymatch: false,
    address: "",
    city: "",
    latitude: "",
    longitude: "",
    page: 1,
  };

  options: Options = {
    floor: 0,
    ceil: 10000,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return "<b>Min :</b> $ " + value;
        case LabelType.High:
          return "<b>Max :</b> $ " + value;
        default:
          return "$" + value;
      }
    },
  };

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private route: Router,
    private router: ActivatedRoute,
    public global: GlobalService,
    private ngxService: NgxUiLoaderService
  ) {
    this.getProjectTypes();
    this.filterList(1);
  }

  ngOnInit() {
    $(document).ready(() => {
      this.mapsAPILoaderFunction();
      let that = this;
      $("#geo-filter-input").on("input", function () {
        if ($(this).val() == "") {
          that.filterList(1);
        }
      });
      $("input[name='keyword']").on("blur", () => {
        this.filterList(1);
      });
    });
  }

  userChangeEnd(item: any) {
    console.log(item);
    setTimeout(() => {
      this.filterList(1);
    }, 300);
  }

  changeOption(e, key) {
    if (key == "project_type") {
      this.genereType = [];
      this.industryType = [];
      if (e.target.value) this.getGenereIndustryTypes(e.target.value);
      this.formData.industry = "";
      this.formData.genere = "";
    }
    this.formData[key] = e.target.value;
    // console.log(e.target.value);
    setTimeout(() => {
      this.filterList(1);
    }, 300);
  }

  filterList(page = 1) {
    let newFormData = new FormData();
    if (this.formData.keyword)
      newFormData.append("keyword", this.formData.keyword.trim());

    if (this.formData.project_type && this.formData.project_type != "")
      newFormData.append("project_type", this.formData.project_type);

    if (this.formData.industry && this.formData.industry != "")
      newFormData.append("industry", this.formData.industry);

    if (this.formData.genre && this.formData.genre != "")
      newFormData.append("genre", this.formData.genre);

    if (this.formData.longitude && this.formData.address)
      newFormData.append("longitude", this.formData.longitude);

    if (this.formData.latitude && this.formData.address)
      newFormData.append("latitude", this.formData.latitude);

    if (this.formData.mymatch)
      newFormData.append("mymatch", this.formData.mymatch);

    if (this.formData.payment_type) {
      newFormData.append("payment_type", this.formData.payment_type);
      newFormData.append(
        "price_range",
        JSON.stringify([this.minValue, this.maxValue])
      );
    }

    if (this.formData.freelancer_type)
      newFormData.append("freelancer_type", this.formData.freelancer_type);

    newFormData.append("page", page + "");

    console.log(JSON.stringify(newFormData));
    this.ngxService.start();
    this.global.post(
      this.global.user ? "work/" : "work-auth/",
      newFormData,
      (data) => {
        this.ngxService.stop();
        if (data.status) {
          this.records = data.response;
          this.currentPage = data.response.currentPage;
          this.totalPages = data.response.totalPages;
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

  getProjectTypes() {
    this.ngxService.start();
    this.global.get(
      this.global.user
        ? "profileContent/projectType"
        : "profileContent-auth/projectType",
      (data) => {
        this.ngxService.stop();
        if (data.status) {
          this.projectType = data.response;
        } else {
          //this.global.showDangerToast("", data.message);
        }
      },
      (err) => {
        this.ngxService.stop();
        this.global.showDangerToast("", err.message);
      },
      true
    );
  }

  getGenereIndustryTypes(id) {
    this.ngxService.start();
    this.global.get(
      this.global.user
        ? "profileContent/industry-genre-all/" + id
        : "profileContent-auth/industry-genre-all/" + id,
      (data) => {
        this.ngxService.stop();
        console.log(data);
        if (data.status) {
          let user = data.response;

          this.genereType = user.genereType;

          this.industryType = user.industryType;
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

  mapsAPILoaderFunction() {
    var count = 0;
    var oldaddress: any = {
      address: this.formData.address,
      administrative_area_level_2: this.formData.city,
      administrative_area_level_1: "",
      country: "",
      postal_code: "",
      lat: "",
      long: "",
    };

    this.mapsAPILoader.load().then(() => {
      var input = this.searchElementRef.nativeElement;
      var options = {
        types: ["(cities)"],
      };
      let autocomplete = new google.maps.places.Autocomplete(input, options);
      this.ngZone.run(() => {
        google.maps.event.addListener(autocomplete, "place_changed", () => {
          var place = autocomplete.getPlace();
          // this.emptyAddress()
          oldaddress = {
            address: "",
            administrative_area_level_2: "",
            administrative_area_level_1: "",
            country: "",
            postal_code: "",
            lat: "",
            long: "",
          };
          console.log(place);
          var componentForm = {
            administrative_area_level_2: "long_name",
            administrative_area_level_1: "long_name",
            country: "long_name",
            postal_code: "short_name",
          };
          var val = {};
          for (var i = 0; i < place.address_components.length; i++) {
            var addressType = place.address_components[i].types[0];
            if (componentForm[addressType]) {
              oldaddress[addressType] =
                place.address_components[i][componentForm[addressType]];
            }
          }
          oldaddress["lat"] = place.geometry.location.lat();
          oldaddress["long"] = place.geometry.location.lng();
          oldaddress["address"] = place.formatted_address;
          this.fillAddress(oldaddress);
          count++;
          $("input").blur();
          this.filterList(1);
        });
      });
    });
  }

  fillAddress(address) {
    console.log(address);
    this.formData.address = address.address;
    this.formData.longitude = address.long;
    this.formData.latitude = address.lat;
    $("input").blur();
  }

  Btoa(id) {
    return btoa(id);
  }

  navigate(link) {
    this.route.navigate([link]);
  }

  resetFilters() {
    // this.getProjectTypes();
    // this.filterList(1);
    // this.ngOnInit()
    window.location.reload();
  }
}
