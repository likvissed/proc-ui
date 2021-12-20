// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  serverUrl: 'http://localhost:3000/requests',

  auth: {
    clientId: '83',
    redirectUrl: 'https://localhost.***REMOVED***:4200/oauth2/callback',
    serverUrl: 'https://vm713.***REMOVED***:24026/auth/token',
    appName: 'Формирование доверенности',
    // jwtOptions: {
    //   allowedDomains: ['localhost:3000'],
    //   disallowedRoutes: ['http://localhost:3000/example_route']
    // }
  },

  clientId: 105,
  authorizationUrl: 'https://auth-center.***REMOVED***/oauth/authorize',
  redirectUrl: 'https://localhost.***REMOVED***:8443/users/callbacks/authorize_user',
  tokenUrl: 'https://auth-center.***REMOVED***/oauth/token',

  nameUserHr: 'Operator7141',
  passwordUserHr: 'Operator7141@714',
  usersReferenceUrlLogin: 'https://hr.***REMOVED***/ref-info/api/login',
  usersReferenceUrl: 'https://hr.***REMOVED***/ref-info/api/emp',
  usersReferenceSearchUrl: 'https://hr.***REMOVED***/ref-info/api/emp?search',

  procListDutiesUrl: 'https://vm713.***REMOVED***:24026/duties_list',
  procGetListUrl: 'https://vm713.***REMOVED***:24026/proxies_list',

  procGetJsonDocUrl: 'http://vm713:5000/docx_info',
  procDownloadFileUrl: 'https://vm713.***REMOVED***:24026/file_download',

  procGetTemplateDocUrl: 'http://vm713:5000/sample',
  procSendDocUrl: 'https://vm713.***REMOVED***:24026/ssd_send',
  procDeleteDocUrl: 'https://vm713.***REMOVED***:24026/delete_proxy',

  procListChancellyUrl: 'https://vm713.***REMOVED***:24026/agreed_proxies',
  procWithdrawChancellyUrl: 'https://vm713.***REMOVED***:24026/proxy_revoke',
  procSearchDocChancellyUrl: 'https://vm713.***REMOVED***:24026/proxy_search',
  addNumberAndScanDocUrl: 'https://vm713.***REMOVED***:24026/add_deloved_id'

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
