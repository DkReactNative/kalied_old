import {
  Component,
  Input,
  OnChanges,
  Output,
  OnInit,
  EventEmitter,
} from "@angular/core";

@Component({
  selector: "pagination-component",
  templateUrl: "./pagination-component.component.html",
  styleUrls: ["./pagination-component.component.css"],
})
export class PaginationComponentComponent implements OnInit {
  @Input() totalRecords: number = 0;
  @Input() activePage: number = 0;

  @Output() onPageChange: EventEmitter<number> = new EventEmitter();
  pages;
  ngOnInit() {
    console.log(this.getPageList(20, 7, 9));
  }

  ngOnChanges() {
    this.pages = this.getPageList(this.totalRecords, this.activePage, 9);
  }

  onClickPage(pageNumber: number) {
    if (pageNumber < 1) return;
    if (pageNumber > this.totalRecords) return;
    this.activePage = pageNumber;
    this.pages = this.getPageList(this.totalRecords, this.activePage, 9);
    this.onPageChange.emit(this.activePage);
  }

  getPageList(totalPages, currentPage, maxLength) {
    if (maxLength < 5) throw "maxLength must be at least 5";

    function range(start, end) {
      return Array.from(Array(end - start + 1), (_, i) => i + start);
    }

    var sideWidth = maxLength < 11 ? 1 : 2;

    var leftWidth = (maxLength - sideWidth * 2 - 3) >> 1;
    console.log("left =>", leftWidth);
    var rightWidth = (maxLength - sideWidth * 2 - 2) >> 1;
    console.log("right =>", rightWidth);

    if (totalPages <= maxLength) {
      // no ...(0) in list
      return range(1, totalPages);
    }
    if (currentPage <= maxLength - sideWidth - 1 - rightWidth) {
      //  no add ... (0) on left side
      return range(1, maxLength - sideWidth - 1).concat(
        0,
        range(totalPages - sideWidth + 1, totalPages)
      );
    }
    if (currentPage >= totalPages - sideWidth - 1 - rightWidth) {
      // no add ... (0) on right side
      return range(1, sideWidth).concat(
        0,
        range(totalPages - sideWidth - 1 - rightWidth - leftWidth, totalPages)
      );
    }
    // add ... (0) on both side
    return range(1, sideWidth).concat(
      0,
      range(currentPage - leftWidth, currentPage + rightWidth),
      0,
      range(totalPages - sideWidth + 1, totalPages)
    );
  }
}
