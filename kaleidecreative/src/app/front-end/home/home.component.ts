import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Router } from "@angular/router";
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  professionalData: any = null;
  editoData: any = null;
  graphicData: any = null;
  clientsData: any = null;
  myControl = new FormControl();
  options: string[] = ["Graphics Artist", "Editor"];
  filteredOptions: Observable<string[]>;
  constructor(private route: Router, public global: GlobalService, private ngxService: NgxUiLoaderService) {
    this.global.hideNavBars = false
    this.getProfessionalData();
    this.getClientsData();
  }

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    $(document).ready(() => {
      this.applyCarousel()
    });
  }
  updateMySelection(e) {
    if (e == "Graphics Artist") {
      this.route.navigate(["/user/client/find-freelancers/1"])
    } else if (e == "Editor") {
      this.route.navigate(["/user/client/find-freelancers/2"])
    }
  }
  applyCarousel() {

    setTimeout(() => {
      $('.editors-owl,.graphics-owl,.camera-owl').owlCarousel({
        loop: true,
        margin: 15,
        nav: true,
        navContainer: false,
        navContainerClass: "owl-nav",
        navElement: "div",
        navClass: ["owl-prev", "nav-next"],
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
          navigation: true,
          navContainer: false,
          navContainerClass: "owl-nav",
          navElement: "div",
          navClass: ["owl-prev", "nav-next"],
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
          .on('changed.owl.carousel', function (event) {
            var current = event.item.index;
            var p = $(event.target).find(".owl-item").eq(current).find(".team-review-hidden p").html();
            $(".team-home .team-review p").text(p);
          })
      // .on('click', '.owl-item', function(event) {
      //     var target = jQuery(this).index();
      //     $('.team-slider').trigger('to.owl.carousel', target);
      // });

      $('.testimonials').owlCarousel({
        loop: true,
        margin: 15,
        navContainer: false,
        navContainerClass: "owl-nav",
        navElement: "div",
        navClass: ["owl-prev", "nav-next"],
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
    }, 2000)
  }

  _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }



  getProfessionalData(page = 1) {
    this.global.get(
      "homeslider/creative/" + page,
      data => {
        this.ngxService.stop();
        if (data.status) {
          this.professionalData = data.response ? data.response : null

          this.editoData = this.professionalData.terms.filter(ele => {
            return ele.profession == 1 && ele
          })

          this.graphicData = this.professionalData.terms.filter(ele => {
            return ele.profession == 2 && ele
          })


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

  getClientsData(page = 1) {
    this.global.get(
      "homeslider/toptier/" + page,
      data => {
        this.ngxService.stop();
        if (data.status) {
          this.clientsData = data.response ? data.response : null
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
