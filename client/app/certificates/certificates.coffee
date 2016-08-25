'use strict'

angular.module 'nbaAgcAdminApp'
.config ($stateProvider) ->
  $stateProvider.state 'certificates',
    url: '/certificates'
    requireLogin: true
    templateUrl: 'app/certificates/main.html'
    abstract: true

  .state 'certificates.branches',
    url: '/branches'
    requireLogin: true
    templateUrl: 'app/certificates/certificates.html'
    controller: 'CertificatesCtrl'

  .state 'certificates.onsite_branches',
    url: '/onsite_branches'
    requireLogin: true
    templateUrl: 'app/certificates/onsite_certificates.html'
    controller: 'OnsiteCertificatesCtrl'

  .state 'vip_print',
    url: '/certificates/vip/:type'
    requireLogin: true
    templateUrl: 'app/certificates/print.html'
    controller: 'VipPrintCtrl'

  .state 'print_branch',
    url: '/certificates/print/:branch'
    requireLogin: true
    templateUrl: 'app/certificates/print.html'
    controller: 'PrintCtrl'

  .state 'print_onsite_branch',
    url: '/certificates/print_onsite/:branch'
    requireLogin: true
    templateUrl: 'app/certificates/print.html'
    controller: 'PrintOnsiteCtrl'

  .state 'custom_certificates',
    url: '/custom_certificates'
    requireLogin: true
    templateUrl: 'app/certificates/custom_certs.html'
    controller: 'CustomCertsController'

  .state 'offline_certificates',
    url: '/offline_certificates'
    requireLogin: true
    templateUrl: 'app/certificates/offline_certs.html'
    controller: 'OfflineRegCertsController'
