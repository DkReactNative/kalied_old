import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(public global:GlobalService) { }

  ngOnInit() {
  }
  openUrl(type) {
    window.open(type, "_blank");
  }
}
