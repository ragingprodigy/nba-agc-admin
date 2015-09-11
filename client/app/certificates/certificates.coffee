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
