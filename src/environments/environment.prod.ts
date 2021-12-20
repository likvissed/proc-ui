export const environment = {
  production: true,

  serverUrl: 'http://localhost:3000/requests',

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
