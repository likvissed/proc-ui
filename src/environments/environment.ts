// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  serverUrl: 'http://localhost:3000/requests',

  clientId: 105,
  authorizationUrl: 'https://auth-center.***REMOVED***/oauth/authorize',
  redirectUrl: 'https://localhost.***REMOVED***:8443/users/callbacks/authorize_user',
  tokenUrl: 'https://auth-center.***REMOVED***/oauth/token',

  nameUserHr: 'Operator7141',
  passwordUserHr: 'Operator7141@714',
  usersReferenceUrlLogin: 'https://hr.***REMOVED***/ref-info/api/login',
  usersReferenceUrl: 'https://hr.***REMOVED***/ref-info/api/emp?search',

  procListDutiesUrl: 'http://vm713:5000/duties_list',
  procGetListUrl: 'http://vm713:5000/proxies_list',

  procGetJsonDocUrl: 'http://vm713:5000/docx_info',
  procDownloadFileUrl: 'http://vm713:5000/file_download',

  procGetTemplateDocUrl: 'http://vm713:5000/sample',
  procSendDocUrl: 'http://vm713:5000/ssd_send'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
