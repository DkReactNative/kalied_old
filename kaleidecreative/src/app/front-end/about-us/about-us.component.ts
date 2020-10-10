import { GlobalService } from '../global.service';
import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
declare var $: any;

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {
   pageData:any=null;
   professionalData:any=null;
  editoData:any=null;
  graphicData:any=null;
  clientsData:any=null;
  constructor(public global:GlobalService,private ngxService: NgxUiLoaderService) {
    this.getPageData();
    this.getProfessionalData();
    this.getClientsData();
   }

  ngOnInit() {
  $(document).ready(() => {
      this.applyCarousel()
    });
  }

 applyCarousel(){

    setTimeout(()=>{
           $('.editors-owl,.graphics-owl,.camera-owl').owlCarousel({
          loop: true,
          margin: 15,
          nav: true,
          navContainer: false,
          navContainerClass:"owl-nav",
          navElement: "div",
          navClass:["owl-prev","nav-next"],
          dot: true,
          responsive: {
              0: {
                  items: 1
              },
              600: {
                  items: 1
              },
              1000: {
                  items: 1
              }
          }
      }),

      $('.team-slider').owlCarousel({
          loop: true,
          rewind: true,
          nav: true,
          navigation:true,
          navContainer: false,
          navContainerClass:"owl-nav",
          navElement:"div",
          navClass:["owl-prev","nav-next"],
          center: true,
          dot: true,
          mouseDrag: true,
          // startPosition: 3,
          responsive: {
             0: {
              items: 3
          },
          600: {
              items: 5
          },
          1000: {
              items: 7
          }
          }
      })
      .on('changed.owl.carousel', function(event) {
          var current = event.item.index;
          var p = $(event.target).find(".owl-item").eq(current).find(".team-review-hidden p").html();
          $(".team-home .team-review p").text(p);
      })
      // .on('click', '.owl-item', function(event) {
      //     var target = jQuery(this).index();
      //     console.log(target)
      //     $('.team-slider').trigger('to.owl.carousel', target);
      // });

  $('.testimonials').owlCarousel({
      loop: true,
      margin: 15,
      navContainer: false,
      navContainerClass:"owl-nav",
      navElement:"div",
      navClass:["owl-prev","nav-next"],
      nav: true,
      dot: true,
      responsive: {
          0: {
              items: 1
          },
          600: {
              items: 1
          },
          1000: {
              items: 1
          }
      }
  })
      },2000)
    }
getPageData() {
      this.global.get(
        "staticpage/about-us",
        data => {
          this.ngxService.stop();   
          console.log(data);
          if (data.status) {
            this.pageData=data.response?data.response:null
          } else {
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
      );
    } 

    getProfessionalData(page=1) {
      this.global.get(
         "homeslider/creative/"+page,
        data => {
          this.ngxService.stop();   
          console.log(data);
          if (data.status) {
            this.professionalData=data.response?data.response:null
             
             this.editoData=this.professionalData.terms.filter(ele=>{
             return ele.profession==1 && ele
             })

             this.graphicData=this.professionalData.terms.filter(ele=>{
             return ele.profession==2 && ele
             })

             console.log(this.editoData,this.graphicData)
  
          } else {
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
      );
    }

    getClientsData(page=1) {
      this.global.get(
        "homeslider/toptier/"+page,
        data => {
          this.ngxService.stop();   
          console.log(data);
          if (data.status) {
            this.clientsData=data.response?data.response:null
          } else {
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
      );
    }
}
