import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { GlobalService } from "../global.service";
@Component({
  selector: "profile-component-freelancer",
  templateUrl: "./reusable-profile-component-freelancer.component.html",
  styleUrls: ["./reusable-profile-component-freelancer.component.css"],
})
export class ReusableProfileComponentFreelancerComponent implements OnInit {
  @Input() page;
  @Input() modalService;
  @Input() selectedUser;
  @Input() originalSelectedUser;
  @Input() projectType;
  @Input() industryType;
  @Input() genereType;
  @Input() primarySkill;
  @Input() secondarySkill;
  @Input() graphicSpecialties;
  @Input() editingStyle;
  @Input() awards;
  @Input() profile_image_path;

  @Output() openAddNoteModel = new EventEmitter();
  @Output() OpenModal1 = new EventEmitter();
  @Output() OpenModal2 = new EventEmitter();
  @Output() OpenModal3 = new EventEmitter();
  @Output() OpenModal4 = new EventEmitter();
  @Output() OpenModal5 = new EventEmitter<{ portfolio: object }>();
  @Output() copyLink = new EventEmitter();
  @Output() hideFreelancer = new EventEmitter();
  @Output() closeModal = new EventEmitter();
  @Output() changePortFoliFilter1 = new EventEmitter();
  @Output() changePortFoliFilter2 = new EventEmitter();
  @Output() changePortFoliFilter3 = new EventEmitter();
  @Output() confirmRemove = new EventEmitter();
  @Output() unHideFreelancer = new EventEmitter();
  constructor(public _router: Router, public global: GlobalService) {}

  ngOnInit() {}
  openAddNoteModelEvent() {
    this.openAddNoteModel.emit(event);
  }
  OpenModalEvent(type, portfolio: any = "") {
    switch (type) {
      case 1:
        this.OpenModal1.emit(event);
        break;
      case 2:
        this.OpenModal2.emit(event);
        break;
      case 3:
        this.OpenModal3.emit(event);
        break;
      case 4:
        this.OpenModal4.emit(event);
        break;
      case 5:
        this.OpenModal5.emit({ portfolio: portfolio });
        break;
      default:
        return;
    }
  }

  copyLinkEvent() {
    this.copyLink.emit(event);
  }

  hideFreelancerEvent() {
    this.hideFreelancer.emit(event);
  }

  closeModalEvent() {
    this.closeModal.emit(event);
  }

  changePortFoliFilterEvent(event, type) {
    switch (type) {
      case 1:
        this.changePortFoliFilter1.emit(event);
        break;
      case 2:
        this.changePortFoliFilter2.emit(event);
        break;
      case 3:
        this.changePortFoliFilter3.emit(event);
        break;
      default:
        return;
    }
  }

  getMultipleNameByValue(arr, skills) {
    let arraySkills: any = [];
    for (let i = 0; i < arr.length; i++) {
      if (skills.indexOf(arr[i].value) != -1) {
        arraySkills.push(arr[i].name);
      }
    }
    if (arraySkills.length == 0) return "NA";
    arraySkills = arraySkills.join(", ");
    return arraySkills;
  }

  availabilityName(value) {
    if (value == 1) return "Weekdays";
    if (value == 2) return "Evenings";
    if (value == 3) return "Weekends";
    return "NA";
  }

  tranformPatClient(client = []) {
    let clientName: any = [];
    client.filter((ele) => {
      if (ele.client_name) clientName.push(ele.client_name);
    });
    clientName = clientName.join(", ");
    return clientName;
  }

  confirmRemoveEvent() {
    this.confirmRemove.emit(event);
  }

  unHideFreelancerEvent() {
    this.unHideFreelancer.emit(event);
  }

  navigate(link) {
    this._router.navigate([]).then((result) => {
      window.open(link, "_blank");
    });
  }
}
