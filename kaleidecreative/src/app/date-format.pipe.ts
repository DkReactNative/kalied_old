import { Pipe, PipeTransform } from "@angular/core";
import * as moment from "moment";

@Pipe({
  name: "dateFormat",
  pure: true,
})
export class DateFormatPipe implements PipeTransform {
  transform(value: number, args?: any): any {
    if (args == "calculate") {
      return this.calculateTime(value);
    } else {
      return this.formatDate(value, args);
    }
  }

  formatDate(date, format = "DD-MM-YYYY") {
    return moment(date).format(format);
  }

  calculateTime = (date) => {
    var countDownDate: any = moment(date);
    countDownDate = new Date(countDownDate).getTime();
    var now = new Date().getTime();
    var distance = countDownDate - now;
    var days = Math.floor(Math.abs(distance / (1000 * 60 * 60 * 24)));
    var hours = Math.floor(
      Math.abs((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    );
    var minutes = Math.floor(
      Math.abs((distance % (1000 * 60 * 60)) / (1000 * 60))
    );
    var seconds = Math.floor(Math.abs((distance % (1000 * 60)) / 1000));
    var d = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
    console.log(d);
    if (days > 1) {
      return moment(countDownDate).format("DD/MM/YYYY");
    } else if (days == 1 && days > 0) {
      return "yesterday";
    } else if (hours > 0) {
      return Math.abs(hours) + "hours ago";
    } else if (hours == 0 && minutes > 0) {
      return Math.abs(minutes) + "minutes ago";
    } else if (minutes == 0 && seconds > 10) {
      return Math.abs(seconds) + "seconds ago";
    } else {
      return "now";
    }
  };
}
