// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  auth: {
    clientId: '83',
    redirectUrl: 'https://localhost.***REMOVED***:4200/oauth2/callback',
    serverUrl: 'https://vm713.***REMOVED***:24026/auth/token',
    appName: 'Формирование доверенности (development)',
    jwtOptions: {
      allowedDomains: ['vm713.***REMOVED***:24026'],
      disallowedRoutes: []
    }
  },

  apiUrl: 'https://vm713.***REMOVED***:24026'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
