import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "getMultipleNameByValue",
})
export class GetMultipleNameByValuePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    return this.getMultipleNameByValue(value, args);
  }

  getMultipleNameByValue(arr, skills) {
    if (typeof skills != "object") {
      let arr = [];
      arr.push(skills);
      skills = arr;
    }
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
}
