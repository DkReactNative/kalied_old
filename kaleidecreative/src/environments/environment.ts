// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  socketUrl: "http://localhost:8080/",
  website: "http://localhost:4200/",
  apiUrl: "http://localhost:8080/webservice/",
  // apiUrl: "http://192.168.1.38:8080/webservice/",
  // socketUrl: "http://192.168.1.38:8080/",
  // website: "http://192.168.1.38:4200/",
  // apiUrl: "https://devnode.devtechnosys.tech:17315/webservice/",
  // apiUrl : "https://devnode.devtechnosys.tech:17315/webservice/",
  setupTime: new Date().getTime(),
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
