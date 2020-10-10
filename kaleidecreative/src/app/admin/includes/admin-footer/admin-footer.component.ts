import { Component, OnInit, Input } from '@angular/core';
import { MyservicesService } from "../../../myservices.service";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-admin-footer',
  templateUrl: './admin-footer.component.html',
  styleUrls: ['./admin-footer.component.css']
})
export class AdminFooterComponent implements OnInit {
  globals = environment;
  @Input() globalSettings;
  constructor() { }

  ngOnInit() {
  }
}
