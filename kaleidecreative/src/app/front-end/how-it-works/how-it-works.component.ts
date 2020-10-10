import { GlobalService } from '../global.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
declare var $: any;
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-how-it-works',
  templateUrl: './how-it-works.component.html',
  styleUrls: ['./how-it-works.component.css']
})
export class HowItWorksComponent implements OnInit {


	pageData:any=null;
	professionalData:any=null;
	editoData:any=null;
	graphicData:any=null;
	clientsData:any=null;
	constructor(public global:GlobalService,private ngxService: NgxUiLoaderService) { 
		this.getPageData();
	}

	ngOnInit() {
		$(document).ready(() => {
	      //this.applyCarousel()
	    });
	}

	getPageData() {
		this.global.get(
			"staticpage/how-it-works",
			data =>{
				this.ngxService.stop();  				
				if (data.status) {
					this.pageData=data.response?data.response:null
				}else{
					this.global.showDangerToast(
		              "",
		              data.message
		            );
				}
			},
			err => {
	          this.global.showDangerToast("", err.message);
	        },
	        true
		)
	}  


}
